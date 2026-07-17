import { getCurrentAccount } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { MatchResultModel, getMatchResultCacheCutoff } from "@/lib/models/match-result";
import type { UserProfile } from "@/lib/profile";

export type MatchCacheSummary = {
  totalMatched: number;
  highUrgencyCount: number;
  lastUpdated: string | null;
};

function getProfileKey(accountId: string, profile: UserProfile) {
  const profileKey = (
    profile.studentEmailDomain ||
    profile.githubUsername ||
    `${profile.role}:${profile.country}:${profile.skills.join(",")}`
  ).toLowerCase();

  return `${accountId}:${profileKey}`;
}

export async function getMatchCacheSummary(
  profile: UserProfile
): Promise<MatchCacheSummary> {
  const account = await getCurrentAccount();

  if (!account || !process.env.MONGODB_URI) {
    return {
      totalMatched: 0,
      highUrgencyCount: 0,
      lastUpdated: null
    };
  }

  await connectToDatabase();

  const cached = await MatchResultModel.findOne({
    profileKey: getProfileKey(account.id, profile),
    generatedAt: {
      $gte: getMatchResultCacheCutoff()
    }
  })
    .sort({ generatedAt: -1 })
    .lean<{
      generatedAt: Date;
      matches: {
        urgencyScore: number;
      }[];
    }>();

  if (!cached) {
    return {
      totalMatched: 0,
      highUrgencyCount: 0,
      lastUpdated: null
    };
  }

  return {
    totalMatched: cached.matches.length,
    highUrgencyCount: cached.matches.filter((match) => match.urgencyScore >= 4).length,
    lastUpdated: cached.generatedAt.toISOString()
  };
}
