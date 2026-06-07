"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertInfrastructure } from "./_actions";
import type { Infrastructure } from "@/types/database";

const TYPES = ["ถนน", "ไฟฟ้า", "ประปา", "อินเทอร์เน็ต", "อื่นๆ"];
const STATUSES = ["ดี", "ปานกลาง", "ต้องซ่อม"];

export default function InfraForm({ item, onClose }: { item: Infrastructure | null; onClose: () => void }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <form action={async (fd) => {
      setError(null);
      setLoading(true);
      try {
        await upsertInfrastructure(fd);
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        setLoading(false);
      }
    }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">{item ? "แก้ไขโครงสร้างพื้นฐาน" : "เพิ่มโครงสร้างพื้นฐาน"}</h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อ</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภท</span></label>
            <select name="type" className="select select-bordered select-sm" defaultValue={item?.type ?? "อื่นๆ"}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">สภาพ</span></label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "ดี"}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">พื้นที่</span></label>
          <input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">คำอธิบาย</span></label>
          <input name="description" className="input input-bordered input-sm" defaultValue={item?.description ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ระยะทาง (กม.)</span></label>
          <input name="coverage_km" type="number" min="0" step="0.1" className="input input-bordered input-sm" defaultValue={item?.coverage_km ?? 0} />
        </div>
      </div>
      {error && <div className="alert alert-error text-sm py-2 mt-3">{error}</div>}
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={loading}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-xs" /> : "บันทึก"}
        </button>
      </div>
    </form>
  );
}
