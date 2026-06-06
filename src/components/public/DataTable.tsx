import React from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  emptyMessage = "ไม่มีข้อมูล",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-base-content/50">
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-base-300">
      <table className="table table-zebra">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="bg-base-200">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
