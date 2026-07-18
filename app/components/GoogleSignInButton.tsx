"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button
      className="button button--google"
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/profile" })}
    >
      Continue with Google
    </button>
  );
}
