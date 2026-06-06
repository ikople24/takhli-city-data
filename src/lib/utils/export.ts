import * as XLSX from "xlsx";

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ข้อมูล");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data
    .map((r) => Object.values(r).map((v) => `"${String(v ?? "")}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + headers + "\n" + rows], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
