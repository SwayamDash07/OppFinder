import { randomBytes } from "node:crypto";
import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { createSession, hashPassword, validateEmail } from "@/lib/auth";
import { UserAccountModel } from "@/lib/models/user-account";
import { UserProfileModel } from "@/lib/models/user-profile";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "read:user"
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as { email?: unknown } | undefined;
        const email = typeof googleProfile?.email === "string"
          ? googleProfile.email.trim().toLowerCase()
          : "";

        if (!validateEmail(email)) {
          return false;
        }

        try {
          await bridgeGoogleAccount(email);
          return true;
        } catch (error) {
          console.error("Google OAuth account bridge failed", error);
          return false;
        }
      }

      const githubProfile = profile as { login?: unknown } | undefined;
      const username = typeof githubProfile?.login === "string"
        ? githubProfile.login.trim().toLowerCase()
        : "";

      if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) {
        return false;
      }

      try {
        await bridgeGitHubAccount(username);
        return true;
      } catch (error) {
        console.error("GitHub OAuth account bridge failed", error);
        return false;
      }
    }
  }
};

async function bridgeGoogleAccount(email: string) {
  await connectToDatabase();

  const account = await UserAccountModel.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        passwordHash: hashPassword(randomBytes(32).toString("base64url"))
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  ).lean<{ _id: { toString(): string } }>();

  if (!account) {
    throw new Error("Google account could not be created");
  }

  await createSession(account._id.toString());
}

async function bridgeGitHubAccount(username: string) {
  await connectToDatabase();

  const linkedProfile = await UserProfileModel.findOne({ githubUsername: username })
    .select({ userId: 1 })
    .lean<{ userId: { toString(): string } }>();
  let accountId = linkedProfile?.userId.toString();

  if (!accountId) {
    const accountEmail = `${username}@github.oppfinder.local`;
    const account = await UserAccountModel.findOneAndUpdate(
      { email: accountEmail },
      {
        $setOnInsert: {
          email: accountEmail,
          passwordHash: hashPassword(randomBytes(32).toString("base64url"))
        },
        $set: {
          githubUsername: username
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    ).lean<{ _id: { toString(): string } }>();

    if (!account) {
      throw new Error("GitHub account could not be created");
    }

    accountId = account._id.toString();
  } else {
    await UserAccountModel.updateOne(
      { _id: accountId },
      { $set: { githubUsername: username } }
    );
  }

  await UserProfileModel.updateOne(
    { userId: accountId },
    { $set: { githubUsername: username } }
  );
  await createSession(accountId);
}
