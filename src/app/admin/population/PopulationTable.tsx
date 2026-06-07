"use client";
import CrudTable from "@/components/admin/CrudTable";
import PopulationForm from "./PopulationForm";
import { deletePopulation } from "./_actions";
import type { PopulationData } from "@/types/database";

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

export default function PopulationTable({ data, role }: { data: PopulationData[]; role: string }) {
  return (
    <CrudTable
      data={data}
      columns={columns}
      renderForm={(item, onClose) => (
        <PopulationForm item={item as PopulationData | null} onClose={onClose} />
      )}
      onDelete={deletePopulation}
      addLabel="เพิ่มข้อมูลประชากร"
      role={role}
    />
  );
}
