"use client";
import CrudTable from "@/components/admin/CrudTable";
import InfraForm from "./InfraForm";
import { deleteInfrastructure } from "./_actions";
import type { Infrastructure } from "@/types/database";

const statusColor: Record<string, string> = {
  ดี: "badge-success",
  ปานกลาง: "badge-warning",
  ต้องซ่อม: "badge-error",
};

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  {
    key: "type" as const,
    label: "ประเภท",
    render: (v: Infrastructure[keyof Infrastructure]) => (
      <span className="badge badge-outline badge-sm">{v as string}</span>
    ),
  },
  { key: "area_name" as const, label: "พื้นที่" },
  {
    key: "status" as const,
    label: "สภาพ",
    render: (v: Infrastructure[keyof Infrastructure]) => (
      <span className={`badge badge-sm ${statusColor[v as string] ?? ""}`}>{v as string}</span>
    ),
  },
  { key: "coverage_km" as const, label: "ระยะทาง (กม.)" },
];

export default function InfraTable({ data, role }: { data: Infrastructure[]; role: string }) {
  return (
    <CrudTable
      data={data}
      columns={columns}
      renderForm={(item, onClose) => <InfraForm item={item as Infrastructure | null} onClose={onClose} />}
      onDelete={deleteInfrastructure}
      addLabel="เพิ่มโครงสร้างพื้นฐาน"
      role={role}
    />
  );
}
