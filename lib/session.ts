import type { UserProfile } from "@/lib/profile";

const yearLabels = {
  "high-school": "High school",
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
  graduate: "Graduate",
  "not-applicable": "Not applicable"
} as const;

export function getProfileDisplayName(profile: UserProfile) {
  if (profile.githubUsername) {
    return profile.githubUsername;
  }

  if (profile.studentEmailDomain) {
    return profile.studentEmailDomain.split("@")[0] || profile.studentEmailDomain;
  }

  return `${profile.role === "student" ? "Student" : "Professional"} profile`;
}

export function getProfileHeadline(profile: UserProfile) {
  const roleLabel = profile.role === "student" ? "Student" : "Professional";
  const yearLabel = yearLabels[profile.yearOfStudy];

  if (profile.role === "student" && profile.yearOfStudy !== "not-applicable") {
    return `${roleLabel} - ${yearLabel} - ${profile.country}`;
  }

  return `${roleLabel} - ${profile.country}`;
}

export function formatRelativeTime(value: string | null) {
  if (!value) {
    return "Not updated yet";
  }

  const timestamp = new Date(value).getTime();
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Updated just now";
  }

  if (diffMinutes < 60) {
    return `Updated ${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Updated ${diffHours}h ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
