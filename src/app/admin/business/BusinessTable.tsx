"use client";
import CrudTable from "@/components/admin/CrudTable";
import BusinessForm from "./BusinessForm";
import { deleteBusiness } from "./_actions";
import type { Business } from "@/types/database";

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

export default function BusinessTable({ data, role }: { data: Business[]; role: string }) {
  return (
    <CrudTable
      data={data}
      columns={columns}
      renderForm={(item, onClose) => <BusinessForm item={item as Business | null} onClose={onClose} />}
      onDelete={deleteBusiness}
      addLabel="เพิ่มสถานประกอบการ"
      role={role}
    />
  );
}
