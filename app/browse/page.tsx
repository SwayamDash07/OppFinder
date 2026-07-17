import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import {
  OpportunityModel,
  opportunityCategories,
  type OpportunityCategory
} from "@/lib/models/opportunity";
import { getCurrentAccount } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server-session";

export const dynamic = "force-dynamic";

const categoryLabels: Record<OpportunityCategory, string> = {
  hackathon: "Hackathons",
  ai_free_trial: "AI trials",
  subscription_offer: "Subscriptions",
  student_program: "Student programs",
  certification: "Certifications",
  open_source_program: "Open source"
};

type BrowsePageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

type BrowseOpportunity = {
  id: string;
  title: string;
  category: OpportunityCategory;
  description: string;
  deadline: string;
  link: string;
  value: string;
  tags: string[];
  eligibilityCriteria: {
    country: string[];
    skillTags: string[];
    other?: string;
  };
  updatedAt?: string;
};

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  if (!profile) {
    const isLoggedIn = Boolean(account);

    return (
      <section className="profile-page">
        <div className="page-heading">
          <p className="hero__eyebrow">Browse</p>
          <h1>{isLoggedIn ? "Complete your profile to browse." : "Login to browse opportunities."}</h1>
          <p>
            OppFinder keeps the opportunity directory tied to your saved profile
            so the experience stays personal instead of becoming a generic list.
          </p>
        </div>

        <div className="empty-feed">
          <h2>Protected area</h2>
          <p>
            {isLoggedIn
              ? "Finish profile setup before opening the opportunity directory."
              : "Login or sign up before browsing."}
          </p>
          <div className="auth-actions">
            {isLoggedIn ? (
              <Link className="button button--primary" href="/profile">
                Complete profile
              </Link>
            ) : (
              <>
                <Link className="button button--primary" href="/login">
                  Login
                </Link>
                <Link className="button button--secondary" href="/signup">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  const params = await searchParams;
  const activeCategory = opportunityCategories.includes(
    params.category as OpportunityCategory
  )
    ? (params.category as OpportunityCategory)
    : "hackathon";
  const opportunities = await getOpportunities(activeCategory);
  const latestUpdate = getLatestUpdate(opportunities);

  return (
    <section className="profile-page">
      <div className="page-heading">
        <p className="hero__eyebrow">Browse</p>
        <h1>Explore opportunities by category.</h1>
        <p>
          A MongoDB-backed directory for scanning every saved opportunity beyond
          your AI-ranked dashboard.
        </p>
      </div>

      <section className="browse-source" aria-label="Browse data source">
        <div>
          <span className="dashboard-label">Data source</span>
          <strong>MongoDB Opportunity collection</strong>
          <p>
            This page updates whenever new opportunities are inserted or refreshed
            in the database. It does not call the AI matcher.
          </p>
        </div>
        <div>
          <span className="dashboard-label">Showing</span>
          <strong>
            {opportunities.length} {categoryLabels[activeCategory].toLowerCase()}
          </strong>
          <p>{latestUpdate ? `Latest database update: ${latestUpdate}` : "No entries yet."}</p>
        </div>
      </section>

      <nav className="category-tabs" aria-label="Opportunity categories">
        {opportunityCategories.map((category) => (
          <Link
            className={
              category === activeCategory
                ? "category-tab category-tab--active"
                : "category-tab"
            }
            href={`/browse?category=${category}`}
            key={category}
          >
            {categoryLabels[category]}
          </Link>
        ))}
      </nav>

      {opportunities.length > 0 ? (
        <section className="browse-list" aria-label={categoryLabels[activeCategory]}>
          {opportunities.map((opportunity, index) => (
            <article className="result-card browse-card" key={opportunity.id}>
              <div className="result-card__rank">{index + 1}</div>
              <div className="result-card__body">
                <div className="result-card__topline">
                  <span className="category-chip">
                    {categoryLabels[opportunity.category]}
                  </span>
                  <span className={deadlineClass(opportunity.deadline)}>
                    {formatDeadline(opportunity.deadline)}
                  </span>
                </div>
                <h3>{opportunity.title}</h3>
                <p className="result-card__description">{opportunity.description}</p>

                <div className="browse-meta-grid" aria-label="Opportunity details">
                  <div>
                    <span>Prize/value</span>
                    <strong>{opportunity.value}</strong>
                  </div>
                  <div>
                    <span>Format</span>
                    <strong>{formatDelivery(opportunity)}</strong>
                  </div>
                  <div>
                    <span>Eligibility</span>
                    <strong>{formatEligibility(opportunity)}</strong>
                  </div>
                </div>

                {opportunity.tags.length > 0 ? (
                  <div className="browse-tags" aria-label="Opportunity tags">
                    {opportunity.tags.slice(0, 6).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}

                <div className="result-card__footer">
                  <span>{opportunity.eligibilityCriteria.other || "Check the host page for final terms."}</span>
                  <a className="button button--secondary" href={opportunity.link}>
                    Open
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-feed">
          <h2>No opportunities in this category yet.</h2>
          <p>Seed or add opportunities, then come back to browse this list.</p>
        </section>
      )}
    </section>
  );
}

async function getOpportunities(category: OpportunityCategory): Promise<BrowseOpportunity[]> {
  await connectToDatabase();

  const opportunities = await OpportunityModel.find({ category })
    .sort({ deadline: 1, title: 1 })
    .lean<
      {
        _id: { toString(): string };
        title: string;
        category: OpportunityCategory;
        description: string;
        eligibilityCriteria: BrowseOpportunity["eligibilityCriteria"];
        deadline: Date;
        link: string;
        tags: string[];
        value: string;
        updatedAt?: Date;
      }[]
    >();

  return opportunities.map((opportunity) => ({
    id: opportunity._id.toString(),
    title: opportunity.title,
    category: opportunity.category,
    description: opportunity.description,
    eligibilityCriteria: opportunity.eligibilityCriteria,
    deadline: opportunity.deadline.toISOString(),
    link: opportunity.link,
    tags: opportunity.tags,
    value: opportunity.value,
    updatedAt: opportunity.updatedAt?.toISOString()
  }));
}

function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(deadline));
}

function deadlineClass(deadline: string) {
  const daysAway = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);

  if (daysAway <= 14) {
    return "urgency-badge urgency-badge--hot";
  }

  if (daysAway <= 45) {
    return "urgency-badge urgency-badge--warm";
  }

  return "urgency-badge";
}

function formatDelivery(opportunity: BrowseOpportunity) {
  const searchable = [
    opportunity.title,
    opportunity.description,
    opportunity.eligibilityCriteria.other || "",
    ...opportunity.tags
  ]
    .join(" ")
    .toLowerCase();

  if (searchable.includes("online") || searchable.includes("remote") || searchable.includes("virtual")) {
    return "Online";
  }

  if (searchable.includes("hybrid")) {
    return "Hybrid";
  }

  const countries = opportunity.eligibilityCriteria.country.filter(
    (country) => country !== "global"
  );

  if (countries.length > 0) {
    return countries.join(", ");
  }

  return opportunity.category === "hackathon" ? "Global / check venue" : "Global";
}

function formatEligibility(opportunity: BrowseOpportunity) {
  const skills = opportunity.eligibilityCriteria.skillTags.slice(0, 3);

  if (skills.length > 0) {
    return skills.join(", ");
  }

  if (opportunity.eligibilityCriteria.country.includes("global")) {
    return "Global";
  }

  return opportunity.eligibilityCriteria.country.join(", ");
}

function getLatestUpdate(opportunities: BrowseOpportunity[]) {
  const latest = opportunities
    .map((opportunity) => opportunity.updatedAt)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return latest ? formatDeadline(latest) : null;
}
