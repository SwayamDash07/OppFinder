import type { OpportunityCategory } from "@/lib/models/opportunity";

export type SeedOpportunity = {
  title: string;
  category: OpportunityCategory;
  description: string;
  eligibilityCriteria: {
    studentStatus: "required" | "preferred" | "not_required";
    country: string[];
    skillTags: string[];
    yearOfStudy: string[];
    minimumAge?: number;
    studentEmailRequired: boolean;
    githubRequired: boolean;
    other: string;
  };
  deadline: string;
  link: string;
  tags: string[];
  value: string;
};

export const seedOpportunities: SeedOpportunity[] = [
  {
    title: "Global AI Hackathon Series with Qwen",
    category: "hackathon",
    description:
      "An online Devpost AI hackathon series for building projects with Qwen models and modern AI tooling.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["global"],
      skillTags: ["ai", "python", "javascript", "cloud", "product"],
      yearOfStudy: [],
      minimumAge: 13,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Best fit for students or early-career builders comfortable shipping an AI prototype before the August deadline."
    },
    deadline: "2026-08-17T23:59:00.000Z",
    link: "https://devpost.com/",
    tags: ["ai", "hackathon", "qwen", "global"],
    value: "Online AI hackathon participation, community visibility, and prizes"
  },
  {
    title: "DevNetwork API + Cloud + AI Hackathon 2026",
    category: "hackathon",
    description:
      "A Devpost-hosted hackathon focused on API, cloud, and AI projects during the DevNetwork event cycle.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["United States", "global"],
      skillTags: ["api", "cloud", "ai", "javascript", "python"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      minimumAge: 13,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Good fit for full-stack builders who can create an API, cloud, or AI demo."
    },
    deadline: "2026-08-17T23:59:00.000Z",
    link: "https://api-cloud-ai-hackathon-2026.devpost.com/",
    tags: ["hackathon", "api", "cloud", "ai"],
    value: "Hackathon project sprint, Devpost visibility, and challenge prizes"
  },
  {
    title: "MLH Hackcon 2026",
    category: "hackathon",
    description:
      "A Major League Hacking gathering for hackathon organizers and student community leaders.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["United States", "Canada", "global"],
      skillTags: ["community", "leadership", "hackathons", "operations"],
      yearOfStudy: [],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Most relevant for students organizing clubs, hackathons, or developer communities."
    },
    deadline: "2026-08-21T23:59:00.000Z",
    link: "https://ti.to/mlh/mlh-hackcon-2026",
    tags: ["hackathon", "leadership", "community"],
    value: "Organizer training, peer network, and hackathon community access"
  },
  {
    title: "NASA Space Apps Challenge 2026",
    category: "hackathon",
    description:
      "A global hackathon where teams use open data to solve challenges connected to space, Earth science, and exploration.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["data-science", "python", "gis", "visualization", "space"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Open to participants globally; local event availability varies by city."
    },
    deadline: "2026-11-14T23:59:00.000Z",
    link: "https://www.spaceappschallenge.org/",
    tags: ["hackathon", "space", "data", "global"],
    value: "Global challenge participation, open-data project portfolio, and awards"
  },
  {
    title: "HackMIT 2026",
    category: "hackathon",
    description:
      "A student-run hackathon at MIT for teams building technical prototypes over a concentrated weekend.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["United States", "global"],
      skillTags: ["web", "ai", "hardware", "design", "product"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Requires student status and acceptance through the event application process."
    },
    deadline: "2026-09-15T23:59:00.000Z",
    link: "https://hackmit.org/",
    tags: ["hackathon", "mit", "student", "prototype"],
    value: "Competitive hackathon experience, workshops, mentors, and prizes"
  },
  {
    title: "Hack the North 2026",
    category: "hackathon",
    description:
      "A large student hackathon hosted in Canada with mentorship, sponsor challenges, and project demos.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["Canada", "United States", "global"],
      skillTags: ["web", "mobile", "ai", "hardware", "design"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Applicants typically need to be students and may need travel eligibility for the in-person event."
    },
    deadline: "2026-09-01T23:59:00.000Z",
    link: "https://hackthenorth.com/",
    tags: ["hackathon", "canada", "student", "startup"],
    value: "Mentorship, community, sponsor tracks, and prizes"
  },
  {
    title: "Google AI Studio Free Tier",
    category: "ai_free_trial",
    description:
      "Google AI Studio provides browser-based access to Gemini models for prototyping prompts and AI applications.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["ai", "prompting", "javascript", "python"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Usage limits and model availability may vary by region and account."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://aistudio.google.com/",
    tags: ["ai", "gemini", "prompting", "prototype"],
    value: "Free model access for experiments and prototypes"
  },
  {
    title: "GitHub Copilot for Verified Students",
    category: "ai_free_trial",
    description:
      "Verified students can access GitHub Copilot through GitHub Education benefits for coding assistance inside supported editors.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["github", "javascript", "python", "typescript", "developer-tools"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires GitHub Education verification."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://github.com/education/students",
    tags: ["ai", "github", "copilot", "student"],
    value: "Free access to AI pair-programming features for verified students"
  },
  {
    title: "Notion AI for GitHub-Verified Students",
    category: "ai_free_trial",
    description:
      "GitHub-verified students can access Notion's education offer with additional AI responses for student workspaces.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["writing", "productivity", "research", "planning"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires a GitHub-verified student account and Notion education signup."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.notion.so/githubstudentpack",
    tags: ["ai", "notion", "student", "productivity"],
    value: "Education Plus workspace with additional AI responses"
  },
  {
    title: "Replit Student Developer Pack Offer",
    category: "ai_free_trial",
    description:
      "A GitHub Student Developer Pack partner offer for cloud development and AI-assisted coding experiments in Replit.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["web", "python", "javascript", "ai", "prototyping"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires GitHub Student Developer Pack verification."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://education.github.com/pack",
    tags: ["ai", "cloud-ide", "github-pack", "prototype"],
    value: "Student developer credits or plan access through GitHub Education"
  },
  {
    title: "Deepnote Education",
    category: "ai_free_trial",
    description:
      "Deepnote supports student data science workflows with collaborative notebooks and AI-assisted analysis features.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["global"],
      skillTags: ["data-science", "python", "machine-learning", "analytics"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Most relevant for coursework, research notebooks, and data projects."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://deepnote.com/education",
    tags: ["ai", "data-science", "notebooks", "education"],
    value: "Collaborative notebook tooling for classes and projects"
  },
  {
    title: "Perplexity Student Program",
    category: "ai_free_trial",
    description:
      "A student-focused AI research assistant offer for faster research, source discovery, and study workflows.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["research", "writing", "ai", "study"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Requires school verification where available."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.perplexity.ai/students",
    tags: ["ai", "research", "student"],
    value: "Student access or discount for AI research features"
  },
  {
    title: "GitHub Student Developer Pack",
    category: "subscription_offer",
    description:
      "A bundle of student-only developer tools including hosting, databases, domains, APIs, learning platforms, and productivity services.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["github", "web", "cloud", "databases", "developer-tools"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires proof of current student enrollment through GitHub Education."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://education.github.com/pack",
    tags: ["student-pack", "github", "developer-tools"],
    value: "Dozens of professional developer tools at no cost for verified students"
  },
  {
    title: "JetBrains Student Pack",
    category: "subscription_offer",
    description:
      "Free educational licenses for JetBrains IDEs and developer tools for students in accredited programs.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["java", "kotlin", "python", "javascript", "ide"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Applicants must be enrolled in an accredited educational program lasting longer than one year."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.jetbrains.com/academy/student-pack/",
    tags: ["ide", "student", "jetbrains", "developer-tools"],
    value: "Free access to JetBrains IDEs for educational use"
  },
  {
    title: "Notion Education Plus Plan",
    category: "subscription_offer",
    description:
      "A free Plus Plan for individual students and educators using a verified education institution email.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["productivity", "writing", "planning", "collaboration"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Available to students and teachers signed in with an eligible education institution email."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.notion.com/help/notion-for-education",
    tags: ["notion", "student", "productivity"],
    value: "Free Notion Plus workspace for individual education use"
  },
  {
    title: "Canva for Education",
    category: "subscription_offer",
    description:
      "Canva's education offering provides design and collaboration tools for eligible education communities.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["global"],
      skillTags: ["design", "presentation", "marketing", "content"],
      yearOfStudy: [],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Availability depends on institution and role; most useful for class projects, pitch decks, and student organizations."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.canva.com/education/",
    tags: ["design", "education", "presentation"],
    value: "Design and presentation tooling for education use"
  },
  {
    title: "Figma for Education",
    category: "subscription_offer",
    description:
      "Figma offers free education access for students and educators working on design, UI, and prototyping projects.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["design", "ui", "ux", "prototype", "frontend"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Requires education verification."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.figma.com/education/",
    tags: ["figma", "design", "student", "prototype"],
    value: "Free access to Figma education features for design work"
  },
  {
    title: "Namecheap for Education",
    category: "subscription_offer",
    description:
      "A GitHub Student Developer Pack domain offer that helps students publish portfolios and project demos.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["web", "portfolio", "deployment", "dns"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires GitHub Student Developer Pack access."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://education.github.com/pack",
    tags: ["domain", "github-pack", "web", "portfolio"],
    value: "Student domain benefit through GitHub Education"
  },
  {
    title: "Microsoft Learn Student Ambassadors",
    category: "student_program",
    description:
      "A global Microsoft student community for learning AI, cloud, developer tools, and community leadership.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["ai", "azure", "leadership", "community", "cloud"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Open to students from many backgrounds; practical learning and community contribution are the main fit signals."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://learn.microsoft.com/en-us/training/student-hub/become-a-student-ambassador",
    tags: ["microsoft", "student", "community", "ai"],
    value: "Learning paths, community recognition, and leadership experience"
  },
  {
    title: "GitHub Campus Experts",
    category: "student_program",
    description:
      "A student leadership program for building technical communities on campus with GitHub training and support.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["github", "community", "leadership", "open-source"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Applicants must first qualify for the GitHub Student Developer Pack."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://github.com/education/students/campus-expert",
    tags: ["github", "campus", "leadership", "student"],
    value: "Community leadership training, GitHub recognition, and campus support"
  },
  {
    title: "AWS Educate",
    category: "student_program",
    description:
      "A beginner-friendly cloud learning program with hands-on labs, learning content, and career resources.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["aws", "cloud", "devops", "backend", "security"],
      yearOfStudy: [],
      minimumAge: 13,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Learners can register with an email address; no credit card is needed."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://aws.amazon.com/education/awseducate/",
    tags: ["aws", "cloud", "student", "learning"],
    value: "Free cloud learning labs, badges, and career content"
  },
  {
    title: "Google Developer Student Clubs",
    category: "student_program",
    description:
      "A university-based community program for students learning Google developer technologies and building local projects.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["android", "web", "cloud", "ai", "community"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Availability depends on whether a campus chapter or lead application is open."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://developers.google.com/community/gdsc",
    tags: ["google", "student", "community", "developer"],
    value: "Peer learning, events, project experience, and community leadership"
  },
  {
    title: "Postman Student Program",
    category: "student_program",
    description:
      "A student-focused API learning program with resources for API design, testing, and collaboration.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["api", "backend", "testing", "javascript", "collaboration"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: false,
      other: "Best fit for students building backend, API, or full-stack projects."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.postman.com/student-program/",
    tags: ["api", "postman", "student", "backend"],
    value: "API learning resources, student community, and workspace benefits"
  },
  {
    title: "MLH Fellowship",
    category: "student_program",
    description:
      "A remote internship-style program for software engineering, open source, production engineering, and technical learning tracks.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["global"],
      skillTags: ["software-engineering", "open-source", "python", "javascript", "devops"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: true,
      other: "Requires enough coding experience to pass the program application and time commitment."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://fellowship.mlh.io/",
    tags: ["mlh", "fellowship", "remote", "software-engineering"],
    value: "Structured project experience, mentorship, and resume-ready work"
  },
  {
    title: "MongoDB Student Certification Benefit",
    category: "certification",
    description:
      "MongoDB student benefits include free certification access through the GitHub Student Developer Pack.",
    eligibilityCriteria: {
      studentStatus: "required",
      country: ["global"],
      skillTags: ["mongodb", "database", "backend", "node"],
      yearOfStudy: ["high-school", "freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: true,
      githubRequired: true,
      other: "Requires GitHub Student Developer Pack eligibility and completion of an eligible MongoDB University learning path."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.mongodb.com/students",
    tags: ["mongodb", "certification", "database", "student"],
    value: "Free MongoDB certification voucher and $50 Atlas credits"
  },
  {
    title: "freeCodeCamp Responsive Web Design Certification",
    category: "certification",
    description:
      "A free project-based certification covering HTML, CSS, accessibility, responsive layouts, and web fundamentals.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["html", "css", "frontend", "accessibility", "web"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Open to anyone who completes the required projects."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    tags: ["certification", "frontend", "free", "web"],
    value: "Free portfolio projects and certification"
  },
  {
    title: "freeCodeCamp JavaScript Algorithms and Data Structures",
    category: "certification",
    description:
      "A free JavaScript certification focused on programming fundamentals, algorithms, and project practice.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["javascript", "algorithms", "frontend", "problem-solving"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Open to anyone who completes the curriculum and certification projects."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
    tags: ["certification", "javascript", "free"],
    value: "Free JavaScript certification and practice projects"
  },
  {
    title: "AWS Educate Introduction to Cloud 101 Badge",
    category: "certification",
    description:
      "A beginner AWS Educate learning badge that helps students prove cloud fundamentals before deeper certifications.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["aws", "cloud", "backend", "devops"],
      yearOfStudy: [],
      minimumAge: 13,
      studentEmailRequired: false,
      githubRequired: false,
      other: "Available through AWS Educate learning content."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://aws.amazon.com/education/awseducate/",
    tags: ["aws", "cloud", "badge", "certification"],
    value: "Free cloud learning badge for beginner AWS knowledge"
  },
  {
    title: "Microsoft Learn AI Skills Challenge",
    category: "certification",
    description:
      "Microsoft Learn collections and challenges help students build AI and cloud skills with guided modules.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["ai", "azure", "cloud", "machine-learning"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Availability of challenge rewards may vary, but the learning paths are open online."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://learn.microsoft.com/en-us/training/",
    tags: ["microsoft", "ai", "learning", "certification"],
    value: "Guided learning modules and preparation for Microsoft credentials"
  },
  {
    title: "Kaggle Micro-Courses Certificates",
    category: "certification",
    description:
      "Short, free practical courses for Python, pandas, machine learning, SQL, and data visualization.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["python", "machine-learning", "data-science", "sql"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Open to anyone with a Kaggle account."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.kaggle.com/learn",
    tags: ["kaggle", "data-science", "python", "certification"],
    value: "Free course completion certificates and practical notebooks"
  },
  {
    title: "Google Summer of Code 2027 Preparation",
    category: "open_source_program",
    description:
      "A preparation opportunity for the next Google Summer of Code contributor cycle, using the official program timeline and organization discovery flow.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["open-source", "python", "javascript", "go", "documentation"],
      yearOfStudy: [],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: true,
      other: "The 2026 contributor window has closed; this entry is for students preparing early for the next cycle by shortlisting organizations and making starter contributions."
    },
    deadline: "2027-03-31T18:00:00.000Z",
    link: "https://developers.google.com/open-source/gsoc/timeline",
    tags: ["open-source", "gsoc", "mentorship", "global"],
    value: "Mentored open-source project experience and contributor stipend"
  },
  {
    title: "Outreachy Internships",
    category: "open_source_program",
    description:
      "A remote internship program supporting people subject to systemic bias and underrepresentation in tech.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["open-source", "documentation", "python", "linux", "community"],
      yearOfStudy: [],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: true,
      other: "Applicants must meet Outreachy eligibility rules, including availability and underrepresentation criteria."
    },
    deadline: "2026-08-31T23:59:00.000Z",
    link: "https://www.outreachy.org/",
    tags: ["open-source", "internship", "remote", "diversity"],
    value: "Paid remote open-source internship and mentorship"
  },
  {
    title: "Linux Foundation Mentorship Program",
    category: "open_source_program",
    description:
      "Mentorship opportunities across Linux Foundation projects for contributors building open-source skills.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["linux", "open-source", "cloud-native", "security", "devops"],
      yearOfStudy: [],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: true,
      other: "Specific eligibility and deadlines vary by mentorship term and project."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://mentorship.lfx.linuxfoundation.org/",
    tags: ["open-source", "linux", "mentorship", "devops"],
    value: "Mentored open-source contribution experience across foundation projects"
  },
  {
    title: "Season of KDE",
    category: "open_source_program",
    description:
      "A KDE community mentorship program for new contributors working on open-source software, design, documentation, and outreach.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["open-source", "qt", "c++", "design", "documentation"],
      yearOfStudy: [],
      studentEmailRequired: false,
      githubRequired: false,
      other: "Applicants should match with a KDE project and mentor during the active season."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://season.kde.org/",
    tags: ["open-source", "kde", "mentorship"],
    value: "Mentorship and recognized KDE contribution experience"
  },
  {
    title: "Google Summer of Code Organizations Explorer",
    category: "open_source_program",
    description:
      "An explorer for finding past and current GSoC organizations by technology tags and project areas.",
    eligibilityCriteria: {
      studentStatus: "not_required",
      country: ["global"],
      skillTags: ["open-source", "research", "python", "javascript", "devops"],
      yearOfStudy: [],
      minimumAge: 18,
      studentEmailRequired: false,
      githubRequired: true,
      other: "Useful for preparing future GSoC applications and finding organizations before application windows open."
    },
    deadline: "2026-12-31T23:59:00.000Z",
    link: "https://www.gsocorganizations.dev/",
    tags: ["open-source", "gsoc", "research", "organizations"],
    value: "Discovery path for matching skills to open-source mentoring organizations"
  },
  {
    title: "Open Source Promotion Plan 2027 Preparation",
    category: "open_source_program",
    description:
      "A preparation opportunity for students interested in the Open Source Promotion Plan summer mentorship cycle.",
    eligibilityCriteria: {
      studentStatus: "preferred",
      country: ["China", "global"],
      skillTags: ["open-source", "linux", "backend", "frontend", "documentation"],
      yearOfStudy: ["freshman", "sophomore", "junior", "senior", "graduate"],
      studentEmailRequired: false,
      githubRequired: true,
      other: "The 2026 application period is expected to be closed by late June; this is best used for preparing early and matching skills to communities."
    },
    deadline: "2027-06-30T23:59:00.000Z",
    link: "https://summer-ospp.ac.cn/",
    tags: ["open-source", "mentorship", "student", "summer"],
    value: "Mentored open-source project work and potential stipend"
  }
];
