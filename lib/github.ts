import { connectToDatabase } from "@/lib/db";
import { UserProfileModel } from "@/lib/models/user-profile";
import type { UserProfile } from "@/lib/profile";

const githubSignalTtlMs = 24 * 60 * 60 * 1000;
const githubApiBaseUrl = "https://api.github.com";

export type GitHubSignal = {
  username: string;
  repositoryCount: number;
  languages: string[];
  topics: string[];
  recentRepositories: string[];
  lastPushedAt?: Date;
  activity: "active" | "dormant" | "no_public_repos";
  fetchedAt: Date;
};

type GitHubRepository = {
  name?: string;
  language?: string | null;
  topics?: string[];
  pushed_at?: string | null;
};

export async function getCachedGitHubSignal(
  userId: string,
  username: string
): Promise<GitHubSignal | null> {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername || !process.env.MONGODB_URI) {
    return null;
  }

  try {
    await connectToDatabase();

    const profile = await UserProfileModel.findOne({ userId })
      .select({ githubSignal: 1 })
      .lean<{ githubSignal?: GitHubSignal }>();
    const cachedSignal = profile?.githubSignal;

    if (
      cachedSignal?.username === normalizedUsername &&
      cachedSignal.fetchedAt instanceof Date &&
      cachedSignal.fetchedAt.getTime() >= Date.now() - githubSignalTtlMs
    ) {
      return cachedSignal;
    }

    const freshSignal = await fetchGitHubSignal(normalizedUsername);

    if (!freshSignal) {
      return cachedSignal?.username === normalizedUsername ? cachedSignal : null;
    }

    await UserProfileModel.updateOne(
      { userId },
      { $set: { githubSignal: freshSignal } }
    );

    return freshSignal;
  } catch (error) {
    console.error("GitHub signal enrichment failed", error);
    return null;
  }
}

export async function fetchGitHubSignal(username: string): Promise<GitHubSignal | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "OppFinder"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    `${githubApiBaseUrl}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&direction=desc`,
    {
      headers,
      signal: AbortSignal.timeout(8000)
    }
  ).catch((error) => {
    console.error("GitHub API request failed", error);
    return null;
  });

  if (!response || !response.ok) {
    if (response?.status !== 404 && response?.status !== 403 && response?.status !== 429) {
      console.error("GitHub API returned an unexpected response", response?.status);
    }
    return null;
  }

  const repositories = (await response.json().catch(() => [])) as GitHubRepository[];
  const languageCounts = new Map<string, number>();
  const topics = new Set<string>();
  const recentRepositories = repositories
    .filter((repository) => repository.name)
    .slice(0, 5)
    .map((repository) => repository.name as string);
  const pushedDates = repositories
    .map((repository) => repository.pushed_at)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  for (const repository of repositories) {
    if (repository.language) {
      const language = repository.language.toLowerCase();
      languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);
    }

    for (const topic of repository.topics ?? []) {
      topics.add(topic.toLowerCase());
    }
  }

  const languages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([language]) => language);
  const lastPushedAt = pushedDates[0];
  const activity = !lastPushedAt
    ? "no_public_repos"
    : Date.now() - lastPushedAt.getTime() <= 180 * 24 * 60 * 60 * 1000
      ? "active"
      : "dormant";

  return {
    username,
    repositoryCount: repositories.length,
    languages,
    topics: [...topics].slice(0, 20),
    recentRepositories,
    lastPushedAt,
    activity,
    fetchedAt: new Date()
  };
}

export function mergeGitHubSignal(
  profile: UserProfile,
  signal: GitHubSignal | null
): UserProfile {
  if (!signal) {
    return profile;
  }

  return {
    ...profile,
    skills: mergeTerms(profile.skills, signal.languages),
    interests: mergeTerms(profile.interests, signal.topics),
    githubActivity: signal.activity,
    githubRepositoryCount: signal.repositoryCount
  };
}

function mergeTerms(manualTerms: string[], inferredTerms: string[]) {
  return [...new Set([...manualTerms, ...inferredTerms])].slice(0, 24);
}
