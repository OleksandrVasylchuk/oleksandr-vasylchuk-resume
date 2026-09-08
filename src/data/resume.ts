import raw from "./resume.json";

export interface ProjectLink {
  name: string;
  url: string;
}

export interface Job {
  role: string;
  company: string;
  companyUrl: string | null;
  start: string;
  end: string | null;
  period: string;
  location: string;
  stack: string[];
  bullets: string[];
  projects: ProjectLink[];
}

export interface FeaturedProject {
  name: string;
  url: string;
  type: string;
  company: string;
  description: string;
  stack: string[];
}

export interface Resume {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  shortTitle: string;
  location: string;
  availability: string;
  siteUrl: string;
  cvFile: string;
  summary: string;
  heroLine: string;
  contacts: {
    phone: string;
    phoneDisplay: string;
    email: string;
    linkedin: string;
    linkedinHandle: string;
    github: string;
    githubHandle: string;
    telegram: string;
  };
  stats: { value: number; suffix: string; label: string }[];
  highlights: string[];
  skillGroups: { name: string; skills: string[] }[];
  marquee: string[];
  experience: Job[];
  additionalProjects: { stack: string[]; description: string; projects: ProjectLink[] };
  featuredProjects: FeaturedProject[];
  education: { school: string; degree: string; period: string; location: string }[];
  languages: { name: string; level: string }[];
}

export const resume = raw as Resume;
export const CV_URL = `/${resume.cvFile}`;
