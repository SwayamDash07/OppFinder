import Link from "next/link";
import { getCurrentAccount } from "@/lib/auth";
import { profileToFormState } from "@/lib/profile";
import { getCurrentProfile } from "@/lib/server-session";
import { getProfileDisplayName } from "@/lib/session";
import { PasswordResetForm } from "@/app/components/PasswordResetForm";
import { ProfileForm } from "./ProfileForm";

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);
  const initialState = profileToFormState(profile);
  const params = await searchParams;
  const isEditing = Boolean(profile);

  if (!account) {
    return (
      <section className="profile-page">
        <div className="page-heading">
          <p className="hero__eyebrow">Profile</p>
          <h1>Login or sign up first.</h1>
          <p>
            Your profile is private account data, so OppFinder needs a secure
            session before you can create or edit it.
          </p>
        </div>

        <div className="empty-feed">
          <h2>Account required</h2>
          <p>Create an account or login to continue to profile setup.</p>
          <div className="auth-actions">
            <Link className="button button--primary" href="/signup">
              Sign up
            </Link>
            <Link className="button button--secondary" href="/login">
              Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="page-heading">
        <p className="hero__eyebrow">{isEditing ? "Account settings" : "Onboarding"}</p>
        <h1>
          {isEditing
            ? "Update your OppFinder profile."
            : "Tell OppFinder what you can actually use."}
        </h1>
        <p>
          {isEditing
            ? "Adjust your details any time. Changes feed back into eligibility matching on your dashboard."
            : "This profile is saved in a secure session cookie and powers the AI eligibility engine."}
        </p>
      </div>

      {params.saved === "1" ? (
        <div className="success-banner">
          Profile saved.{" "}
          {isEditing ? (
            <Link href="/matches">Return to dashboard</Link>
          ) : (
            "Ready for AI matching."
          )}
        </div>
      ) : null}

      <div className="profile-layout profile-layout--settings">
        <ProfileForm initialState={initialState} returnTo={isEditing ? "/matches" : undefined} />

        <aside className="profile-summary" aria-label="Profile overview">
          <h2>{isEditing ? "Signed in as" : "Account"}</h2>
          {profile ? (
            <>
              <p className="profile-summary__lead">{getProfileDisplayName(profile)}</p>
              <p>{account.email}</p>
              <dl>
                <div>
                  <dt>Role</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{profile.country}</dd>
                </div>
                <div>
                  <dt>Skills</dt>
                  <dd>{profile.skills.join(", ")}</dd>
                </div>
                <div>
                  <dt>Interests</dt>
                  <dd>{profile.interests.join(", ")}</dd>
                </div>
              </dl>
              <Link className="button button--primary" href="/matches">
                Back to dashboard
              </Link>
            </>
          ) : (
            <>
              <p>
                Signed in as {account.email}.{" "}
                OppFinder compares your role, skills, interests, and student signals
                against each opportunity&apos;s eligibility criteria - not just keywords
                in a description.
              </p>
              <p>
                Complete all three sections below. Student verification is optional but
                unlocks more student-only offers.
              </p>
            </>
          )}
        </aside>
      </div>

      <div className="settings-stack">
        <PasswordResetForm />
      </div>
    </section>
  );
}
