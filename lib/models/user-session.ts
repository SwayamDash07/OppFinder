import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type StoredUserSession = InferSchemaType<typeof userSessionSchema>;

export const UserSessionModel =
  models.UserSession || model("UserSession", userSessionSchema);
