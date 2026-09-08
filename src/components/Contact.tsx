import { useState } from "react";
import { resume, CV_URL } from "../data/resume";
import { Reveal } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";
import { ArrowUpRight, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../lib/Icons";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const { contacts } = resume;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contacts.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="contact-glow" aria-hidden />
      <div className="container">
        <Reveal>
          <span className="eyebrow">Contact</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="h2 contact-title">
            Let&apos;s build something
            <br />
            <em>that holds up.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="lead">
            {resume.availability}. Remote-first, international teams, product or agency. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="contact-actions">
          <Magnetic>
            <a className="btn btn-primary contact-email" href={`mailto:${contacts.email}`}>
              <MailIcon />
              {contacts.email}
            </a>
          </Magnetic>
          <button className="btn btn-ghost" onClick={copyEmail} type="button">
            {copied ? "Copied!" : "Copy email"}
          </button>
          <Magnetic>
            <a className="btn btn-ghost" href={CV_URL} download>
              <DownloadIcon />
              Download CV (PDF)
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="contact-links">
            <li>
              <a href={contacts.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon />
                <span>LinkedIn</span>
                <small>{contacts.linkedinHandle}</small>
                <ArrowUpRight width={14} height={14} />
              </a>
            </li>
            <li>
              <a href={contacts.github} target="_blank" rel="noreferrer">
                <GitHubIcon />
                <span>GitHub</span>
                <small>{contacts.githubHandle}</small>
                <ArrowUpRight width={14} height={14} />
              </a>
            </li>
            <li>
              <a href={`tel:${contacts.phone}`}>
                <PhoneIcon />
                <span>Phone</span>
                <small>{contacts.phoneDisplay}</small>
                <ArrowUpRight width={14} height={14} />
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          © {new Date().getFullYear()} {resume.name}
        </span>
        <span className="footer-built">Built with React, Three.js &amp; Motion · Deployed on Vercel</span>
        <a href={CV_URL} download className="footer-cv">
          <DownloadIcon width={14} height={14} /> CV (PDF)
        </a>
      </div>
    </footer>
  );
}
