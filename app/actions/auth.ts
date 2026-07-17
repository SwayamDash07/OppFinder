"use server";

import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import {
  createSession,
  destroySession,
  getCurrentAccount,
  hashPassword,
  normalizeEmail,
  validateEmail,
  validatePassword,
  verifyPassword
} from "@/lib/auth";
import { UserAccountModel } from "@/lib/models/user-account";
import { checkRateLimit } from "@/lib/rate-limit";

export type AuthFormState = {
  values: {
    email: string;
  };
  errors: {
    email?: string;
    password?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  message: string;
};

export async function signup(
  _previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const limited = await checkRateLimit("signup", 5, 60 * 1000);

  if (!limited.ok) {
    return authError("Too many attempts. Please wait a moment and try again.");
  }

  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const errors: AuthFormState["errors"] = {};

  if (!validateEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!validatePassword(password)) {
    errors.password = "Use a password between 8 and 128 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      values: { email },
      errors,
      message: "Fix the highlighted fields."
    };
  }

  try {
    await connectToDatabase();

    const existing = await UserAccountModel.findOne({ email }).select("_id").lean();

    if (existing) {
      return {
        values: { email },
        errors: {
          email: "An account already exists for this email."
        },
        message: "Use login instead."
      };
    }

    const account = await UserAccountModel.create({
      email,
      passwordHash: hashPassword(password)
    });

    await createSession(account._id.toString());
  } catch (error) {
    console.error("Signup failed", error);
    return authError("Signup could not complete right now.");
  }

  redirect("/profile");
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const limited = await checkRateLimit("login", 10, 60 * 1000);

  if (!limited.ok) {
    return authError("Too many attempts. Please wait a moment and try again.");
  }

  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!validateEmail(email)) {
    return authError("Enter a valid email address.", email);
  }

  if (!validatePassword(password)) {
    return authError("Password must be at least 8 characters.", email);
  }

  try {
    await connectToDatabase();

    const account = await UserAccountModel.findOne({ email }).lean<{
      _id: { toString(): string };
      passwordHash: string;
    }>();

    if (!account) {
      return authError("No account exists for this email. Please sign up first.", email);
    }

    if (!verifyPassword(password, account.passwordHash)) {
      return authError("Password is incorrect.", email);
    }

    await createSession(account._id.toString());
  } catch (error) {
    console.error("Login failed", error);
    return authError("Login could not complete right now.", email);
  }

  redirect("/matches");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function changePassword(
  _previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const limited = await checkRateLimit("change-password", 5, 60 * 1000);

  if (!limited.ok) {
    return authError("Too many attempts. Please wait a moment and try again.");
  }

  const account = await getCurrentAccount();

  if (!account) {
    return authError("Login again before changing your password.");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const errors: AuthFormState["errors"] = {};

  if (!validatePassword(currentPassword)) {
    errors.currentPassword = "Enter your current password.";
  }

  if (!validatePassword(newPassword)) {
    errors.newPassword = "Use a password between 8 and 128 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      values: { email: account.email },
      errors,
      message: "Fix the highlighted fields."
    };
  }

  try {
    await connectToDatabase();

    const storedAccount = await UserAccountModel.findById(account.id).lean<{
      passwordHash: string;
    }>();

    if (!storedAccount || !verifyPassword(currentPassword, storedAccount.passwordHash)) {
      return {
        values: { email: account.email },
        errors: {
          currentPassword: "Current password is incorrect."
        },
        message: "Password was not changed."
      };
    }

    await UserAccountModel.updateOne(
      { _id: account.id },
      { $set: { passwordHash: hashPassword(newPassword) } }
    );

    return {
      values: { email: account.email },
      errors: {},
      message: "Password updated."
    };
  } catch (error) {
    console.error("Password change failed", error);
    return authError("Password could not be updated right now.", account.email);
  }
}

function authError(message: string, email = ""): AuthFormState {
  return {
    values: { email },
    errors: {},
    message
  };
}
