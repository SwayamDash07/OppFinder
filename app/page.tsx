import Link from "next/link";
import { getCurrentAccount } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server-session";

export default async function Home() {
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  return (
    <>
      <section className="hero">
        <div>
          <p className="hero__eyebrow">Threadbare hackathon build</p>
          <h1>Never miss the opportunity you already qualify for.</h1>
          <p className="hero__copy">
            OppFinder will match student developer profiles against hackathons,
            credits, student programs, certifications, and open-source programs,
            then explain why each match matters right now.
          </p>
          <div className="hero__actions">
            {profile ? (
              <>
                <Link className="button button--primary" href="/matches">
                  Continue to Dashboard
                </Link>
                <Link className="button button--secondary" href="/profile">
                  Edit profile
                </Link>
              </>
            ) : account ? (
              <>
                <Link className="button button--primary" href="/profile">
                  Complete profile
                </Link>
                <Link className="button button--secondary" href="/browse">
                  Browse after setup
                </Link>
              </>
            ) : (
              <>
                <Link className="button button--primary" href="/signup">
                  Sign up
                </Link>
                <Link className="button button--secondary" href="/login">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <aside className="demo-panel" aria-label="Demo preview">
          <div className="demo-panel__header">
            <p className="demo-panel__title">
              {profile ? "Your dashboard preview" : "Future ranked feed"}
            </p>
            <span className="status-pill">{profile ? "Session active" : "Server-first"}</span>
          </div>
          <div className="demo-panel__body">
            <div className="match-row">
              <strong>AI credits expiring soon</strong>
              <span>
                You qualify because your student email and ML interests match
                the offer criteria.
              </span>
            </div>
            <div className="match-row">
              <strong>Open-source mentorship program</strong>
              <span>
                Strong fit for React and accessibility interests, with a close
                application deadline.
              </span>
            </div>
            <div className="match-row">
              <strong>Student cloud certification</strong>
              <span>
                Eligible after student verification; useful for backend project
                goals.
              </span>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-band" id="principles">
        <div className="section-band__inner">
          <article className="principle">
            <h2>Server Actions first</h2>
            <p>
              Data reads, profile writes, and AI matching will stay on the
              server, with no API routes or client fetch layer.
            </p>
          </article>
          <article className="principle">
            <h2>Reasoned matches</h2>
            <p>
              The core experience will explain eligibility and missing criteria,
              not just filter a flat directory.
            </p>
          </article>
          <article className="principle" id="next">
            <h2>Scoped stages</h2>
            <p>
              The next build step is the MongoDB opportunity model and curated
              seed dataset.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
