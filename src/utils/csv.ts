// Builds CSV that opens safely in Excel: every cell is quoted, and a cell
// starting with = + - @ (or a tab/CR) is prefixed with ' so the spreadsheet
// shows it as text instead of running it as a formula.
const cell = (value: unknown): string => {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export const toCsv = (rows: unknown[][]): string =>
  rows.map((r) => r.map(cell).join(",")).join("\r\n");

export const downloadCsv = (filename: string, rows: unknown[][]) => {
  // The BOM makes Excel read the file as UTF-8 (names with accents).
  const blob = new Blob(["﻿" + toCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
