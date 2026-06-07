"use client";
import CrudTable from "@/components/admin/CrudTable";
import ServiceForm from "./ServiceForm";
import { deleteService } from "./_actions";
import type { PublicService } from "@/types/database";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  {
    key: "type" as const,
    label: "ประเภท",
    render: (v: PublicService[keyof PublicService]) => (
      <span className="badge badge-outline badge-sm">{v as string}</span>
    ),
  },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "phone" as const, label: "โทรศัพท์" },
  { key: "capacity" as const, label: "ความจุ" },
];

export default function ServiceTable({ data, role }: { data: PublicService[]; role: string }) {
  return (
    <CrudTable
      data={data}
      columns={columns}
      renderForm={(item, onClose) => <ServiceForm item={item as PublicService | null} onClose={onClose} />}
      onDelete={deleteService}
      addLabel="เพิ่มบริการสาธารณะ"
      role={role}
    />
  );
}
