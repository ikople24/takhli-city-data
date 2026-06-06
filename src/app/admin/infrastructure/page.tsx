import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { deleteInfrastructure } from "./_actions";
import InfraForm from "./InfraForm";
import type { Infrastructure } from "@/types/database";
import React from "react";

const statusColor: Record<string, string> = { ดี: "badge-success", ปานกลาง: "badge-warning", ต้องซ่อม: "badge-error" };

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท", render: (v: Infrastructure[keyof Infrastructure]) => <span className="badge badge-outline badge-sm">{v as string}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "status" as const, label: "สภาพ", render: (v: Infrastructure[keyof Infrastructure]) => <span className={`badge badge-sm ${statusColor[v as string] ?? ""}`}>{v as string}</span> },
  { key: "coverage_km" as const, label: "ระยะทาง (กม.)" },
];

export default async function InfrastructureAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("infrastructure").select("*").order("name");
  return (
    <div>
      <Topbar title="โครงสร้างพื้นฐาน" />
      <div className="p-6">
        <CrudTable
          data={data ?? []}
          columns={columns}
          renderForm={(item, onClose) => <InfraForm item={item as Infrastructure | null} onClose={onClose} />}
          onDelete={deleteInfrastructure}
          addLabel="เพิ่มโครงสร้างพื้นฐาน"
          role={profile?.role ?? "viewer"}
        />
      </div>
    </div>
  );
}
