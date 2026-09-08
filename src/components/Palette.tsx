import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { resume, CV_URL } from "../data/resume";
import { scrollToHash } from "../lib/useLenis";

interface Item {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
}

export function usePalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (hash: string) => () => {
      onClose();
      scrollToHash(hash);
    };
    const copy = (text: string, msg: string) => async () => {
      try {
        await navigator.clipboard.writeText(text);
        setToast(msg);
        setTimeout(() => setToast(""), 1600);
      } catch {
        /* ignore */
      }
    };
    return [
      { id: "cv", label: "Download CV (PDF)", hint: "ATS-friendly", keywords: "resume pdf download cv hire", run: () => { onClose(); window.location.href = CV_URL; } },
      { id: "email", label: "Copy email", hint: resume.contacts.email, keywords: "mail contact copy", run: copy(resume.contacts.email, "Email copied") },
      { id: "phone", label: "Copy phone", hint: resume.contacts.phoneDisplay, keywords: "call phone number", run: copy(resume.contacts.phone, "Phone copied") },
      { id: "linkedin", label: "Open LinkedIn", hint: resume.contacts.linkedinHandle, keywords: "linkedin social profile", run: () => window.open(resume.contacts.linkedin, "_blank", "noreferrer") },
      { id: "github", label: "Open GitHub", hint: resume.contacts.githubHandle, keywords: "github code repos", run: () => window.open(resume.contacts.github, "_blank", "noreferrer") },
      { id: "play", label: "Play Deploy Run", hint: "mini game for recruiters", keywords: "game play fun recruiter", run: go("#play") },
      { id: "brief", label: "60-second brief", hint: "the TL;DR", keywords: "tldr brief summary recruiter quick", run: go("#play") },
      { id: "about", label: "Go to About", hint: "section", keywords: "about me bio", run: go("#about") },
      { id: "experience", label: "Go to Experience", hint: "section", keywords: "work history jobs timeline", run: go("#experience") },
      { id: "work", label: "Go to Selected work", hint: "section", keywords: "projects portfolio sites", run: go("#work") },
      { id: "stack", label: "Go to Tech stack", hint: "section", keywords: "skills tools tech", run: go("#stack") },
      { id: "contact", label: "Go to Contact", hint: "section", keywords: "contact reach talk", run: go("#contact") },
      { id: "top", label: "Back to top", hint: "hero", keywords: "top home hero", run: go("#top") },
    ];
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => (i.label + " " + i.hint + " " + i.keywords).toLowerCase().includes(s));
  }, [q, items]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[idx]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-input">
              <span className="palette-prompt">›</span>
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Type a command… (cv, email, play, contact)" aria-label="Search commands" />
              <kbd>esc</kbd>
            </div>
            <ul className="palette-list" role="listbox">
              {filtered.length === 0 && <li className="palette-empty">Nothing found. Try “cv” or “email”.</li>}
              {filtered.map((it, i) => (
                <li key={it.id} role="option" aria-selected={i === idx} className={i === idx ? "is-active" : ""} onMouseEnter={() => setIdx(i)} onClick={it.run}>
                  <span>{it.label}</span>
                  <small>{it.hint}</small>
                </li>
              ))}
            </ul>
            <div className="palette-foot">
              <span>↑↓ navigate</span>
              <span>↵ run</span>
              <span>ctrl/⌘ K toggle</span>
              {toast && <span className="palette-toast">{toast}</span>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
