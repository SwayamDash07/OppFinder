import { Schema, model, models, type InferSchemaType } from "mongoose";

const userAccountSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    githubUsername: {
      type: String,
      trim: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export type StoredUserAccount = InferSchemaType<typeof userAccountSchema>;

export const UserAccountModel =
  models.UserAccount || model("UserAccount", userAccountSchema);
