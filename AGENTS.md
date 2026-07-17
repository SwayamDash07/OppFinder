# Project Brief for Codex: Threadbare Hackathon Build

## Project Vision

Build OppFinder, a web app that helps student developers discover hackathons, free AI credits, subscription discounts, student programs, certifications, and open-source programs before they miss them.

OppFinder is not a static directory. Its differentiator is an AI eligibility-matching layer: given a user's profile, the AI reasons over each opportunity's actual eligibility criteria, explains why the user qualifies or what is missing, and ranks opportunities by relevance and urgency.

Keep the build simple in scope and efficient in execution. Every screen should serve the demo story: "I almost missed something I qualified for, and this agent would not have let that happen."

## Tech Stack

- Framework: Next.js App Router with React
- Backend logic: Server Actions only
- Database: MongoDB via Mongoose, accessed only from Server Actions
- AI layer: Server Action calls the LLM API for eligibility reasoning
- Styling: Plain CSS with custom properties, no Tailwind
- Theme: Light/dark theme via cookie
- Deployment: Vercel with MongoDB Atlas
- Auth: Minimal profile form, no full auth unless time allows

## Core Data Model

Opportunity documents:

- title
- category: hackathon, ai_free_trial, subscription_offer, student_program, certification, open_source_program
- description
- eligibilityCriteria
- deadline
- link
- tags
- value

UserProfile:

- role
- yearOfStudy
- country
- skills
- interests
- githubUsername
- studentEmailDomain

## Core Feature Priority

1. Seed dataset with 30-50 realistic current opportunities across all 6 categories
2. Profile input form using Server Actions
3. AI eligibility-matching Server Action
4. Ranked results feed with AI explanations and urgency indicators
5. Secondary category browse page
6. Stretch: bookmarks and simple deadline reminder UI

## Out Of Scope

- Live web scraping
- Complex auth
- Admin panel
- Notification or email system
- Mobile app

## AI Fluency Requirement

The AI must reason over eligibility criteria against a specific user profile. It should not merely summarize descriptions.

The matching Server Action should require structured output such as:

```json
{
  "opportunityId": "string",
  "eligible": true,
  "reason": "string",
  "urgencyScore": 0
}
```

## Hackathon Checklist

- Product built using OpenAI Codex
- Deliverables due by 23:59 IST, 19 July 2026
- Hosted live URL
- Public GitHub repo
- README explaining the project
- Demo video up to 3 minutes
- Optional 5-7 slide pitch deck
- Team name: Threadbare

## Working Rules

- Use strict server-first architecture
- No API routes
- No client-side fetch
- Use Server Actions for data reads, writes, and AI matching
- No inline code comments in final code
- Prefer full file replacements over partial diffs when editing
- Validate every input server-side
- No Tailwind
- Use CSS variables for theming
- Use explicit mobile breakpoints
- Ask before starting a new major feature when scope is ambiguous
- Keep each task scoped to one deliverable

## Demo Narrative

1. Problem: "I almost missed a specific real opportunity because I never saw it in time."
2. Solution: fill in a quick profile, then see the AI-ranked explained feed.
3. Payoff: show one strong match with a clear eligibility explanation and deadline urgency.

## Staged Build Sequence

1. Set up the Next.js App Router project structure, plain CSS, theme cookie, and mobile breakpoints
2. Create MongoDB schema and seed script
3. Build UserProfile input form as a Server Action
4. Build AI eligibility-matching Server Action
5. Build results feed UI
6. Build secondary category browse page
7. Stretch bookmarks and reminders
