import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { deleteBusiness } from "./_actions";
import BusinessForm from "./BusinessForm";
import type { Business } from "@/types/database";
import React from "react";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  {
    key: "category" as const,
    label: "ประเภท",
    render: (v: Business[keyof Business]) => (
      <span className="badge badge-outline badge-sm">{v as string}</span>
    ),
  },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "employees" as const, label: "พนักงาน" },
  {
    key: "status" as const,
    label: "สถานะ",
    render: (v: Business[keyof Business]) => (
      <span className={`badge badge-sm ${v === "active" ? "badge-success" : "badge-error"}`}>
        {v === "active" ? "ดำเนินการ" : "ปิด"}
      </span>
    ),
  },
];

export default async function BusinessAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("businesses").select("*").order("name");
  return (
    <div>
      <Topbar title="สถานประกอบการและธุรกิจ" />
      <div className="p-6">
        <CrudTable
          data={data ?? []}
          columns={columns}
          renderForm={(item, onClose) => <BusinessForm item={item as Business | null} onClose={onClose} />}
          onDelete={deleteBusiness}
          addLabel="เพิ่มสถานประกอบการ"
          role={profile?.role ?? "viewer"}
        />
      </div>
    </div>
  );
}
