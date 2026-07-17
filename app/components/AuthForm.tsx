"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthFormState } from "@/app/actions/auth";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? login : signup;
  const initialState: AuthFormState = {
    values: { email: "" },
    errors: {},
    message: ""
  };
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    action,
    initialState
  );
  const formState = state ?? initialState;

  return (
    <form className="profile-form auth-form" action={formAction}>
      <section className="form-section">
        <div className="form-section__header">
          <h2>{mode === "login" ? "Login" : "Create account"}</h2>
          <p>
            {mode === "login"
              ? "Use your email and password to access your saved OppFinder profile."
              : "Create a secure account before saving your personalized profile."}
          </p>
        </div>

        <label className="field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={formState.values.email}
            aria-invalid={!!formState.errors.email}
            required
          />
          {formState.errors.email ? <small>{formState.errors.email}</small> : null}
        </label>

        <label className="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            aria-invalid={!!formState.errors.password}
            required
          />
          {formState.errors.password ? <small>{formState.errors.password}</small> : null}
        </label>
      </section>

      {formState.message ? <p className="form-message">{formState.message}</p> : null}

      <div className="auth-actions">
        <button className="button button--primary" type="submit" disabled={isPending}>
          {isPending ? "Working..." : mode === "login" ? "Login" : "Sign up"}
        </button>
        <Link
          className="button button--secondary"
          href={mode === "login" ? "/signup" : "/login"}
        >
          {mode === "login" ? "Create account" : "Already have an account"}
        </Link>
      </div>
    </form>
  );
}
