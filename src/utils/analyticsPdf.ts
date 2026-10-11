import logo from "../assets/logo.png";
import type { AnalyticsReport } from "../api/analytics";

export const ANALYTICS_SECTIONS = [
  { key: "summary", label: "Summary" },
  { key: "grades", label: "Grade distribution" },
  { key: "subjects", label: "Subject performance" },
  { key: "classes", label: "Class performance" },
  { key: "classSubjects", label: "Class and subject breakdown" },
  { key: "top", label: "Top 10 students" },
  { key: "support", label: "Students needing support" },
  { key: "attendance", label: "Attendance" },
] as const;

export type SectionKey = (typeof ANALYTICS_SECTIONS)[number]["key"];

const NAVY: [number, number, number] = [11, 31, 107];

const dataUrl = async (src: string) => {
  const blob = await (await fetch(src)).blob();
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
};

const safeName = (v: string) => v.replace(/[^A-Za-z0-9]+/g, "_");

export const downloadAnalyticsPdf = async (opts: {
  report: AnalyticsReport;
  sections: SectionKey[];
  schoolName: string;
  scope: string;
  preparedBy: string;
}) => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const { report: r, sections } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  try {
    doc.addImage(await dataUrl(logo), "PNG", margin, 30, 48, 48);
  } catch {
    // The report is still useful without the crest.
  }
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(opts.schoolName.toUpperCase(), pageWidth / 2, 48, {
    align: "center",
    maxWidth: pageWidth - 2 * margin - 110,
  });
  doc.setFontSize(11);
  doc.text("TERMINAL REPORT ANALYSIS", pageWidth / 2, 66, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70);
  doc.setFontSize(9);
  doc.text(`${opts.scope} · ${r.term} · ${r.academicYear}`, pageWidth / 2, 80, {
    align: "center",
  });
  doc.text(
    `Prepared by ${opts.preparedBy} on ${new Date().toLocaleString("en-GB")}`,
    pageWidth / 2,
    92,
    { align: "center" },
  );
  doc.setDrawColor(193, 18, 31);
  doc.setLineWidth(1.5);
  doc.line(margin, 102, pageWidth - margin, 102);

  let y = 118;
  const heading = (text: string) => {
    if (y > doc.internal.pageSize.getHeight() - 90) {
      doc.addPage();
      y = 50;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(text, margin, y);
    y += 6;
  };
  const table = (
    head: string[],
    body: (string | number)[][],
    empty: string,
  ) => {
    autoTable(doc, {
      startY: y,
      head: [head],
      body: body.length ? body : [[{ content: empty, colSpan: head.length }]],
      margin: { left: margin, right: margin },
      styles: { fontSize: 8.5, cellPadding: 4 },
      headStyles: { fillColor: NAVY, textColor: 255 },
      alternateRowStyles: { fillColor: [244, 246, 250] },
    });
    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 22;
  };
  const pct = (n: number) => `${n}%`;

  const s = r.summary;
  if (sections.includes("summary")) {
    heading("Summary");
    table(
      ["Measure", "Value"],
      [
        ["Students", s.students],
        ["Students with scores", s.studentsWithScores],
        ["Scores entered", s.entries],
        ["Average score", s.entries ? s.average : "-"],
        ["Credit pass rate (A1 to C6)", s.entries ? pct(s.passRate) : "-"],
        [
          "Highest / lowest score",
          s.entries ? `${s.highest} / ${s.lowest}` : "-",
        ],
        [
          "Attendance rate",
          r.attendance.records ? pct(r.attendance.rate) : "-",
        ],
      ],
      "",
    );
  }
  if (sections.includes("grades")) {
    heading("Grade distribution");
    const all = r.gradeDistribution.reduce((a, g) => a + g.count, 0);
    table(
      ["Grade", "Count", "Share"],
      r.gradeDistribution.map((g) => [
        g.grade,
        g.count,
        all ? pct(Math.round((g.count / all) * 100)) : "-",
      ]),
      "No grades yet.",
    );
  }
  if (sections.includes("subjects")) {
    heading("Subject performance");
    table(
      ["Subject", "Scores", "Average", "Pass rate", "Highest", "Lowest"],
      r.subjects.map((x) => [
        x.subject,
        x.entries,
        x.average,
        pct(x.passRate),
        x.highest,
        x.lowest,
      ]),
      "No scores entered for this term.",
    );
  }
  if (sections.includes("classes")) {
    heading("Class performance");
    table(
      ["Class", "Students", "With scores", "Average", "Pass rate"],
      r.classes.map((x) => [
        x.className,
        x.students,
        x.withScores,
        x.entries ? x.average : "-",
        x.entries ? pct(x.passRate) : "-",
      ]),
      "No classes in this view.",
    );
  }
  if (sections.includes("classSubjects")) {
    heading("Class and subject breakdown");
    table(
      ["Class", "Subject", "Entered", "Average", "Pass rate"],
      r.classSubjects.map((x) => [
        x.className,
        x.subject,
        `${x.entries} of ${x.students}`,
        x.average,
        pct(x.passRate),
      ]),
      "No scores entered for this term.",
    );
  }
  const studentTable = (rows: AnalyticsReport["topStudents"], empty: string) =>
    table(
      [
        "#",
        "Name",
        "Index No.",
        "Class",
        "Subjects",
        "Average",
        "Below credit",
      ],
      rows.map((x, i) => [
        i + 1,
        x.name,
        x.studentId,
        x.className,
        x.subjects,
        x.average,
        x.belowCredit,
      ]),
      empty,
    );
  if (sections.includes("top")) {
    heading("Top 10 students (by average)");
    studentTable(r.topStudents, "No scores entered for this term.");
  }
  if (sections.includes("support")) {
    heading(
      "Students needing support (average below 50 or 3+ grades below credit)",
    );
    studentTable(r.needsSupport, "No student is below the support line.");
  }
  if (sections.includes("attendance")) {
    heading("Attendance");
    const a = r.attendance;
    table(
      ["Class", "Records", "Attendance rate"],
      [
        ...a.byClass.map((x) => [x.className, x.records, pct(x.rate)]),
        ...(a.records ? [["All classes", a.records, pct(a.rate)]] : []),
      ],
      "No attendance recorded for this term.",
    );
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `Page ${i} of ${pages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" },
    );
  }

  doc.save(
    `AFSHTS_Analysis_${safeName(opts.scope)}_${safeName(r.term)}_${safeName(r.academicYear)}.pdf`,
  );
};
