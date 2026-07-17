import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/app/components/AuthForm";
import { getCurrentAccount } from "@/lib/auth";

export default async function SignupPage() {
  const account = await getCurrentAccount();

  if (account) {
    redirect("/profile");
  }

  return (
    <section className="profile-page">
      <div className="page-heading">
        <p className="hero__eyebrow">Signup</p>
        <h1>Create your OppFinder account.</h1>
        <p>Your account protects the profile used for matching and saved dashboard data.</p>
      </div>

      <div className="profile-layout profile-layout--settings">
        <AuthForm mode="signup" />
        <aside className="profile-summary">
          <h2>Already joined?</h2>
          <p>Login with your email and password to continue where you left off.</p>
          <Link className="button button--primary" href="/login">
            Login
          </Link>
          <Link className="button button--secondary" href="/">
            Back to homepage
          </Link>
        </aside>
      </div>
    </section>
  );
}
