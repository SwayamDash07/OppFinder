import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";
import { roles, yearsOfStudy } from "@/lib/profile";

const githubSignalSchema = new Schema(
  {
    username: String,
    repositoryCount: Number,
    languages: [String],
    topics: [String],
    recentRepositories: [String],
    lastPushedAt: Date,
    activity: {
      type: String,
      enum: ["active", "dormant", "no_public_repos"]
    },
    fetchedAt: Date
  },
  { _id: false }
);

const userProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    role: {
      type: String,
      enum: roles,
      required: true
    },
    yearOfStudy: {
      type: String,
      enum: yearsOfStudy,
      required: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    githubUsername: {
      type: String,
      trim: true
    },
    studentEmailDomain: {
      type: String,
      trim: true,
      index: true
    },
    githubSignal: {
      type: githubSignalSchema
    }
  },
  {
    timestamps: true
  }
);

export type StoredUserProfile = InferSchemaType<typeof userProfileSchema>;

if (models.UserProfile && !models.UserProfile.schema.path("userId")) {
  mongoose.deleteModel("UserProfile");
}

export const UserProfileModel =
  models.UserProfile || model("UserProfile", userProfileSchema);
