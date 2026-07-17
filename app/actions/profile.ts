"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { getCurrentAccount } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { UserProfileModel } from "@/lib/models/user-profile";
import {
  type ProfileFormState,
  validateProfileForm
} from "@/lib/profile";
import { checkRateLimit } from "@/lib/rate-limit";

export async function saveProfile(
  _previousState: ProfileFormState,
  formData: FormData
) {
  const account = await getCurrentAccount();

  if (!account) {
    return {
      ..._previousState,
      message: "Login before saving your profile."
    };
  }

  const limited = await checkRateLimit("profile-save", 8, 60 * 1000);

  if (!limited.ok) {
    return {
      ..._previousState,
      message: "Too many profile updates. Please wait a moment and try again."
    };
  }

  const result = validateProfileForm(formData);

  if (!result.profile) {
    return result.state;
  }

  try {
    await connectToDatabase();
    await UserProfileModel.findOneAndUpdate(
      {
        userId: account.id
      },
      {
        $set: result.profile,
        $setOnInsert: {
          userId: account.id
        }
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
  } catch (error) {
    console.error("Profile save failed", error);

    return {
      ...result.state,
      message: "Profile could not be saved right now."
    };
  }

  const cookieStore = await cookies();
  cookieStore.delete("oppfinder-session-cleared");

  const returnTo = String(formData.get("returnTo") ?? "").trim();

  if (returnTo === "/matches") {
    redirect("/matches?saved=1");
  }

  redirect("/profile?saved=1");
}

export async function clearProfile() {
  await logout();
}
