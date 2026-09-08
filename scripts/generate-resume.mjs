/**
 * Generates an ATS-friendly PDF resume from src/data/resume.json into public/.
 *
 * ATS rules followed here:
 *  - single column, no tables, no text boxes, no images, no icons
 *  - standard embedded font (Helvetica) so text extracts cleanly
 *  - conventional section headings (Summary, Skills, Experience, Education)
 *  - plain "Month YYYY - Month YYYY" dates and "Role, Company" lines
 *  - real Unicode text (selectable/searchable), PDF metadata with keywords
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/data/resume.json"), "utf8"));
const outDir = path.join(root, "public");
const outFile = path.join(outDir, data.cvFile);

fs.mkdirSync(outDir, { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 46, bottom: 46, left: 50, right: 50 },
  info: {
    Title: `${data.name} - ${data.shortTitle} - Resume`,
    Author: data.name,
    Subject: "Resume / CV",
    Keywords: [
      "Senior WordPress Developer",
      "Tech Lead",
      "Full-Stack Developer",
      "PHP",
      "WooCommerce",
      "React",
      "CI/CD",
      ...data.skillGroups.flatMap((g) => g.skills),
    ].join(", "),
    Creator: data.siteUrl,
  },
  pdfVersion: "1.7",
  tagged: true,
  displayTitle: true,
  lang: "en-US",
});

doc.pipe(fs.createWriteStream(outFile));

const COLORS = { ink: "#111111", muted: "#444444", rule: "#BBBBBB" };
const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;

const ascii = (s) =>
  String(s)
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/·/g, "|")
    .replace(/’/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...");

function heading(text) {
  doc.moveDown(0.9);
  doc.font("Helvetica-Bold").fontSize(11.5).fillColor(COLORS.ink).text(text.toUpperCase(), { characterSpacing: 0.8 });
  const y = doc.y + 3;
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.margins.left + W, y)
    .lineWidth(0.8)
    .strokeColor(COLORS.rule)
    .stroke();
  doc.moveDown(0.6);
}

function bullet(text) {
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.ink)
    .text("• " + ascii(text), doc.page.margins.left, doc.y, { width: W, lineGap: 1.5, indent: 0 });
  doc.moveDown(0.25);
}

/* ---------- Header ---------- */
doc.font("Helvetica-Bold").fontSize(22).fillColor(COLORS.ink).text(data.name.toUpperCase(), { characterSpacing: 1.2 });
doc.moveDown(0.15);
doc.font("Helvetica").fontSize(12).fillColor(COLORS.muted).text(ascii(data.title));
doc.moveDown(0.35);
doc
  .font("Helvetica")
  .fontSize(9.5)
  .fillColor(COLORS.ink)
  .text([data.contacts.email, data.contacts.phone, ascii(data.location)].join("   |   "));
doc
  .font("Helvetica")
  .fontSize(9.5)
  .fillColor(COLORS.ink)
  .text(
    [
      data.contacts.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
      data.contacts.github.replace(/^https?:\/\/(www\.)?/, ""),
      data.siteUrl.replace(/^https?:\/\//, ""),
    ].join("   |   "),
  );
doc.fontSize(9.5).fillColor(COLORS.muted).text(ascii(data.availability));

/* ---------- Summary ---------- */
heading("Professional Summary");
doc.font("Helvetica").fontSize(10).fillColor(COLORS.ink).text(ascii(data.summary), { lineGap: 2, align: "left" });

/* ---------- Skills ---------- */
heading("Technical Skills");
for (const group of data.skillGroups) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.ink).text(`${ascii(group.name)}: `, { continued: true });
  doc.font("Helvetica").fillColor(COLORS.ink).text(ascii(group.skills.join(", ")), { lineGap: 1.5 });
  doc.moveDown(0.2);
}

/* ---------- Experience ---------- */
heading("Work Experience");
for (const job of data.experience) {
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLORS.ink).text(ascii(job.role));
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text(ascii(`${job.company}  |  ${job.period}  |  ${job.location}`));
  doc.moveDown(0.3);
  for (const b of job.bullets) bullet(b);
  if (job.projects.length) {
    doc
      .font("Helvetica-Oblique")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        "Projects: " + job.projects.map((p) => `${ascii(p.name)} (${p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")})`).join(", "),
        { lineGap: 1 },
      );
  }
  doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted).text("Stack: " + ascii(job.stack.join(", ")));
  doc.moveDown(0.7);
}

/* Additional projects */
doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLORS.ink).text("Additional Freelance Projects");
doc.moveDown(0.3);
bullet(data.additionalProjects.description);
doc
  .font("Helvetica-Oblique")
  .fontSize(9)
  .fillColor(COLORS.muted)
  .text(
    "Projects: " +
      data.additionalProjects.projects.map((p) => `${ascii(p.name)} (${p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")})`).join(", "),
  );
doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted).text("Stack: " + ascii(data.additionalProjects.stack.join(", ")));

/* ---------- Education ---------- */
heading("Education");
for (const e of data.education) {
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLORS.ink).text(ascii(e.degree));
  doc.font("Helvetica").fontSize(10).fillColor(COLORS.muted).text(ascii(`${e.school}  |  ${e.period}  |  ${e.location}`));
  doc.moveDown(0.5);
}

/* ---------- Languages ---------- */
heading("Languages");
doc
  .font("Helvetica")
  .fontSize(10)
  .fillColor(COLORS.ink)
  .text(ascii(data.languages.map((l) => `${l.name} - ${l.level}`).join("   |   ")));

doc.end();
console.log(`✔ Resume PDF written to public/${data.cvFile}`);
