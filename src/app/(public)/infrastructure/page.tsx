import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import type { Infrastructure } from "@/types/database";
import React from "react";

const statusColor: Record<string, string> = {
  ดี: "badge-success",
  ปานกลาง: "badge-warning",
  ต้องซ่อม: "badge-error",
};

const columns: {
  key: keyof Infrastructure;
  label: string;
  render?: (value: Infrastructure[keyof Infrastructure], row: Infrastructure) => React.ReactNode;
}[] = [
  { key: "name", label: "ชื่อ" },
  {
    key: "type",
    label: "ประเภท",
    render: (v) => (
      <span className="badge badge-outline badge-sm">{v as string}</span>
    ),
  },
  { key: "area_name", label: "พื้นที่" },
  {
    key: "status",
    label: "สภาพ",
    render: (v) => (
      <span className={`badge badge-sm ${statusColor[v as string] ?? ""}`}>
        {v as string}
      </span>
    ),
  },
  { key: "coverage_km", label: "ระยะทาง (กม.)" },
];

export default async function InfrastructurePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("infrastructure")
    .select("*")
    .order("type");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">โครงสร้างพื้นฐาน</h1>
      <DataTable
        data={data ?? []}
        columns={columns}
        emptyMessage="ยังไม่มีข้อมูลโครงสร้างพื้นฐาน"
      />
    </div>
  );
}
