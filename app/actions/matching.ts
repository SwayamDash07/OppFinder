"use server";

import { connectToDatabase } from "@/lib/db";
import { getCurrentAccount } from "@/lib/auth";
import {
  matchOpportunitiesForProfile,
  type LlmEligibilityMatch,
  type MatchableOpportunity
} from "@/lib/matching";
import { MatchResultModel, getMatchResultCacheCutoff } from "@/lib/models/match-result";
import { OpportunityModel } from "@/lib/models/opportunity";
import type { UserProfile } from "@/lib/profile";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCurrentProfile } from "@/lib/server-session";
import { getCachedGitHubSignal, mergeGitHubSignal } from "@/lib/github";

export type EnrichedEligibilityMatch = Awaited<
  ReturnType<typeof matchOpportunitiesForProfile>
>["matches"][number] & {
  opportunity: Pick<
    MatchableOpportunity,
    "title" | "category" | "description" | "deadline" | "link" | "tags" | "value"
  >;
};

export type MatchingActionState =
  | {
      ok: true;
      source: "ai" | "fallback";
      generatedAt: string;
      cacheStatus: "hit" | "miss" | "refresh";
      matches: EnrichedEligibilityMatch[];
    }
  | {
      ok: false;
      error: string;
    };

export type CoreMatchingActionState =
  | {
      ok: true;
      generatedAt: string;
      matches: LlmEligibilityMatch[];
    }
  | {
      ok: false;
      error: string;
    };

export async function runCoreEligibilityMatching(): Promise<CoreMatchingActionState> {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  if (!account || !profile) {
    return {
      ok: false,
      error: "Save your profile before running eligibility matching."
    };
  }

  try {
    const enrichedProfile = await enrichProfileForMatching(account.id, profile);
    const opportunities = await loadOpportunities();
    const result = await matchOpportunitiesForProfile(enrichedProfile, opportunities);

    return {
      ok: true,
      generatedAt: result.generatedAt,
      matches: result.matches.map(({ opportunityId, eligible, reason, urgencyScore }) => ({
        opportunityId,
        eligible,
        reason,
        urgencyScore
      }))
    };
  } catch (error) {
    console.error("Core eligibility matching failed", error);

    return {
      ok: false,
      error: "Eligibility matching could not run right now."
    };
  }
}

export async function runEligibilityMatching(): Promise<MatchingActionState> {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  if (!account || !profile) {
    return {
      ok: false,
      error: "Login and save your profile before running eligibility matching."
    };
  }

  const limited = await checkRateLimit("matching", 3, 60 * 1000);

  if (!limited.ok) {
    return {
      ok: false,
      error: "Matching is busy. Please wait a moment and try again."
    };
  }

  let opportunities: MatchableOpportunity[];

  try {
    opportunities = await loadOpportunities();
  } catch (error) {
    console.error("Opportunity loading failed", error);

    return {
      ok: false,
      error: "No MongoDB opportunities are available to match yet."
    };
  }

  if (opportunities.length === 0) {
    return {
      ok: false,
      error: "No opportunities are available to match yet."
    };
  }

  const enrichedProfile = await enrichProfileForMatching(account.id, profile);
  const profileKey = getProfileKey(account.id, profile);
  const cachedResult = await getCachedMatchResult(profileKey);
  let result: Awaited<ReturnType<typeof matchOpportunitiesForProfile>>;
  let cacheStatus: "hit" | "miss" | "refresh" = "miss";

  if (cachedResult) {
    result = {
      source: "ai",
      generatedAt: cachedResult.generatedAt.toISOString(),
      matches: cachedResult.matches
    };
    cacheStatus = "hit";
  } else {
    try {
      result = await matchOpportunitiesForProfile(enrichedProfile, opportunities);
      await cacheMatchResult(profileKey, result);
    } catch (error) {
      console.error("Eligibility matching failed", error);

      return {
        ok: false,
        error: "Eligibility matching could not run right now."
      };
    }
  }
  const opportunitiesById = new Map(
    opportunities.map((opportunity) => [opportunity.id, opportunity])
  );

  return {
    ok: true,
    source: result.source,
    generatedAt: result.generatedAt,
    cacheStatus,
    matches: enrichMatches(result.matches, opportunitiesById)
  };
}

export async function getCachedEligibilityMatching(): Promise<MatchingActionState> {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  if (!account || !profile) {
    return {
      ok: false,
      error: ""
    };
  }

  let opportunities: MatchableOpportunity[];

  try {
    opportunities = await loadOpportunities();
  } catch (error) {
    console.error("Opportunity loading failed", error);

    return {
      ok: false,
      error: ""
    };
  }

  const cachedResult = await getCachedMatchResult(getProfileKey(account.id, profile));

  if (!cachedResult) {
    return {
      ok: false,
      error: ""
    };
  }

  const opportunitiesById = new Map(
    opportunities.map((opportunity) => [opportunity.id, opportunity])
  );

  return {
    ok: true,
    source: "ai",
    generatedAt: cachedResult.generatedAt.toISOString(),
    cacheStatus: "hit",
    matches: enrichMatches(cachedResult.matches, opportunitiesById)
  };
}

export async function runEligibilityMatchingFormAction(
  _previousState: MatchingActionState,
  formData: FormData
) {
  if (formData.get("refresh") === "1") {
    return runEligibilityMatchingWithRefresh();
  }

  return runEligibilityMatching();
}

async function runEligibilityMatchingWithRefresh(): Promise<MatchingActionState> {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  if (!account || !profile) {
    return {
      ok: false,
      error: "Login and save your profile before running eligibility matching."
    };
  }

  const limited = await checkRateLimit("matching-refresh", 2, 60 * 1000);

  if (!limited.ok) {
    return {
      ok: false,
      error: "Refresh is busy. Please wait a moment and try again."
    };
  }

  let opportunities: MatchableOpportunity[];

  try {
    opportunities = await loadOpportunities();
  } catch (error) {
    console.error("Opportunity loading failed", error);

    return {
      ok: false,
      error: "No MongoDB opportunities are available to match yet."
    };
  }

  try {
    const enrichedProfile = await enrichProfileForMatching(account.id, profile);
    const result = await matchOpportunitiesForProfile(enrichedProfile, opportunities);
    const profileKey = getProfileKey(account.id, profile);
    await cacheMatchResult(profileKey, result);
    const opportunitiesById = new Map(
      opportunities.map((opportunity) => [opportunity.id, opportunity])
    );

    return {
      ok: true,
      source: result.source,
      generatedAt: result.generatedAt,
      cacheStatus: "refresh",
      matches: enrichMatches(result.matches, opportunitiesById)
    };
  } catch (error) {
    console.error("Eligibility matching failed", error);

    return {
      ok: false,
      error: "Eligibility matching could not run right now."
    };
  }
}

async function enrichProfileForMatching(accountId: string, profile: UserProfile) {
  if (!profile.githubUsername) {
    return profile;
  }

  const signal = await getCachedGitHubSignal(accountId, profile.githubUsername);
  return mergeGitHubSignal(profile, signal);
}

async function loadOpportunities(): Promise<MatchableOpportunity[]> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();

  const opportunities = await OpportunityModel.find({})
    .sort({ deadline: 1 })
    .lean<
      {
        _id: { toString(): string };
        title: string;
        category: MatchableOpportunity["category"];
        description: string;
        eligibilityCriteria: MatchableOpportunity["eligibilityCriteria"];
        deadline: Date;
        link: string;
        tags: string[];
        value: string;
      }[]
    >();

  return opportunities.map((opportunity) => ({
    id: opportunity._id.toString(),
    title: opportunity.title,
    category: opportunity.category,
    description: opportunity.description,
    eligibilityCriteria: opportunity.eligibilityCriteria,
    deadline: opportunity.deadline.toISOString(),
    link: opportunity.link,
    tags: opportunity.tags,
    value: opportunity.value
  }));
}

function enrichMatches(
  matches: Awaited<ReturnType<typeof matchOpportunitiesForProfile>>["matches"],
  opportunitiesById: Map<string, MatchableOpportunity>
) {
  return matches
    .map((match) => {
      const opportunity = opportunitiesById.get(match.opportunityId);

      if (!opportunity) {
        return null;
      }

      return {
        ...match,
        opportunity: {
          title: opportunity.title,
          category: opportunity.category,
          description: opportunity.description,
          deadline: opportunity.deadline,
          link: opportunity.link,
          tags: opportunity.tags,
          value: opportunity.value
        }
      };
    })
    .filter((match): match is EnrichedEligibilityMatch => Boolean(match));
}

async function getCachedMatchResult(profileKey: string) {
  const cacheCutoff = getMatchResultCacheCutoff();

  return MatchResultModel.findOne({
    profileKey,
    generatedAt: {
      $gte: cacheCutoff
    }
  })
    .sort({ generatedAt: -1 })
    .lean<{
      profileKey: string;
      generatedAt: Date;
      matches: Awaited<ReturnType<typeof matchOpportunitiesForProfile>>["matches"];
    }>();
}

async function cacheMatchResult(
  profileKey: string,
  result: Awaited<ReturnType<typeof matchOpportunitiesForProfile>>
) {
  await MatchResultModel.create({
    profileKey,
    generatedAt: new Date(result.generatedAt),
    matches: result.matches
  });
}

function getProfileKey(accountId: string, profile: UserProfile) {
  const profileKey = (
    profile.studentEmailDomain ||
    profile.githubUsername ||
    `${profile.role}:${profile.country}:${profile.skills.join(",")}`
  ).toLowerCase();

  return `${accountId}:${profileKey}`;
}
