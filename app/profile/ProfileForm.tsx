"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { type ProfileFormState, roles, yearsOfStudy } from "@/lib/profile";

type ProfileFormProps = {
  initialState: ProfileFormState;
  returnTo?: string;
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

export function ProfileForm({ initialState, returnTo }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);

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
            <select name="role" defaultValue={state.values.role} aria-invalid={!!state.errors.role}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            {state.errors.role ? <small>{state.errors.role}</small> : null}
          </label>

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
          <label className="field">
            <span>GitHub username</span>
            <input
              name="githubUsername"
              defaultValue={state.values.githubUsername}
              placeholder="octocat"
              aria-invalid={!!state.errors.githubUsername}
            />
            {state.errors.githubUsername ? <small>{state.errors.githubUsername}</small> : null}
          </label>

          <label className="field">
            <span>Student email domain</span>
            <input
              name="studentEmailDomain"
              defaultValue={state.values.studentEmailDomain}
              placeholder="university.edu"
              aria-invalid={!!state.errors.studentEmailDomain}
            />
            {state.errors.studentEmailDomain ? (
              <small>{state.errors.studentEmailDomain}</small>
            ) : null}
          </label>
        </div>
      </section>

      {state.message ? <p className="form-message">{state.message}</p> : null}

      <button className="button button--primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : returnTo ? "Save changes" : "Save profile"}
      </button>
    </form>
  );
}
