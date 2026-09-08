import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { resume as base, type Resume } from "../data/resume";
import uk from "../data/resume.uk.json";
import { UI_DICT, type Lang, type UI } from "./ui";

const KEY = "ov-lang";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: UI;
  resume: Resume;
}

const I18nContext = createContext<Ctx | null>(null);

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "uk") return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "").toLowerCase();
  return nav.startsWith("uk") ? "uk" : "en";
}

/** Deep-merge Ukrainian overrides onto the English resume (arrays merged index by index). */
function localize(): Resume {
  const o = uk as Partial<Resume> & { skillGroups?: { name: string; skills?: string[] }[] };
  return {
    ...base,
    title: o.title ?? base.title,
    shortTitle: o.shortTitle ?? base.shortTitle,
    location: o.location ?? base.location,
    availability: o.availability ?? base.availability,
    summary: o.summary ?? base.summary,
    heroLine: o.heroLine ?? base.heroLine,
    stats: o.stats ?? base.stats,
    highlights: o.highlights ?? base.highlights,
    skillGroups: base.skillGroups.map((g, i) => ({ ...g, ...(o.skillGroups?.[i] ?? {}) })),
    experience: base.experience.map((j, i) => ({ ...j, ...(o.experience?.[i] ?? {}) })),
    additionalProjects: { ...base.additionalProjects, ...(o.additionalProjects ?? {}) },
    featuredProjects: base.featuredProjects.map((p, i) => ({ ...p, ...(o.featuredProjects?.[i] ?? {}) })),
    education: base.education.map((e, i) => ({ ...e, ...(o.education?.[i] ?? {}) })),
    languages: o.languages ?? base.languages,
  };
}

const RESUME_UK = localize();

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);
  const toggle = useCallback(() => setLang(lang === "en" ? "uk" : "en"), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, toggle, t: UI_DICT[lang], resume: lang === "uk" ? RESUME_UK : base }), [lang, setLang, toggle]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
