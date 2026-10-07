import * as XLSX from "xlsx";

export interface SheetRow {
  studentId: string;
  name: string;
  ca: number | null;
  exam: number | null;
}

const norm = (h: unknown) =>
  String(h ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const ID_HEADERS = [
  "indexno",
  "indexnumber",
  "index",
  "studentid",
  "id",
  "studentno",
];
const CA_HEADERS = [
  "ca30",
  "ca",
  "classscore",
  "classscore30",
  "continuousassessment",
  "classwork",
];
const EXAM_HEADERS = [
  "exam70",
  "exam",
  "examscore",
  "examscore70",
  "examination",
];

const safeName = (v: string) => v.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 80);

// A sheet pre-filled with the class list (in the order on screen) and any
// marks already entered, so teachers can fill it in Excel and upload it.
export const downloadScoreSheet = (info: {
  className: string;
  subject: string;
  term: string;
  academicYear: string;
  rows: SheetRow[];
}) => {
  const wb = XLSX.utils.book_new();
  const data = [
    ["Index No.", "Student Name", "CA (30)", "Exam (70)"],
    ...info.rows.map((r) => [r.studentId, r.name, r.ca ?? "", r.exam ?? ""]),
  ];
  const sheet = XLSX.utils.aoa_to_sheet(data);
  sheet["!cols"] = [{ wch: 22 }, { wch: 34 }, { wch: 10 }, { wch: 11 }];
  XLSX.utils.book_append_sheet(wb, sheet, "Scores");
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["Class", info.className],
      ["Subject", info.subject],
      ["Term", info.term],
      ["Academic Year", info.academicYear],
      [],
      ["Fill in CA (0-30) and Exam (0-70). Leave a cell empty if not marked."],
      ["Do not change the Index No. column - it identifies each student."],
      ["Upload the file on the Score Entry page, check the marks, then Save."],
    ]),
    "Info",
  );
  XLSX.writeFile(
    wb,
    `${safeName(`${info.className} - ${info.subject} - ${info.term}`)}.xlsx`,
  );
};

export interface ParsedScores {
  rows: { studentId: string; ca: string; exam: string; rowNumber: number }[];
}

// Reads the first sheet that has Index No. + CA + Exam columns; the header
// may sit below a title row.
export const parseScoreSheet = async (file: File): Promise<ParsedScores> => {
  if (file.size > 2 * 1024 * 1024)
    throw new Error("The file is larger than 2 MB.");
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
    throw new Error("Choose an .xlsx, .xls or .csv file.");
  }
  const wb = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    dense: true,
  });
  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    if (!ws || !ws["!ref"]) continue;
    const firstRow = XLSX.utils.decode_range(ws["!ref"]).s.r;
    const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, {
      header: 1,
      defval: "",
      raw: true,
      blankrows: true,
    });
    for (let h = 0; h < Math.min(grid.length, 20); h++) {
      const heads = (grid[h] || []).map(norm);
      const idCol = heads.findIndex((x) => ID_HEADERS.includes(x));
      const caCol = heads.findIndex((x) => CA_HEADERS.includes(x));
      const exCol = heads.findIndex((x) => EXAM_HEADERS.includes(x));
      if (idCol < 0 || caCol < 0 || exCol < 0) continue;
      const rows: ParsedScores["rows"] = [];
      for (let r = h + 1; r < grid.length; r++) {
        const line = grid[r] || [];
        const studentId = String(line[idCol] ?? "").trim();
        if (!studentId) continue;
        rows.push({
          studentId,
          ca: String(line[caCol] ?? "").trim(),
          exam: String(line[exCol] ?? "").trim(),
          rowNumber: firstRow + r + 1,
        });
      }
      return { rows };
    }
  }
  throw new Error(
    "Could not find the columns Index No., CA and Exam. Download the class sheet to see the layout.",
  );
};
