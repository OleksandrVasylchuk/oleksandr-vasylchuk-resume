import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CV_URL } from "../data/resume";
import { useI18n } from "../i18n";
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
  const { t, resume, toggle } = useI18n();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const L = t.palette.items;
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
      { id: "cv", label: L.cv[0], hint: L.cv[1], keywords: "resume pdf download cv hire резюме", run: () => { onClose(); window.location.href = CV_URL; } },
      { id: "email", label: L.email[0], hint: resume.contacts.email, keywords: "mail contact copy пошта", run: copy(resume.contacts.email, t.palette.toastEmail) },
      { id: "phone", label: L.phone[0], hint: resume.contacts.phoneDisplay, keywords: "call phone number телефон", run: copy(resume.contacts.phone, t.palette.toastPhone) },
      { id: "linkedin", label: L.linkedin[0], hint: resume.contacts.linkedinHandle, keywords: "linkedin social profile", run: () => window.open(resume.contacts.linkedin, "_blank", "noreferrer") },
      { id: "github", label: L.github[0], hint: resume.contacts.githubHandle, keywords: "github code repos", run: () => window.open(resume.contacts.github, "_blank", "noreferrer") },
      { id: "play", label: L.play[0], hint: L.play[1], keywords: "game play fun recruiter гра", run: go("#play") },
      { id: "brief", label: L.brief[0], hint: L.brief[1], keywords: "tldr brief summary recruiter quick бриф", run: go("#play") },
      { id: "lang", label: L.lang[0], hint: L.lang[1], keywords: "language мова english ukrainian українська", run: () => { toggle(); onClose(); } },
      { id: "about", label: L.about[0], hint: L.about[1], keywords: "about me bio про мене", run: go("#about") },
      { id: "experience", label: L.experience[0], hint: L.experience[1], keywords: "work history jobs timeline досвід", run: go("#experience") },
      { id: "work", label: L.work[0], hint: L.work[1], keywords: "projects portfolio sites роботи", run: go("#work") },
      { id: "stack", label: L.stack[0], hint: L.stack[1], keywords: "skills tools tech стек", run: go("#stack") },
      { id: "contact", label: L.contact[0], hint: L.contact[1], keywords: "contact reach talk контакти", run: go("#contact") },
      { id: "top", label: L.top[0], hint: L.top[1], keywords: "top home hero", run: go("#top") },
    ];
  }, [onClose, t, resume, toggle]);

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
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={t.palette.placeholder} aria-label="Search commands" />
              <kbd>esc</kbd>
            </div>
            <ul className="palette-list" role="listbox">
              {filtered.length === 0 && <li className="palette-empty">{t.palette.empty}</li>}
              {filtered.map((it, i) => (
                <li key={it.id} role="option" aria-selected={i === idx} className={i === idx ? "is-active" : ""} onMouseEnter={() => setIdx(i)} onClick={it.run}>
                  <span>{it.label}</span>
                  <small>{it.hint}</small>
                </li>
              ))}
            </ul>
            <div className="palette-foot">
              <span>{t.palette.nav}</span>
              <span>{t.palette.run}</span>
              <span>{t.palette.toggle}</span>
              {toast && <span className="palette-toast">{toast}</span>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
