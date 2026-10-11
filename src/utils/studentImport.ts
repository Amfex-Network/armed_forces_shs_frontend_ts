import * as XLSX from "xlsx";

export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 5000;

const norm = (h: unknown) =>
  String(h ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Column headings people actually use, mapped to the API field names. The
// system's own CSV export uses the friendly names, so exports re-import.
const ALIASES: Record<string, string[]> = {
  studentId: [
    "studentid",
    "id",
    "studentno",
    "studentnumber",
    "indexno",
    "indexnumber",
    "admissionno",
    "admissionnumber",
  ],
  firstName: ["firstname", "first", "givenname", "forename"],
  lastName: ["lastname", "last", "surname", "familyname"],
  gender: ["gender", "sex"],
  email: ["email", "emailaddress", "mail"],
  year: ["year", "enrolmentyear", "enrollmentyear", "yearofadmission"],
  yearGroup: ["yeargroup", "form", "level"],
  formClass: ["formclass", "class", "classname", "stream"],
  course: ["course", "program", "programme"],
  track: ["transition", "track"],
  status: ["status"],
  house: ["house"],
  dob: ["dob", "dateofbirth", "birthdate"],
  address: ["address", "residence"],
};

const LOOKUP = new Map<string, string>();
Object.entries(ALIASES).forEach(([field, names]) =>
  names.forEach((n) => LOOKUP.set(n, field)),
);

const REQUIRED = ["studentId", "firstName", "lastName"];

export interface ParsedImport {
  rows: Record<string, string>[];
  sheetName: string;
  headerRow: number;
  ignoredColumns: string[];
}

const mapHeaders = (cells: unknown[]) => {
  const fields: (string | null)[] = cells.map(
    (c) => LOOKUP.get(norm(c)) || null,
  );
  const found = new Set(fields.filter(Boolean));
  return { fields, ok: REQUIRED.every((f) => found.has(f)) };
};

// Reads the first sheet that has a recognisable header row (it may sit
// below a title or blank rows) and returns rows keyed by API field.
export const parseStudentFile = async (file: File): Promise<ParsedImport> => {
  if (file.size > MAX_IMPORT_BYTES) {
    throw new Error(
      "The file is larger than 5 MB. Split it and import the parts.",
    );
  }
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
    throw new Error("Choose an .xlsx, .xls or .csv file.");
  }
  const wb = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    cellDates: true,
    dense: true,
  });

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet || !sheet["!ref"]) continue;
    // Blank rows are kept so indexes line up with the sheet's row numbers.
    const firstRow = XLSX.utils.decode_range(sheet["!ref"]).s.r;
    const grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
      blankrows: true,
    });
    const scanTo = Math.min(grid.length, 20);
    for (let h = 0; h < scanTo; h++) {
      const { fields, ok } = mapHeaders(grid[h] || []);
      if (!ok) continue;
      const ignoredColumns = (grid[h] || [])
        .filter((c, i) => String(c).trim() && !fields[i])
        .map(String);
      const rows: Record<string, string>[] = [];
      for (let r = h + 1; r < grid.length; r++) {
        const line = grid[r] || [];
        const row: Record<string, string> = {};
        fields.forEach((field, i) => {
          if (!field) return;
          const v = String(line[i] ?? "").trim();
          if (v && !row[field]) row[field] = v;
        });
        if (Object.keys(row).length === 0) continue;
        row.rowNumber = String(firstRow + r + 1);
        rows.push(row);
      }
      if (rows.length > MAX_IMPORT_ROWS) {
        throw new Error(
          `The file has ${rows.length} rows; import at most ${MAX_IMPORT_ROWS} at a time.`,
        );
      }
      return { rows, sheetName, headerRow: firstRow + h + 1, ignoredColumns };
    }
  }
  throw new Error(
    "Could not find the column headings. The sheet needs columns for Student ID, First Name and Last Name (download the template to see the layout).",
  );
};
