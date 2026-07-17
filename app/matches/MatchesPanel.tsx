"use client";

import { useActionState } from "react";
import {
  runEligibilityMatchingFormAction,
  type MatchingActionState
} from "@/app/actions/matching";

type MatchesPanelProps = {
  initialState?: MatchingActionState;
};

const defaultInitialState: MatchingActionState = {
  ok: false,
  error: ""
};

const categoryLabels = {
  hackathon: "Hackathon",
  ai_free_trial: "AI trial",
  subscription_offer: "Subscription",
  student_program: "Student program",
  certification: "Certification",
  open_source_program: "Open source"
};

export function MatchesPanel({ initialState = defaultInitialState }: MatchesPanelProps) {
  const [state, formAction, isPending] = useActionState(
    runEligibilityMatchingFormAction,
    initialState
  );

  return (
    <div className="matches-workspace">
      <form className="matches-runner" action={formAction}>
        <div>
          <h2>Generate ranked feed</h2>
          <p>
            OppFinder will compare your saved profile against the opportunity
            criteria and rank what deserves attention first.
          </p>
        </div>
        <div className="matches-runner__actions">
          <button className="button button--primary" type="submit" disabled={isPending}>
            {isPending ? "Matching..." : "Run AI matching"}
          </button>
          <button
            className="button button--secondary"
            type="submit"
            name="refresh"
            value="1"
            disabled={isPending}
          >
            Refresh matches
          </button>
        </div>
      </form>

      {!state.ok && state.error ? <div className="form-message">{state.error}</div> : null}

      {state.ok ? (
        <section className="results-feed" aria-label="Ranked opportunity matches">
          <div className="feed-meta">
            <span className="status-pill">
              {state.cacheStatus === "hit" ? "Cached" : "AI ranked"}
            </span>
            <span>{state.matches.length} opportunities scored</span>
          </div>

          {state.matches.slice(0, 18).map((match, index) => (
            <article className="result-card" key={match.opportunityId}>
              <div className="result-card__rank">{index + 1}</div>
              <div className="result-card__body">
                <div className="result-card__topline">
                  <span className="category-chip">
                    {categoryLabels[match.opportunity.category]}
                  </span>
                  <span className={urgencyClass(match.urgencyScore)}>
                    {urgencyLabel(match.urgencyScore)}
                  </span>
                </div>
                <h3>{match.opportunity.title}</h3>
                <p className="result-card__reason">{match.reason}</p>
                <p className="result-card__description">{match.opportunity.description}</p>

                <div className="score-grid">
                  <div>
                    <span>Eligibility</span>
                    <strong>{match.eligible ? "Likely eligible" : "Needs work"}</strong>
                  </div>
                  <div>
                    <span>Relevance</span>
                    <strong>{match.relevanceScore}/100</strong>
                  </div>
                  <div>
                    <span>Deadline</span>
                    <strong>{formatDeadline(match.opportunity.deadline)}</strong>
                  </div>
                </div>

                {match.missingCriteria.length > 0 ? (
                  <div className="missing-list">
                    {match.missingCriteria.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                ) : null}

                <div className="result-card__footer">
                  <span>{match.opportunity.value}</span>
                  <a className="button button--secondary" href={match.opportunity.link}>
                    Open
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-feed" aria-label="Empty results feed">
          <h2>Your ranked feed will appear here.</h2>
          <p>
            The best demo shot is the first card: why you qualify, how urgent it
            is, and what to do next.
          </p>
        </section>
      )}
    </div>
  );
}

function urgencyLabel(score: number) {
  if (score >= 5) {
    return "Act now";
  }

  if (score >= 4) {
    return "Soon";
  }

  return "Low urgency";
}

function urgencyClass(score: number) {
  if (score >= 5) {
    return "urgency-badge urgency-badge--hot";
  }

  if (score >= 4) {
    return "urgency-badge urgency-badge--warm";
  }

  return "urgency-badge";
}

function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(deadline));
}
