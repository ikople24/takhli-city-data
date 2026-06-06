import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { deletePopulation } from "./_actions";
import PopulationForm from "./PopulationForm";
import type { PopulationData } from "@/types/database";
import React from "react";

const columns = [
  { key: "area_name" as const, label: "พื้นที่" },
  {
    key: "total_population" as const,
    label: "ประชากรรวม",
    render: (v: PopulationData[keyof PopulationData]) =>
      (v as number)?.toLocaleString("th-TH"),
  },
  { key: "male" as const, label: "ชาย" },
  { key: "female" as const, label: "หญิง" },
  { key: "households" as const, label: "ครัวเรือน" },
  { key: "year" as const, label: "ปี" },
];

export default async function PopulationAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const { data } = await supabase
    .from("population_data")
    .select("*")
    .order("area_name");

  return (
    <div>
      <Topbar title="ข้อมูลประชากร" />
      <div className="p-6">
        <CrudTable
          data={data ?? []}
          columns={columns}
          renderForm={(item, onClose) => (
            <PopulationForm
              item={item as PopulationData | null}
              onClose={onClose}
            />
          )}
          onDelete={deletePopulation}
          addLabel="เพิ่มข้อมูลประชากร"
          role={profile?.role ?? "viewer"}
        />
      </div>
    </div>
  );
}
