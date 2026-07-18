"use client";

import { signIn } from "next-auth/react";

export function GitHubSignInButton() {
  return (
    <button
      className="button button--github"
      type="button"
      onClick={() => signIn("github", { callbackUrl: "/profile" })}
    >
      Sign in with GitHub
    </button>
  );
}
