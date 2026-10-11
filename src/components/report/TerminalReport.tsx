import React from "react";
import { createPortal } from "react-dom";
import logo from "../../assets/logo.png";
import type { ReportResult } from "../../api/results";
import { reportOptions, type AppSettings } from "../../api/settings";
import { surnameFirst } from "../../utils/studentOrder";

const GRADE_STYLE: Record<string, { bg: string; fg: string }> = {
  A1: { bg: "#dcfce7", fg: "#15803d" },
  B2: { bg: "#dbeafe", fg: "#1d4ed8" },
  B3: { bg: "#dbeafe", fg: "#2563eb" },
  C4: { bg: "#fef9c3", fg: "#a16207" },
  C5: { bg: "#ffedd5", fg: "#c2410c" },
  C6: { bg: "#ffedd5", fg: "#c2410c" },
  D7: { bg: "#fee2e2", fg: "#dc2626" },
  E8: { bg: "#fee2e2", fg: "#dc2626" },
  F9: { bg: "#fee2e2", fg: "#b91c1c" },
};

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const NAVY = "#0b1f6b";

const POSITION_BASIS_TEXT: Record<string, string> = {
  total: "total marks",
  average: "average mark",
  aggregate: "aggregate of the best six subjects",
};
const RED = "#c1121f";

const longDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

const rowsOf3 = <T,>(items: T[]): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));
  return rows;
};

// The official terminal report, used by the student, parent and teacher
// portals so everyone sees (and prints) the same document. Sized to fit
// one A4 page.
export const TerminalReport = ({
  result,
  settings,
}: {
  result: ReportResult;
  settings: AppSettings;
}) => {
  const st = result.student;
  const opt = reportOptions(settings);
  const pct = result.totalMax
    ? ((result.totalScore / result.totalMax) * 100).toFixed(1)
    : "0.0";
  const att = result.attendance;
  const c = result.comments;
  const address = [settings.address, settings.district, settings.region]
    .filter(Boolean)
    .join(", ");
  const contact = [settings.phone, settings.email, settings.website]
    .filter(Boolean)
    .join(" · ");

  const details: [string, React.ReactNode][] = [
    ["Name", surnameFirst(st)],
    ["Index No.", st.studentId || "-"],
    ["Class", st.formClass || "-"],
    ["Course", st.course || "-"],
  ];
  if (opt.showPosition) {
    details.push([
      "Position",
      result.position
        ? `${ordinal(result.position)} out of ${result.outOf}`
        : "-",
    ]);
  }
  if (opt.showAggregate) {
    details.push(["Aggregate (best 6)", result.aggregate || "-"]);
  }
  if (opt.nextTermBegins) {
    details.push(["Next term begins", longDate(opt.nextTermBegins)]);
  }

  const cell: React.CSSProperties = {
    border: "1px solid #cbd5e1",
    padding: "4px 6px",
  };

  return (
    <div
      className="terminal-report bg-white text-gray-800"
      style={{ fontFamily: "Roboto, Arial, sans-serif", fontSize: 12 }}
    >
      {/* Letterhead */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          borderBottom: `3px solid ${RED}`,
        }}
      >
        <img
          src={logo}
          alt="School crest"
          style={{ width: 72, height: 72, objectFit: "contain", flexShrink: 0 }}
        />
        <div style={{ flex: 1, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 900,
              fontSize: 18,
              letterSpacing: 0.5,
              color: NAVY,
              textTransform: "uppercase",
            }}
          >
            {settings.schoolName}
          </p>
          {settings.motto && (
            <p style={{ margin: "2px 0 0", fontStyle: "italic", fontSize: 11 }}>
              “{settings.motto}”
            </p>
          )}
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#475569" }}>
            {address || "Uaddara Barracks, Kumasi, Ghana"}
          </p>
          {contact && (
            <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>
              {contact}
            </p>
          )}
          <p
            style={{
              display: "inline-block",
              margin: "6px 0 0",
              padding: "3px 14px",
              background: NAVY,
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            {opt.title.toUpperCase()} · {result.term.toUpperCase()} ·{" "}
            {result.academicYear}
          </p>
        </div>
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            objectFit: "contain",
            flexShrink: 0,
            visibility: "hidden",
          }}
        />
      </div>

      {/* Student details */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
      >
        <tbody>
          {rowsOf3(details).map((row, i) => (
            <tr key={i}>
              {row.map(([label, value], j) => (
                <td
                  key={label}
                  style={cell}
                  colSpan={j === row.length - 1 ? 4 - row.length : 1}
                >
                  <b>{label}:</b> {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Subjects */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
      >
        <thead>
          <tr style={{ background: "#e2e8f0" }}>
            {[
              "Subject",
              "Class Score (30)",
              "Exam (70)",
              "Total (100)",
              "Grade",
              "Remark",
            ].map((h, i) => (
              <th
                key={h}
                style={{
                  ...cell,
                  textAlign: i === 0 ? "left" : "center",
                  fontSize: 11,
                  textTransform: "uppercase",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.subjects.map((sub) => {
            const g = GRADE_STYLE[sub.grade] || {
              bg: "#f1f5f9",
              fg: "#334155",
            };
            return (
              <tr key={sub.name}>
                <td style={{ ...cell, fontWeight: 600 }}>{sub.name}</td>
                <td style={{ ...cell, textAlign: "center" }}>{sub.ca}</td>
                <td style={{ ...cell, textAlign: "center" }}>{sub.exam}</td>
                <td
                  style={{
                    ...cell,
                    textAlign: "center",
                    fontWeight: 800,
                    color: NAVY,
                  }}
                >
                  {sub.total}
                </td>
                <td style={{ ...cell, textAlign: "center" }}>
                  <span
                    style={{
                      background: g.bg,
                      color: g.fg,
                      fontWeight: 800,
                      padding: "1px 6px",
                    }}
                  >
                    {sub.grade}
                  </span>
                </td>
                <td style={{ ...cell, textAlign: "center" }}>{sub.remarks}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: "#f1f5f9", fontWeight: 800 }}>
            <td style={cell}>TOTAL</td>
            <td style={cell} colSpan={2} />
            <td style={{ ...cell, textAlign: "center", color: NAVY }}>
              {result.totalScore} / {result.totalMax}
            </td>
            <td style={{ ...cell, textAlign: "center" }} colSpan={2}>
              {opt.showAverage ? `Average: ${pct}%` : ""}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Attendance + conduct */}
      {(opt.showAttendance || opt.showConduct) && (
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
        >
          <tbody>
            {opt.showAttendance && (
              <tr>
                <td style={cell}>
                  <b>Attendance:</b> {att.present + att.late} of {att.totalDays}{" "}
                  day(s) ({att.rate}%)
                </td>
                <td style={cell}>
                  <b>Absent:</b> {att.absent} · <b>Late:</b> {att.late}
                </td>
              </tr>
            )}
            {opt.showConduct && (
              <tr>
                <td style={cell}>
                  <b>Conduct:</b> {c?.conduct || "-"}
                </td>
                <td style={cell}>
                  <b>Interest:</b> {c?.interest || "-"} · <b>Attitude:</b>{" "}
                  {c?.attitude || "-"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Remarks */}
      {(
        [
          opt.showFormTeacherRemarks && [
            "Form Teacher's Remarks",
            c?.formTeacher,
          ],
          opt.showHeadRemarks && [`${opt.headTitle}'s Remarks`, c?.head],
        ].filter(Boolean) as [string, string | undefined][]
      ).map(([label, text]) => (
        <div key={label} style={{ marginTop: 10 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 11,
              textTransform: "uppercase",
            }}
          >
            {label}
          </p>
          <p
            style={{
              margin: "3px 0 0",
              minHeight: 30,
              padding: "6px 8px",
              border: "1px solid #cbd5e1",
              color: text ? "#1e293b" : "#94a3b8",
              fontStyle: text ? "normal" : "italic",
            }}
          >
            {text || "No remarks recorded."}
          </p>
        </div>
      ))}

      {/* Signatures */}
      {opt.showSignatures && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 18,
            marginTop: 26,
          }}
        >
          {["Form Teacher", opt.headTitle, "Parent / Guardian"].map((who) => (
            <div key={who} style={{ textAlign: "center", fontSize: 11 }}>
              <div style={{ borderTop: "1px solid #334155", paddingTop: 4 }}>
                {who}'s Signature & Date
              </div>
            </div>
          ))}
        </div>
      )}

      <p
        style={{
          marginTop: 14,
          fontSize: 9,
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        {opt.footerNote && (
          <span style={{ display: "block", marginBottom: 2, color: "#475569" }}>
            {opt.footerNote}
          </span>
        )}
        Grades follow the school's current grading scale.
        {opt.showAggregate &&
          " Aggregate is the sum of the six best grade points (lower is better)."}
        {opt.showPosition &&
          ` Class position is by ${POSITION_BASIS_TEXT[result.positionBasis || "total"]}.`}
      </p>
    </div>
  );
};

// Renders a second copy directly under <body> that only appears on paper,
// so printing shows exactly one report - no page chrome, no background.
export const PrintableReport = ({
  result,
  settings,
}: {
  result: ReportResult;
  settings: AppSettings;
}) =>
  createPortal(
    <div className="print-root">
      <TerminalReport result={result} settings={settings} />
    </div>,
    document.body,
  );
