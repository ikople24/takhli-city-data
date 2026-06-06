import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import type { Business } from "@/types/database";
import React from "react";

const columns: {
  key: keyof Business;
  label: string;
  render?: (value: Business[keyof Business], row: Business) => React.ReactNode;
}[] = [
  { key: "name", label: "ชื่อสถานประกอบการ" },
  {
    key: "category",
    label: "ประเภท",
    render: (v) => (
      <span className="badge badge-outline badge-sm">{v as string}</span>
    ),
  },
  { key: "area_name", label: "พื้นที่" },
  { key: "employees", label: "พนักงาน" },
  {
    key: "status",
    label: "สถานะ",
    render: (v) => (
      <span
        className={`badge badge-sm ${
          v === "active" ? "badge-success" : "badge-error"
        }`}
      >
        {v === "active" ? "ดำเนินการ" : "ปิดกิจการ"}
      </span>
    ),
  },
];

export default async function BusinessPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .order("name");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">สถานประกอบการและธุรกิจ</h1>
      <DataTable
        data={data ?? []}
        columns={columns}
        emptyMessage="ยังไม่มีข้อมูลสถานประกอบการ"
      />
    </div>
  );
}
