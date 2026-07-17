import { config } from "dotenv";
import { resolve } from "node:path";
import OpenAI from "openai";
import { connectToDatabase } from "../lib/db";
import {
  buildSingleOpportunityPrompt,
  matchOpportunitiesForProfile,
  type MatchableOpportunity
} from "../lib/matching";
import { MatchResultModel } from "../lib/models/match-result";
import { OpportunityModel } from "../lib/models/opportunity";
import { UserProfileModel } from "../lib/models/user-profile";
import type { UserProfile } from "../lib/profile";

config({ path: resolve(process.cwd(), ".env.local") });

const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

type MatchRecord = {
  opportunityId: string;
  eligible: boolean;
  reason: string;
  urgencyScore: number;
  relevanceScore?: number;
  missingCriteria?: string[];
};

function getProfileKey(profile: UserProfile) {
  return (
    profile.studentEmailDomain ||
    profile.githubUsername ||
    `${profile.role}:${profile.country}:${profile.skills.join(",")}`
  ).toLowerCase();
}

function validateMatchSchema(match: MatchRecord) {
  return (
    typeof match.opportunityId === "string" &&
    match.opportunityId.length > 0 &&
    typeof match.eligible === "boolean" &&
    typeof match.reason === "string" &&
    match.reason.trim().length > 0 &&
    typeof match.urgencyScore === "number" &&
    match.urgencyScore >= 1 &&
    match.urgencyScore <= 5
  );
}

async function loadOpportunities(): Promise<MatchableOpportunity[]> {
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

async function measureSampleTokens(profile: UserProfile, opportunity: MatchableOpportunity) {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });

  const response = await client.chat.completions.create({
    model: groqModel,
    messages: [
      {
        role: "system",
        content:
          "You are OppFinder's eligibility analyst. Compare one user's profile to one opportunity's structured eligibility criteria. Return strict JSON only. Do not invent requirements. Make the reason specific to the user's role, year, country, skills, interests, GitHub username, and student email signal when relevant."
      },
      {
        role: "user",
        content: buildSingleOpportunityPrompt(profile, opportunity)
      }
    ],
    max_completion_tokens: 700,
    response_format: {
      type: "json_object"
    }
  });

  return response.usage;
}

async function main() {
  if (!process.env.GROQ_API_KEY || !process.env.MONGODB_URI) {
    throw new Error("GROQ_API_KEY and MONGODB_URI must be configured in .env.local");
  }

  await connectToDatabase();

  const storedProfile = await UserProfileModel.findOne({}).sort({ updatedAt: -1 }).lean<UserProfile>();

  if (!storedProfile) {
    throw new Error("No profile found in MongoDB. Save a profile first.");
  }

  const profile: UserProfile = {
    role: storedProfile.role,
    yearOfStudy: storedProfile.yearOfStudy,
    country: storedProfile.country,
    skills: storedProfile.skills,
    interests: storedProfile.interests,
    githubUsername: storedProfile.githubUsername,
    studentEmailDomain: storedProfile.studentEmailDomain
  };

  const opportunities = await loadOpportunities();
  const profileKey = getProfileKey(profile);

  console.log("=== OppFinder live matching test ===");
  console.log(`Profile key: ${profileKey}`);
  console.log(`Opportunities loaded: ${opportunities.length}`);
  console.log(
    `Throttle config: batchSize=${process.env.GROQ_BATCH_SIZE || 1}, intervalMs=${process.env.GROQ_BATCH_INTERVAL_MS || 30000}`
  );

  const sampleUsage = await measureSampleTokens(profile, opportunities[0]);
  console.log("Sample request token usage:", sampleUsage);

  await MatchResultModel.deleteMany({ profileKey });

  const missStartedAt = Date.now();
  let missError: string | null = null;
  let missResult: Awaited<ReturnType<typeof matchOpportunitiesForProfile>> | null = null;

  try {
    missResult = await matchOpportunitiesForProfile(profile, opportunities);
  } catch (error) {
    missError = error instanceof Error ? error.message : String(error);
  }

  const missElapsedSeconds = Number(((Date.now() - missStartedAt) / 1000).toFixed(1));

  if (missError || !missResult) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          phase: "cache-miss",
          elapsedSeconds: missElapsedSeconds,
          error: missError || "Matching returned no result"
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  const schemaValid = missResult.matches.every(validateMatchSchema);
  const shortlistCount = Math.min(
    Number(process.env.MATCH_SHORTLIST_LIMIT || 18),
    opportunities.length
  );

  await MatchResultModel.create({
    profileKey,
    generatedAt: new Date(missResult.generatedAt),
    matches: missResult.matches
  });

  const hitStartedAt = Date.now();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const cached = await MatchResultModel.findOne({
    profileKey,
    generatedAt: { $gte: oneHourAgo }
  })
    .sort({ generatedAt: -1 })
    .lean<{ matches: MatchRecord[]; generatedAt: Date }>();
  const hitElapsedSeconds = Number(((Date.now() - hitStartedAt) / 1000).toFixed(3));

  console.log(
    JSON.stringify(
      {
        ok: true,
        rateLimitError: false,
        opportunitiesTotal: opportunities.length,
        shortlistLimit: shortlistCount,
        matchesReturned: missResult.matches.length,
        cacheMissElapsedSeconds: missElapsedSeconds,
        cacheHitElapsedSeconds: hitElapsedSeconds,
        cacheHit: Boolean(cached),
        cachedMatchCount: cached?.matches.length ?? 0,
        schemaValid,
        sampleUsage
      },
      null,
      2
    )
  );

  process.exit(0);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  const isRateLimit =
    message.includes("429") ||
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("tokens per minute");

  console.log(
    JSON.stringify(
      {
        ok: false,
        rateLimitError: isRateLimit,
        error: message
      },
      null,
      2
    )
  );

  process.exit(1);
});
