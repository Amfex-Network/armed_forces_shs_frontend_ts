import * as XLSX from "xlsx";

const norm = (h: unknown) =>
  String(h ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export interface ColumnSpec {
  field: string;
  header: string;
  aliases: string[];
  required?: boolean;
}

export const TEACHER_COLUMNS: ColumnSpec[] = [
  { field: "title", header: "Title", aliases: ["title"] },
  {
    field: "firstName",
    header: "First Name",
    aliases: ["firstname", "first", "givenname", "othernames"],
    required: true,
  },
  {
    field: "lastName",
    header: "Last Name",
    aliases: ["lastname", "surname", "last", "familyname"],
    required: true,
  },
  {
    field: "email",
    header: "Email",
    aliases: ["email", "emailaddress"],
    required: true,
  },
  {
    field: "phone",
    header: "Phone",
    aliases: ["phone", "phonenumber", "mobile", "contact"],
  },
  {
    field: "staffId",
    header: "Staff ID",
    aliases: ["staffid", "staffno", "staffnumber", "id"],
  },
  {
    field: "department",
    header: "Department",
    aliases: ["department", "dept"],
  },
  {
    field: "teacherRole",
    header: "Role",
    aliases: ["role", "teacherrole", "position"],
  },
  {
    field: "formClasses",
    header: "Form Teacher Of",
    aliases: ["formteacherof", "formclasses", "formclass", "formteacher"],
  },
  {
    field: "assignedClasses",
    header: "Classes Taught",
    aliases: ["classestaught", "classes", "assignedclasses"],
  },
  {
    field: "assignedSubjects",
    header: "Subjects Taught",
    aliases: ["subjectstaught", "subjects", "assignedsubjects"],
  },
];

export const PARENT_COLUMNS: ColumnSpec[] = [
  { field: "title", header: "Title", aliases: ["title"] },
  {
    field: "firstName",
    header: "First Name",
    aliases: ["firstname", "first", "givenname", "othernames"],
    required: true,
  },
  {
    field: "lastName",
    header: "Last Name",
    aliases: ["lastname", "surname", "last", "familyname"],
    required: true,
  },
  {
    field: "email",
    header: "Email",
    aliases: ["email", "emailaddress"],
    required: true,
  },
  {
    field: "phone",
    header: "Phone",
    aliases: ["phone", "phonenumber", "mobile", "contact"],
  },
  {
    field: "children",
    header: "Children (Index Nos.)",
    aliases: [
      "childrenindexnos",
      "children",
      "childindexno",
      "wards",
      "studentids",
      "indexnos",
    ],
  },
];

export const MAX_SHEET_BYTES = 2 * 1024 * 1024;
export const MAX_SHEET_ROWS = 2000;

// Finds the header row (it may sit under a title) on the first sheet that
// has every required column, and returns rows keyed by field.
export const parsePeopleSheet = async (
  file: File,
  columns: ColumnSpec[],
): Promise<Record<string, string>[]> => {
  if (file.size > MAX_SHEET_BYTES)
    throw new Error("The file is larger than 2 MB.");
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
    throw new Error("Choose an .xlsx, .xls or .csv file.");
  }
  const lookup = new Map<string, string>();
  columns.forEach((c) => c.aliases.forEach((a) => lookup.set(a, c.field)));
  const required = columns.filter((c) => c.required).map((c) => c.field);

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
      raw: false,
      blankrows: true,
    });
    for (let h = 0; h < Math.min(grid.length, 20); h++) {
      const fields = (grid[h] || []).map((c) => lookup.get(norm(c)) || null);
      if (!required.every((f) => fields.includes(f))) continue;
      const rows: Record<string, string>[] = [];
      for (let r = h + 1; r < grid.length; r++) {
        const line = grid[r] || [];
        const row: Record<string, string> = {};
        fields.forEach((f, i) => {
          if (!f) return;
          const v = String(line[i] ?? "").trim();
          if (v && !row[f]) row[f] = v;
        });
        if (Object.keys(row).length === 0) continue;
        row.rowNumber = String(firstRow + r + 1);
        rows.push(row);
      }
      if (rows.length > MAX_SHEET_ROWS) {
        throw new Error(`Import at most ${MAX_SHEET_ROWS} rows at a time.`);
      }
      return rows;
    }
  }
  throw new Error(
    `Could not find the column headings (${columns
      .filter((c) => c.required)
      .map((c) => c.header)
      .join(", ")}). Download the template to see the layout.`,
  );
};

const sheetOf = (rows: unknown[][], widths?: number[]) => {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  if (widths) ws["!cols"] = widths.map((wch) => ({ wch }));
  return ws;
};

export const downloadPeopleTemplate = (
  filename: string,
  columns: ColumnSpec[],
  examples: string[][],
  guide: string[],
) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    sheetOf(
      [columns.map((c) => c.header), ...examples],
      columns.map((c) => Math.max(14, c.header.length + 4)),
    ),
    "Data",
  );
  XLSX.utils.book_append_sheet(
    wb,
    sheetOf(
      guide.map((g) => [g]),
      [100],
    ),
    "Guide",
  );
  XLSX.writeFile(wb, filename);
};

export const downloadPeopleExport = (
  filename: string,
  columns: ColumnSpec[],
  rows: Record<string, unknown>[],
) => {
  const wb = XLSX.utils.book_new();
  const data = [
    columns.map((c) => c.header),
    ...rows.map((r) =>
      columns.map((c) => {
        const v = r[c.field];
        return Array.isArray(v)
          ? v.join("; ")
          : v === undefined || v === null
            ? ""
            : String(v);
      }),
    ),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    sheetOf(
      data,
      columns.map((c) => Math.max(14, c.header.length + 4)),
    ),
    "Data",
  );
  XLSX.writeFile(wb, filename);
};

// The one-time passwords exist only in this file and on screen; the admin
// hands them out and should delete the file afterwards.
export const downloadCredentialSheet = (
  filename: string,
  header: string[],
  rows: unknown[][],
) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    sheetOf(
      [header, ...rows],
      header.map(() => 24),
    ),
    "Logins",
  );
  XLSX.utils.book_append_sheet(
    wb,
    sheetOf(
      [
        ["CONFIDENTIAL - one-time passwords"],
        ["Give each person only their own password, in person or privately."],
        [
          "Each password works once: the person must choose a new one at first sign-in.",
        ],
        ["Delete this file once the passwords have been handed out."],
      ],
      [90],
    ),
    "Read me",
  );
  XLSX.writeFile(wb, filename);
};

// Sends rows in small batches (passwords are hashed on the server, which
// takes a moment per account) and merges the results.
export const inBatches = async <
  T,
  R extends { created: unknown[]; skipped: unknown[] },
>(
  rows: T[],
  size: number,
  send: (batch: T[]) => Promise<R>,
  onProgress?: (done: number, total: number) => void,
) => {
  const created: R["created"][number][] = [];
  const skipped: R["skipped"][number][] = [];
  for (let i = 0; i < rows.length; i += size) {
    onProgress?.(Math.min(i + size, rows.length), rows.length);
    const res = await send(rows.slice(i, i + size));
    created.push(...res.created);
    skipped.push(...res.skipped);
  }
  return { created, skipped };
};
