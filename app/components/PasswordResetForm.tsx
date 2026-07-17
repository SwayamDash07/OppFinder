"use client";

import { useActionState } from "react";
import { changePassword, type AuthFormState } from "@/app/actions/auth";

export function PasswordResetForm() {
  const initialState: AuthFormState = {
    values: { email: "" },
    errors: {},
    message: ""
  };
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    changePassword,
    initialState
  );
  const formState = state ?? initialState;

  return (
    <form className="profile-summary password-panel" action={formAction}>
      <h2>Password reset</h2>
      <p>Change your password from account settings.</p>

      <label className="field">
        <span>Current password</span>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!formState.errors.currentPassword}
          required
        />
        {formState.errors.currentPassword ? <small>{formState.errors.currentPassword}</small> : null}
      </label>

      <label className="field">
        <span>New password</span>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!formState.errors.newPassword}
          required
        />
        {formState.errors.newPassword ? <small>{formState.errors.newPassword}</small> : null}
      </label>

      {formState.message ? <p className="form-message">{formState.message}</p> : null}

      <button className="button button--secondary" type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
