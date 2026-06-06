import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import type { PublicService } from "@/types/database";
import React from "react";

const columns: {
  key: keyof PublicService;
  label: string;
  render?: (value: PublicService[keyof PublicService], row: PublicService) => React.ReactNode;
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
  { key: "phone", label: "โทรศัพท์" },
  { key: "capacity", label: "ความจุ" },
];

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_services")
    .select("*")
    .order("type");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">บริการสาธารณะ</h1>
      <DataTable
        data={data ?? []}
        columns={columns}
        emptyMessage="ยังไม่มีข้อมูลบริการสาธารณะ"
      />
    </div>
  );
}
