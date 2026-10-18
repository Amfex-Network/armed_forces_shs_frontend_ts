import React, { useEffect, useState } from "react";
import { ClipboardList, Download } from "lucide-react";
import { pendingResultsApi, type PendingTeacher } from "../../api/analytics";
import { downloadCsv } from "../../utils/csv";

// Teachers who still have results to enter for the chosen period, so the
// administration can follow up with them.
export const PendingResults = ({
  term,
  academicYear,
}: {
  term: string;
  academicYear: string;
}) => {
  const [teachers, setTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    pendingResultsApi
      .get({ term, academicYear })
      .then((res) => alive && setTeachers(res.teachers))
      .catch((err) => {
        if (!alive) return;
        setTeachers([]);
        setError(err?.message || "Could not load pending results.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [term, academicYear]);

  const handleExport = () => {
    const rows: unknown[][] = [
      [
        "Teacher",
        "Phone",
        "Email",
        "Department",
        "Class",
        "Subject",
        "Entered",
        "Students",
      ],
    ];
    teachers.forEach((t) =>
      t.items.forEach((i) =>
        rows.push([
          t.name,
          t.phone,
          t.email,
          t.department,
          i.className,
          i.subject,
          i.entered,
          i.expected,
        ]),
      ),
    );
    downloadCsv(
      `pending-results-${term}-${academicYear}`.replace(/[^\w-]+/g, "_") +
        ".csv",
      rows,
    );
  };

  return (
    <div
      className="bg-white rounded-xl border shadow-sm"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex items-center gap-2">
          <ClipboardList size={16} style={{ color: "var(--accent-red)" }} />
          <div>
            <h2
              className="text-sm font-black"
              style={{ color: "var(--dark-gray)" }}
            >
              Teachers with Pending Results
            </h2>
            <p className="text-xs text-gray-400">
              {term} · {academicYear} - classes and subjects not fully entered
            </p>
          </div>
        </div>
        {teachers.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <Download size={13} /> Export
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-400">Loading…</p>
      ) : error ? (
        <p
          className="py-8 text-center text-sm"
          style={{ color: "var(--accent-red)" }}
        >
          {error}
        </p>
      ) : teachers.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          Every assigned teacher has entered their results for this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50">
                <th className="px-4 py-2">Teacher</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Pending class / subject</th>
                <th className="px-4 py-2 text-right">Scores missing</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr
                  key={t.id}
                  className="border-t align-top"
                  style={{ borderColor: "var(--medium-gray)" }}
                >
                  <td className="px-4 py-2">
                    <p className="font-bold">{t.name}</p>
                    {t.department && (
                      <p className="text-xs text-gray-400">{t.department}</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {t.phone && <p>{t.phone}</p>}
                    <p>{t.email}</p>
                  </td>
                  <td className="px-4 py-2">
                    <ul className="space-y-0.5">
                      {t.items.map((i) => (
                        <li
                          key={`${i.className}-${i.subject}`}
                          className="text-xs"
                        >
                          <b>{i.className}</b> · {i.subject}{" "}
                          <span className="text-gray-400">
                            ({i.entered}/{i.expected} entered)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td
                    className="px-4 py-2 text-right font-black"
                    style={{ color: "var(--accent-red)" }}
                  >
                    {t.missing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
