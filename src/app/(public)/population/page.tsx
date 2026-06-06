import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import type { PopulationData } from "@/types/database";
import React from "react";

const columns: {
  key: keyof PopulationData;
  label: string;
  render?: (value: PopulationData[keyof PopulationData], row: PopulationData) => React.ReactNode;
}[] = [
  { key: "area_name", label: "พื้นที่" },
  {
    key: "total_population",
    label: "ประชากรรวม",
    render: (v) => (v as number)?.toLocaleString("th-TH"),
  },
  {
    key: "male",
    label: "ชาย",
    render: (v) => (v as number)?.toLocaleString("th-TH"),
  },
  {
    key: "female",
    label: "หญิง",
    render: (v) => (v as number)?.toLocaleString("th-TH"),
  },
  {
    key: "households",
    label: "ครัวเรือน",
    render: (v) => (v as number)?.toLocaleString("th-TH"),
  },
  { key: "year", label: "ปี" },
];

export default async function PopulationPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("population_data")
    .select("*")
    .order("area_name");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ข้อมูลประชากร</h1>
      <DataTable
        data={data ?? []}
        columns={columns}
        emptyMessage="ยังไม่มีข้อมูลประชากร"
      />
    </div>
  );
}
