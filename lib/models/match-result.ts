import { Schema, model, models, type InferSchemaType } from "mongoose";

const matchSchema = new Schema(
  {
    opportunityId: {
      type: String,
      required: true
    },
    eligible: {
      type: Boolean,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    urgencyScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    relevanceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    missingCriteria: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const matchResultSchema = new Schema(
  {
    profileKey: {
      type: String,
      required: true,
      index: true
    },
    generatedAt: {
      type: Date,
      required: true,
      index: true
    },
    matches: {
      type: [matchSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

matchResultSchema.index({ profileKey: 1, generatedAt: -1 });

export const MATCH_RESULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function getMatchResultCacheCutoff(now = Date.now()) {
  return new Date(now - MATCH_RESULT_CACHE_TTL_MS);
}

export type StoredMatchResult = InferSchemaType<typeof matchResultSchema>;

export const MatchResultModel =
  models.MatchResult || model("MatchResult", matchResultSchema);
