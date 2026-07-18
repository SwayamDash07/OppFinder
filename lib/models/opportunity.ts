import { Schema, model, models, type InferSchemaType } from "mongoose";

export const opportunityCategories = [
  "hackathon",
  "ai_free_trial",
  "subscription_offer",
  "student_program",
  "certification",
  "open_source_program"
] as const;

export type OpportunityCategory = (typeof opportunityCategories)[number];

export const opportunityAudiences = ["student", "professional", "all"] as const;

export type OpportunityAudience = (typeof opportunityAudiences)[number];

const eligibilityCriteriaSchema = new Schema(
  {
    audience: {
      type: String,
      enum: opportunityAudiences,
      required: true,
      default: "all"
    },
    studentStatus: {
      type: String,
      enum: ["required", "preferred", "not_required"],
      required: true
    },
    country: {
      type: [String],
      default: ["global"]
    },
    skillTags: {
      type: [String],
      default: []
    },
    yearOfStudy: {
      type: [String],
      default: []
    },
    minimumAge: {
      type: Number,
      min: 0
    },
    studentEmailRequired: {
      type: Boolean,
      default: false
    },
    githubRequired: {
      type: Boolean,
      default: false
    },
    other: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const opportunitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      enum: opportunityCategories,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    eligibilityCriteria: {
      type: eligibilityCriteriaSchema,
      required: true
    },
    deadline: {
      type: Date,
      required: true,
      index: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    popularity: {
      type: Number,
      default: 0,
      min: 0,
      index: true
    }
  },
  {
    timestamps: true
  }
);

opportunitySchema.index({ title: 1, link: 1 }, { unique: true });

export type Opportunity = InferSchemaType<typeof opportunitySchema>;

export const OpportunityModel =
  models.Opportunity || model("Opportunity", opportunitySchema);
