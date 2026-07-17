import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/app/components/AuthForm";
import { getCurrentAccount } from "@/lib/auth";

export default async function LoginPage() {
  const account = await getCurrentAccount();

  if (account) {
    redirect("/matches");
  }

  return (
    <section className="profile-page">
      <div className="page-heading">
        <p className="hero__eyebrow">Login</p>
        <h1>Welcome back to OppFinder.</h1>
        <p>Login to access your dashboard, browse page, and saved profile settings.</p>
      </div>

      <div className="profile-layout profile-layout--settings">
        <AuthForm mode="login" />
        <aside className="profile-summary">
          <h2>New here?</h2>
          <p>Create an account first, then OppFinder will ask for your developer profile.</p>
          <Link className="button button--primary" href="/signup">
            Sign up
          </Link>
          <Link className="button button--secondary" href="/">
            Back to homepage
          </Link>
        </aside>
      </div>
    </section>
  );
}
