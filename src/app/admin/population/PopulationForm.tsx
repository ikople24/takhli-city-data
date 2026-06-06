"use client";
import React from "react";
import { upsertPopulation } from "./_actions";
import type { PopulationData } from "@/types/database";

const FIELDS = [
  ["total_population", "ประชากรรวม"],
  ["male", "ชาย"],
  ["female", "หญิง"],
  ["age_0_14", "อายุ 0-14"],
  ["age_15_59", "อายุ 15-59"],
  ["age_60_plus", "อายุ 60+"],
  ["households", "ครัวเรือน"],
  ["year", "ปี"],
] as const;

export default function PopulationForm({
  item,
  onClose,
}: {
  item: PopulationData | null;
  onClose: () => void;
}) {
  return (
    <form
      action={async (fd) => {
        await upsertPopulation(fd);
        onClose();
      }}
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลประชากร" : "เพิ่มข้อมูลประชากร"}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 form-control">
          <label className="label">
            <span className="label-text text-xs">พื้นที่ (ตำบล/หมู่บ้าน)</span>
          </label>
          <input
            name="area_name"
            className="input input-bordered input-sm"
            defaultValue={item?.area_name ?? ""}
            required
          />
        </div>
        {FIELDS.map(([name, label]) => (
          <div key={name} className="form-control">
            <label className="label">
              <span className="label-text text-xs">{label}</span>
            </label>
            <input
              name={name}
              type="number"
              min="0"
              className="input input-bordered input-sm"
              defaultValue={item ? String((item[name as keyof PopulationData] as unknown) ?? "") : ""}
              required
            />
          </div>
        ))}
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          ยกเลิก
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          บันทึก
        </button>
      </div>
    </form>
  );
}
