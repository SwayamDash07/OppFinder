import Link from "next/link";
import { getCachedEligibilityMatching } from "@/app/actions/matching";
import { getMatchCacheSummary } from "@/lib/match-cache";
import { getCurrentAccount } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server-session";
import { formatRelativeTime, getProfileDisplayName, getProfileHeadline } from "@/lib/session";
import { MatchesPanel } from "./MatchesPanel";

type MatchesPageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);
  const params = await searchParams;

  if (!profile) {
    const isLoggedIn = Boolean(account);

    return (
      <section className="profile-page">
        <div className="page-heading">
          <p className="hero__eyebrow">Dashboard</p>
          <h1>Your opportunity command center.</h1>
          <p>
            Save a profile to unlock AI-ranked matches, urgency tracking, and a
            personalized feed of what you should not miss.
          </p>
        </div>

        <div className="empty-feed">
          <h2>{isLoggedIn ? "Complete your profile to continue." : "Login or sign up to continue."}</h2>
          <p>
            The matching engine needs your role, skills, interests, location, and
            student signals before it can reason over eligibility.
          </p>
          <div className="auth-actions">
            {isLoggedIn ? (
              <Link className="button button--primary" href="/profile">
                Complete profile
              </Link>
            ) : (
              <>
                <Link className="button button--primary" href="/login">
                  Login
                </Link>
                <Link className="button button--secondary" href="/signup">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  const [cacheSummary, initialMatchingState] = await Promise.all([
    getMatchCacheSummary(profile),
    getCachedEligibilityMatching()
  ]);

  return (
    <section className="profile-page dashboard-page">
      {params.saved === "1" ? (
        <div className="success-banner">
          Profile updated. Your dashboard reflects the latest details.
        </div>
      ) : null}

      <div className="dashboard-header">
        <div className="page-heading">
          <p className="hero__eyebrow">Dashboard</p>
          <h1>Welcome back, {getProfileDisplayName(profile)}.</h1>
          <p>{getProfileHeadline(profile)}</p>
        </div>
        <Link className="button button--secondary" href="/profile">
          Edit profile
        </Link>
      </div>

      <section className="dashboard-profile" aria-label="Profile summary">
        <div className="dashboard-profile__main">
          <div>
            <span className="dashboard-label">Role</span>
            <strong>{profile.role === "student" ? "Student" : "Professional"}</strong>
          </div>
          <div>
            <span className="dashboard-label">Skills</span>
            <strong>{profile.skills.slice(0, 4).join(", ")}</strong>
          </div>
          <div>
            <span className="dashboard-label">Interests</span>
            <strong>{profile.interests.slice(0, 3).join(", ")}</strong>
          </div>
        </div>
        <div className="dashboard-profile__tags">
          {profile.githubUsername ? (
            <span className="profile-tag">GitHub - {profile.githubUsername}</span>
          ) : null}
          {profile.studentEmailDomain ? (
            <span className="profile-tag">Verified - {profile.studentEmailDomain}</span>
          ) : null}
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Matching statistics">
        <article className="stat-card">
          <span className="dashboard-label">Opportunities matched</span>
          <strong>{cacheSummary.totalMatched || "-"}</strong>
          <p>Ranked against your saved profile</p>
        </article>
        <article className="stat-card">
          <span className="dashboard-label">High urgency</span>
          <strong>{cacheSummary.highUrgencyCount || "-"}</strong>
          <p>Deadlines or fit score need attention soon</p>
        </article>
        <article className="stat-card">
          <span className="dashboard-label">Last updated</span>
          <strong>{formatRelativeTime(cacheSummary.lastUpdated)}</strong>
          <p>From the 24-hour match cache</p>
        </article>
      </section>

      <section className="dashboard-feed" aria-label="Ranked matches">
        <div className="dashboard-feed__heading">
          <div>
            <h2>Ranked feed</h2>
            <p>
              Opportunities sorted by eligibility, relevance, and deadline pressure
              with plain-language explanations.
            </p>
          </div>
        </div>
        <MatchesPanel initialState={initialMatchingState} />
      </section>
    </section>
  );
}
