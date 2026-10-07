import React, { useState } from "react";
import { Download, Upload, FileSpreadsheet, KeyRound, X } from "lucide-react";
import { usersApi } from "../../api/users";
import {
  type ColumnSpec,
  parsePeopleSheet,
  downloadPeopleTemplate,
  downloadPeopleExport,
  downloadCredentialSheet,
  inBatches,
} from "../../utils/peopleSheets";

type Created = Awaited<
  ReturnType<typeof usersApi.bulkCreate>
>["created"][number];
type Skipped = Awaited<
  ReturnType<typeof usersApi.bulkCreate>
>["skipped"][number];

interface Props {
  role: "teacher" | "parent";
  label: string;
  columns: ColumnSpec[];
  examples: string[][];
  guide: string[];
  exportRows: () => Record<string, unknown>[];
  onImported: () => void;
}

const stamp = () => new Date().toISOString().slice(0, 10);

// Template / Import / Export for staff and parent accounts. Imported
// accounts get one-time passwords, delivered once as a login sheet.
const PeopleImportExport = ({
  role,
  label,
  columns,
  examples,
  guide,
  exportRows,
  onImported,
}: Props) => {
  const [busy, setBusy] = useState("");
  const [result, setResult] = useState<{
    created: Created[];
    skipped: Skipped[];
  } | null>(null);
  const [error, setError] = useState("");

  const saveLogins = (created: Created[]) =>
    downloadCredentialSheet(
      `AFSHTS_${label}_Logins_${stamp()}.xlsx`,
      role === "teacher"
        ? ["Name", "Email", "Staff ID", "One-time password"]
        : ["Name", "Email", "Linked children", "One-time password"],
      created.map((c) => [
        c.name,
        c.email,
        role === "teacher" ? c.staffId : c.children,
        c.tempPassword,
      ]),
    );

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      setBusy("Reading file…");
      const rows = await parsePeopleSheet(file, columns);
      if (rows.length === 0) {
        setError("The file has a header row but no data rows.");
        return;
      }
      const res = await inBatches(
        rows,
        25,
        (batch) => usersApi.bulkCreate(role, batch),
        (done, total) => setBusy(`Importing ${done} of ${total}…`),
      );
      setResult(res as { created: Created[]; skipped: Skipped[] });
      if (res.created.length) {
        saveLogins(res.created as Created[]);
        onImported();
      }
    } catch (err: any) {
      setError(err?.message || "Import failed.");
    } finally {
      setBusy("");
    }
  };

  const btn =
    "flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition";

  return (
    <>
      <button
        type="button"
        className={btn}
        style={{
          borderColor: "var(--success-dark)",
          color: "var(--success-dark)",
          backgroundColor: "#f0fdf4",
        }}
        onClick={() =>
          downloadPeopleTemplate(
            `AFSHTS_${label}_Import_Template.xlsx`,
            columns,
            examples,
            guide,
          )
        }
      >
        <FileSpreadsheet size={13} /> Template
      </button>
      <label
        className={`${btn} cursor-pointer`}
        style={{
          borderColor: "var(--royal-blue)",
          color: "var(--royal-blue)",
          backgroundColor: "#eef2ff",
          opacity: busy ? 0.7 : 1,
        }}
      >
        <Upload size={13} /> {busy || "Import Excel"}
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          disabled={!!busy}
          onChange={handleImport}
        />
      </label>
      <button
        type="button"
        className={btn}
        style={{
          borderColor: "var(--medium-gray)",
          color: "var(--dark-gray)",
          backgroundColor: "white",
        }}
        onClick={() =>
          downloadPeopleExport(
            `AFSHTS_${label}_${stamp()}.xlsx`,
            columns,
            exportRows(),
          )
        }
      >
        <Download size={13} /> Export
      </button>

      {error && (
        <div
          className="fixed top-4 right-4 z-[70] max-w-sm px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-start gap-2"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {result && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            <div
              className="px-6 py-5 text-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
              }}
            >
              <p className="text-white font-black text-lg">Import Complete</p>
              <p className="text-blue-200 text-xs mt-1">
                {result.created.length} created · {result.skipped.length}{" "}
                skipped
              </p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto text-sm">
              {result.created.length > 0 && (
                <div
                  className="p-3 rounded-xl text-xs"
                  style={{ backgroundColor: "#fffbeb", color: "#92400e" }}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <KeyRound size={13} /> The login sheet with one-time
                    passwords has been downloaded.
                  </p>
                  <p className="mt-1">
                    It is the only copy - hand each password out privately and
                    delete the file afterwards. Everyone must set their own
                    password at first sign-in.
                  </p>
                  <button
                    type="button"
                    onClick={() => saveLogins(result.created)}
                    className="mt-2 font-bold underline"
                  >
                    Download it again
                  </button>
                </div>
              )}
              {result.created.some((c) => c.warnings.length) && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">
                    Created with warnings
                  </p>
                  <div className="rounded-xl border divide-y max-h-40 overflow-y-auto">
                    {result.created
                      .filter((c) => c.warnings.length)
                      .map((c) => (
                        <div key={c.email} className="px-3 py-2 text-xs">
                          <span className="font-semibold">{c.email}</span>
                          <span className="text-gray-500">
                            {" "}
                            - {c.warnings.join("; ")}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {result.skipped.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">
                    Skipped rows
                  </p>
                  <div className="rounded-xl border divide-y max-h-48 overflow-y-auto">
                    {result.skipped.map((s, i) => (
                      <div key={i} className="px-3 py-2 text-xs">
                        <span className="font-semibold">
                          Row {s.row}
                          {s.email ? ` (${s.email})` : ""}
                        </span>
                        <span className="text-gray-500"> - {s.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setResult(null)}
                className="w-full py-2.5 text-sm font-bold text-white rounded-xl"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PeopleImportExport;
