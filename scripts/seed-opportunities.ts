import "dotenv/config";
import mongoose from "mongoose";
import { seedOpportunities } from "../lib/seed/opportunities";

const categories = [
  "hackathon",
  "ai_free_trial",
  "subscription_offer",
  "student_program",
  "certification",
  "open_source_program"
];

const eligibilityCriteriaSchema = new mongoose.Schema(
  {
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

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: categories,
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
    }
  },
  {
    timestamps: true
  }
);

opportunitySchema.index({ title: 1, link: 1 }, { unique: true });

const Opportunity =
  mongoose.models.Opportunity || mongoose.model("Opportunity", opportunitySchema);

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required. Add it to .env.local before seeding.");
  }

  await mongoose.connect(uri, {
    bufferCommands: false
  });

  const docs = seedOpportunities.map((opportunity) => ({
    ...opportunity,
    deadline: new Date(opportunity.deadline)
  }));

  await Opportunity.deleteMany({});
  await Opportunity.insertMany(docs, { ordered: true });

  const counts = await Opportunity.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);

  console.table(counts);
  console.log(`Seeded ${docs.length} opportunities.`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
