# OppFinder

**Never miss the opportunity you already qualify for.**

Built by **Threadbare** for the OpenAI × NamasteDev Hackathon.

LIVE URL: https://opp-finder-woad.vercel.app/

> A small note before you dive in: this was built by three students over a few days for a hackathon, not a polished production team. It's rough in places, and we're still learning as we go — but the core idea and the AI matching logic are real and working. Feedback welcome.

## What OppFinder does

Student developers are surrounded by opportunities: hackathons, AI credits, student pricing, certifications, fellowships, and open-source programs. The problem is not always eligibility. It is discovery, timing, and knowing whether an opportunity is actually worth applying for.

OppFinder combines a curated opportunity directory with an AI eligibility-matching layer. A user saves a lightweight profile, and the app reasons over each opportunity's structured eligibility criteria to produce a ranked feed with plain-language explanations and urgency scores.

The demo story is simple:

> I almost missed something I qualified for because I never saw it in time. OppFinder would have found it, explained why I qualify, and shown me how urgent it is.

## How it works, at a glance

```mermaid
flowchart LR
    A(("🧑‍🎓 You")) --> B["📝 Quick profile\nskills, year, interests"]
    B --> C["🗂️ 100+ curated\nopportunities"]
    C --> D["🤖 AI reasons over\neach one for you"]
    D --> E["📊 Ranked feed\nwith reasons + urgency"]
    E --> F(("✅ Never miss one"))
```

## Product flow

1. Create an account or log in.
2. Save a profile with role, year of study, country, skills, interests, GitHub username, and an optional academic email/domain signal.
3. Open the dashboard to generate or load the personalized match feed.
4. Review eligibility explanations, missing criteria, relevance, value, and deadline urgency.
5. Use Browse for the complete MongoDB-backed directory, with category tabs, sorting, and company/organization filtering.

## Core features

- **Profile-based matching:** results use the saved profile rather than generic keyword search.
- **Role-aware matching:** opportunities are tagged as student-only, professional-only, or open to all. The AI explicitly checks the user's role, excludes mismatched opportunities from eligible results, and explains the mismatch clearly, such as noting that a program requires active student enrollment.
- **Authentication choices:** users can sign in with email/password, GitHub OAuth, or Google OAuth; GitHub-linked users have their GitHub username populated automatically for public-repository enrichment.
- **Eligibility reasoning:** the model compares profile attributes against structured criteria and explains the result.
- **Urgency scoring:** each match receives a 1-5 urgency score based on deadline pressure and fit.
- **127 seeded opportunities:** the current dataset is spread across six categories: 18 hackathons, 21 AI free trials, 20 subscription offers, 17 student programs, 24 certifications, and 27 open-source programs.
- **Browse controls:** browse uses MongoDB directly, with category filtering, latest-deadline sorting, popularity sorting, deadline-soonest sorting, and company/organization filtering. Browse does not call Groq.
- **Protected profile and dashboard:** users must be authenticated, and a profile is required before accessing the personalized dashboard or browse directory.
- **24-hour match cache:** repeated dashboard visits can reuse cached results for the same saved profile instead of calling the model again.
- **Light/dark theme:** the theme is persisted with a cookie and rendered through CSS custom properties.

## Technical architecture

### Stack

- **Framework:** Next.js App Router with React and TypeScript
- **Backend:** Server Actions for application data and matching, with the Auth.js callback route required for GitHub OAuth; there are no client-side data fetches
- **Database:** MongoDB Atlas through Mongoose
- **AI:** Groq's OpenAI-compatible API through the OpenAI SDK
- **Default model:** `openai/gpt-oss-20b`
- **Styling:** plain CSS, CSS custom properties, and explicit mobile breakpoints; no Tailwind
- **Deployment:** Vercel

### Routes

- `/` - product landing page and demo narrative
- `/login` - account login
- `/signup` - account creation
- `/api/auth/[...nextauth]` - Auth.js GitHub and Google OAuth sign-in and callback route
- `/profile` - profile creation and editing
- `/matches` - AI-ranked dashboard and cached match results
- `/browse` - full MongoDB opportunity directory

### Server-side boundaries

- `app/actions/auth.ts` handles authentication actions.
- `app/actions/profile.ts` validates and saves profile data.
- `app/actions/matching.ts` loads opportunities, manages matching state, applies throttling/cache behavior, and returns dashboard results.
- `lib/next-auth.ts` configures the optional GitHub OAuth provider and bridges OAuth users into the existing account/session system without storing OAuth tokens.
- `lib/github.ts` fetches public repository signals server-side and caches them for enrichment during matching.
- `lib/models/` contains the Mongoose models for accounts, sessions, profiles, opportunities, and match results.
- `lib/db.ts` maintains the server-side MongoDB connection.
- `lib/rate-limit.ts` applies request throttling to sensitive actions.

## How AI matching works

The matching layer is intended to reason over eligibility, not simply summarize listings.

1. The saved profile and opportunities are loaded on the server.
2. A lightweight relevance shortlist uses category, tags, skills, interests, country, study year, GitHub, and student-email signals to focus the AI work.
3. Shortlisted opportunities are sent to Groq in small batches with the user's profile and each opportunity's structured criteria.
4. The model returns one strict result object per opportunity in each batch:

   ```json
   {
     "opportunityId": "string",
     "eligible": true,
     "reason": "string",
     "urgencyScore": 1
   }
   ```

5. Batched calls use a short configurable interval and stay within provider RPM/TPM limits; malformed batch responses get one repair retry.
6. Results are stored in MongoDB and reused for 24 hours for the same profile key.
7. The dashboard enriches the result with the original opportunity data and presents the ranked feed.

```mermaid
flowchart TD
    A[User profile] --> B[Profile Server Action]
    B --> C[(UserProfile in MongoDB)]
    C --> D[Matching Server Action]
    D --> E{Fresh cached result?}
    E -->|Yes| F[Ranked dashboard feed]
    E -->|No| G[Load Opportunity collection]
    G --> H[Lightweight relevance shortlist]
    H --> I[Groq structured eligibility reasoning]
    I --> J[(MatchResult cache)]
    J --> F
```

## Opportunity data

Each opportunity includes:

- `title`
- `companyName`
- `category`
- `description`
- `eligibilityCriteria`
- `deadline`
- `link`
- `tags`
- `value`
- `popularity`
- `eligibilityCriteria.audience` (`student`, `professional`, or `all`)

The current audience breakdown is 40 student-only, 9 professional-only, and 78 open-to-all opportunities. The seed data is intentionally curated instead of scraped live. Entries use recognizable programs and official destination links where possible. Availability, pricing, eligibility, and dates can change, so users should confirm final terms on the linked provider page.

The current dataset is a curated set sized for this hackathon's free-tier infrastructure, including MongoDB Atlas and Groq. This is a deliberate hackathon-scope choice, not a technical ceiling: the matching pipeline, schema, and caching layer already support a dataset of any size; only the free-tier data volume and API rate limits are being kept modest here.

Run the seed script after configuring MongoDB:

```bash
npm run seed
```

The seed command replaces the Opportunity collection with the current curated dataset and prints category counts.

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB Atlas or another MongoDB deployment
- A Groq API key

### Install

```bash
git clone https://github.com/SwayamDash07/OppFinder.git
cd OppFinder
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI="mongodb+srv://username:password@cluster.example.mongodb.net/oppfinder"
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

GitHub and Google OAuth are optional. Email/password authentication works without these variables. Add the following only when either OAuth provider is enabled:

```env
GITHUB_OAUTH_CLIENT_ID="your_github_oauth_client_id"
GITHUB_OAUTH_CLIENT_SECRET="your_github_oauth_client_secret"
GOOGLE_OAUTH_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_OAUTH_CLIENT_SECRET="your_google_oauth_client_secret"
NEXTAUTH_SECRET="your_long_random_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

Register these callback URLs with the providers: `http://localhost:3000/api/auth/callback/github`, `http://localhost:3000/api/auth/callback/google`, and the equivalent production URLs under `https://opp-finder-woad.vercel.app`.

Optional matching controls:

```env
GROQ_MODEL="openai/gpt-oss-20b"
GROQ_BATCH_SIZE="5"
GROQ_BATCH_INTERVAL_MS="250"
MATCH_SHORTLIST_LIMIT="18"
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npm run build
```

The live matching smoke test is available as:

```bash
npx tsx scripts/test-matching-live.ts
```

It requires `MONGODB_URI` and `GROQ_API_KEY` and exercises cache-miss, cache-hit, batched matching, throttling, and structured-output behavior against the configured services.

## Business approach

OppFinder's core value is the matching layer, not the listings themselves — directories already exist (Devpost, Unstop, GitHub Student Pack), but nothing reasons over a specific user's eligibility and tells them why an opportunity matters right now. That reasoning layer is the actual product, and it's what would carry into a real version of this:

- **Who it's for:** students and early-career developers who already qualify for far more than they realize, but lack the time or awareness to track it all down.
- **Where the value compounds:** the more a user interacts with OppFinder (profile updates, GitHub activity, past applications), the sharper the matching gets — favoring retention over one-off discovery.
- **Possible monetization paths, longer term:** a freemium model (basic matching free, deeper GitHub-based enrichment or early-access alerts as a paid tier), or partnerships with programs/companies who want qualified students to actually find their offers instead of relying on organic reach.
- **Why this is worth building further:** eligibility-matching is a genuinely underserved niche — most platforms optimize for listing volume, not for telling a specific person why something applies to them.

This is a hackathon-scoped prototype, not a business plan — but the underlying reasoning approach is the part we think is worth taking further.

## Scope and next steps

The hackathon build keeps the core workflow focused: curated data, a minimal account/profile flow, server-first architecture, and explainable AI matching. It intentionally does not include live scraping, an admin panel, a notification system, complex authentication, or a mobile app.

Natural next steps include:

- **Verified automated discovery:** monitor Devpost, provider pages, newsletters, and community sources; extract structured criteria; and send new entries through a lightweight review step.
- **GitHub profile enrichment:** use public repository languages and contribution patterns to improve skills and interests without requiring users to describe themselves perfectly.
- **Bookmarks and reminders:** let users save opportunities and receive deadline reminders.
- **Stronger freshness signals:** track source verification time and flag entries whose provider terms may have changed.

## Team

**Threadbare** — Swayam Sankalp Dash, Shulin Patro, Ayas Kant Das.

Built as students still learning the ropes of full-stack and AI, using this hackathon as a chance to build something real, make mistakes, and get better at shipping.
