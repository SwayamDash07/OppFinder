export const roles = ["student", "professional"] as const;

export const yearsOfStudy = [
  "high-school",
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "graduate",
  "not-applicable"
] as const;

export type Role = (typeof roles)[number];
export type YearOfStudy = (typeof yearsOfStudy)[number];

export type UserProfile = {
  role: Role;
  yearOfStudy: YearOfStudy;
  country: string;
  skills: string[];
  interests: string[];
  githubUsername?: string;
  studentEmailDomain?: string;
};

export type ProfileFormState = {
  values: {
    role: string;
    yearOfStudy: string;
    country: string;
    skills: string;
    interests: string;
    githubUsername: string;
    studentEmailDomain: string;
  };
  errors: Partial<Record<keyof ProfileFormState["values"], string>>;
  message: string;
};

export const emptyProfileFormState: ProfileFormState = {
  values: {
    role: "student",
    yearOfStudy: "freshman",
    country: "",
    skills: "",
    interests: "",
    githubUsername: "",
    studentEmailDomain: ""
  },
  errors: {},
  message: ""
};

export function profileToFormState(profile: UserProfile | null): ProfileFormState {
  if (!profile) {
    return emptyProfileFormState;
  }

  return {
    values: {
      role: profile.role,
      yearOfStudy: profile.yearOfStudy,
      country: profile.country,
      skills: profile.skills.join(", "),
      interests: profile.interests.join(", "),
      githubUsername: profile.githubUsername ?? "",
      studentEmailDomain: profile.studentEmailDomain ?? ""
    },
    errors: {},
    message: ""
  };
}

export function parseList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => sanitizeText(item).toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

export function validateProfileForm(formData: FormData): {
  state: ProfileFormState;
  profile: UserProfile | null;
} {
  const values = {
    role: String(formData.get("role") ?? ""),
    yearOfStudy: String(formData.get("yearOfStudy") ?? ""),
    country: sanitizeText(formData.get("country")),
    skills: sanitizeText(formData.get("skills")),
    interests: sanitizeText(formData.get("interests")),
    githubUsername: sanitizeText(formData.get("githubUsername")),
    studentEmailDomain: sanitizeText(formData.get("studentEmailDomain")).toLowerCase()
  };

  const errors: ProfileFormState["errors"] = {};
  const skills = parseList(formData.get("skills"));
  const interests = parseList(formData.get("interests"));

  if (!roles.includes(values.role as Role)) {
    errors.role = "Choose student or professional.";
  }

  if (!yearsOfStudy.includes(values.yearOfStudy as YearOfStudy)) {
    errors.yearOfStudy = "Choose a valid study year.";
  }

  if (values.country.length < 2 || values.country.length > 56) {
    errors.country = "Enter a country between 2 and 56 characters.";
  }

  if (values.country && !/^[a-z\s.-]+$/i.test(values.country)) {
    errors.country = "Enter a valid country name.";
  }

  if (skills.length === 0) {
    errors.skills = "Add at least one skill.";
  }

  if (skills.some((skill) => skill.length > 32)) {
    errors.skills = "Keep each skill under 32 characters.";
  }

  if (interests.length === 0) {
    errors.interests = "Add at least one interest.";
  }

  if (interests.some((interest) => interest.length > 32)) {
    errors.interests = "Keep each interest under 32 characters.";
  }

  if (
    values.githubUsername &&
    !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(values.githubUsername)
  ) {
    errors.githubUsername = "Enter a valid GitHub username.";
  }

  if (
    values.studentEmailDomain &&
    !/^(?:[^\s@]+@)?(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+(?:edu|ac\.in|edu\.in)$/i.test(
      values.studentEmailDomain
    )
  ) {
    errors.studentEmailDomain = "Please use your official college/university email.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      state: {
        values,
        errors,
        message: "Fix the highlighted fields."
      },
      profile: null
    };
  }

  return {
    state: {
      values,
      errors: {},
      message: ""
    },
    profile: {
      role: values.role as Role,
      yearOfStudy: values.yearOfStudy as YearOfStudy,
      country: values.country,
      skills,
      interests,
      githubUsername: values.githubUsername || undefined,
      studentEmailDomain: values.studentEmailDomain || undefined
    }
  };
}

export function encodeProfile(profile: UserProfile) {
  return Buffer.from(JSON.stringify(profile), "utf8").toString("base64url");
}

export function decodeProfile(value: string | undefined): UserProfile | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    const formData = new FormData();

    formData.set("role", parsed.role);
    formData.set("yearOfStudy", parsed.yearOfStudy);
    formData.set("country", parsed.country);
    formData.set("skills", Array.isArray(parsed.skills) ? parsed.skills.join(",") : "");
    formData.set(
      "interests",
      Array.isArray(parsed.interests) ? parsed.interests.join(",") : ""
    );
    formData.set("githubUsername", parsed.githubUsername ?? "");
    formData.set("studentEmailDomain", parsed.studentEmailDomain ?? "");

    return validateProfileForm(formData).profile;
  } catch {
    return null;
  }
}

function sanitizeText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 500);
}
