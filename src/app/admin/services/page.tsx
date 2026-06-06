import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { deleteService } from "./_actions";
import ServiceForm from "./ServiceForm";
import type { PublicService } from "@/types/database";
import React from "react";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท", render: (v: PublicService[keyof PublicService]) => <span className="badge badge-outline badge-sm">{v as string}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "phone" as const, label: "โทรศัพท์" },
  { key: "capacity" as const, label: "ความจุ" },
];

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("public_services").select("*").order("name");
  return (
    <div>
      <Topbar title="บริการสาธารณะ" />
      <div className="p-6">
        <CrudTable
          data={data ?? []}
          columns={columns}
          renderForm={(item, onClose) => <ServiceForm item={item as PublicService | null} onClose={onClose} />}
          onDelete={deleteService}
          addLabel="เพิ่มบริการสาธารณะ"
          role={profile?.role ?? "viewer"}
        />
      </div>
    </div>
  );
}
