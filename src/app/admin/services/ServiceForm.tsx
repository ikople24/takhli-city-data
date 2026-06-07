"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertService } from "./_actions";
import type { PublicService } from "@/types/database";

const SERVICE_TYPES = ["โรงพยาบาล", "โรงเรียน", "วัด", "สถานีตำรวจ", "อื่นๆ"];

export default function ServiceForm({ item, onClose }: { item: PublicService | null; onClose: () => void }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <form action={async (fd) => {
      setError(null);
      setLoading(true);
      try {
        await upsertService(fd);
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        setLoading(false);
      }
    }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">{item ? "แก้ไขบริการสาธารณะ" : "เพิ่มบริการสาธารณะ"}</h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อ</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ประเภท</span></label>
          <select name="type" className="select select-bordered select-sm" defaultValue={item?.type ?? "อื่นๆ"}>
            {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">พื้นที่</span></label>
          <input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ที่อยู่</span></label>
          <input name="address" className="input input-bordered input-sm" defaultValue={item?.address ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">โทรศัพท์</span></label>
            <input name="phone" className="input input-bordered input-sm" defaultValue={item?.phone ?? ""} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ความจุ</span></label>
            <input name="capacity" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.capacity ?? 0} />
          </div>
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
