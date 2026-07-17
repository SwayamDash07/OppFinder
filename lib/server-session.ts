import { connectToDatabase } from "@/lib/db";
import { UserProfileModel } from "@/lib/models/user-profile";
import { getCurrentAccount } from "@/lib/auth";
import type { UserProfile } from "@/lib/profile";

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const account = await getCurrentAccount();

  if (!account || !process.env.MONGODB_URI) {
    return null;
  }

  await connectToDatabase();

  const storedProfile = await UserProfileModel.findOne({ userId: account.id })
    .lean<{
      role: UserProfile["role"];
      yearOfStudy: UserProfile["yearOfStudy"];
      country: string;
      skills: string[];
      interests: string[];
      githubUsername?: string;
      studentEmailDomain?: string;
    }>();

  if (!storedProfile) {
    return null;
  }

  return {
    role: storedProfile.role,
    yearOfStudy: storedProfile.yearOfStudy,
    country: storedProfile.country,
    skills: storedProfile.skills,
    interests: storedProfile.interests,
    githubUsername: storedProfile.githubUsername,
    studentEmailDomain: storedProfile.studentEmailDomain
  };
}
