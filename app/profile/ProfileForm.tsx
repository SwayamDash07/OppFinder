"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { type ProfileFormState, roles, yearsOfStudy } from "@/lib/profile";

type ProfileFormProps = {
  initialState: ProfileFormState;
  returnTo?: string;
  githubUsername?: string;
};

const roleLabels = {
  student: "Student",
  professional: "Professional"
};

const yearLabels = {
  "high-school": "High school",
  freshman: "Freshman",
  sophomore: "Sophomore",
  junior: "Junior",
  senior: "Senior",
  graduate: "Graduate",
  "not-applicable": "Not applicable"
};

export function ProfileForm({ initialState, returnTo, githubUsername }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);
  const [role, setRole] = useState(initialState.values.role);

  return (
    <form className="profile-form" action={formAction}>
      {returnTo ? <input name="returnTo" type="hidden" value={returnTo} /> : null}

      <section className="form-section">
        <div className="form-section__header">
          <h2>Basic info</h2>
          <p>Who you are and where you are based.</p>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Role</span>
            <select
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              aria-invalid={!!state.errors.role}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            {state.errors.role ? <small>{state.errors.role}</small> : null}
          </label>

          {role === "student" ? (
            <label className="field">
              <span>Year of study</span>
              <select
                name="yearOfStudy"
                defaultValue={state.values.yearOfStudy}
                aria-invalid={!!state.errors.yearOfStudy}
              >
                {yearsOfStudy.map((year) => (
                  <option key={year} value={year}>
                    {yearLabels[year]}
                  </option>
                ))}
              </select>
              {state.errors.yearOfStudy ? <small>{state.errors.yearOfStudy}</small> : null}
            </label>
          ) : null}

          <label className="field field--wide">
            <span>Country</span>
            <input
              name="country"
              defaultValue={state.values.country}
              placeholder="India"
              aria-invalid={!!state.errors.country}
            />
            {state.errors.country ? <small>{state.errors.country}</small> : null}
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h2>Skills and interests</h2>
          <p>Comma-separated lists used for relevance scoring.</p>
        </div>
        <div className="form-grid">
          <label className="field field--wide">
            <span>Skills</span>
            <input
              name="skills"
              defaultValue={state.values.skills}
              placeholder="react, python, mongodb, ai"
              aria-invalid={!!state.errors.skills}
            />
            {state.errors.skills ? <small>{state.errors.skills}</small> : null}
          </label>

          <label className="field field--wide">
            <span>Interests</span>
            <input
              name="interests"
              defaultValue={state.values.interests}
              placeholder="hackathons, open-source, cloud credits"
              aria-invalid={!!state.errors.interests}
            />
            {state.errors.interests ? <small>{state.errors.interests}</small> : null}
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section__header">
          <h2>Student verification</h2>
          <p>Optional signals that unlock student-only opportunities.</p>
        </div>
        <div className="form-grid">
          {githubUsername ? (
            <input name="githubUsername" type="hidden" value={githubUsername} />
          ) : (
            <label className="field">
              <span>GitHub username</span>
              <input
                name="githubUsername"
                defaultValue={state.values.githubUsername}
                placeholder="octocat"
                aria-invalid={!!state.errors.githubUsername}
              />
              <small className="field-hint">
                We use your public repos to improve matches - no private data or write access.
              </small>
              {state.errors.githubUsername ? <small>{state.errors.githubUsername}</small> : null}
            </label>
          )}

          {role === "student" ? (
            <label className="field">
              <span>Student email / academic domain</span>
              <input
                name="studentEmailDomain"
                defaultValue={state.values.studentEmailDomain}
                placeholder="you@university.edu"
                aria-invalid={!!state.errors.studentEmailDomain}
              />
              <small className="field-hint">
                Required for students; professionals can leave this blank.
              </small>
              {state.errors.studentEmailDomain ? (
                <small>{state.errors.studentEmailDomain}</small>
              ) : null}
            </label>
          ) : null}
        </div>
      </section>

      {state.message ? <p className="form-message">{state.message}</p> : null}

      <button className="button button--primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : returnTo ? "Save changes" : "Save profile"}
      </button>
    </form>
  );
}
