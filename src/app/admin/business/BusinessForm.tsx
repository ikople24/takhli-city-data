"use client";
import React from "react";
import { upsertBusiness } from "./_actions";
import type { Business } from "@/types/database";

const CATEGORIES = ["ร้านค้า", "โรงงาน", "บริการ", "เกษตร", "อื่นๆ"];

export default function BusinessForm({
  item,
  onClose,
}: {
  item: Business | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => {
      await upsertBusiness(fd);
      onClose();
    }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขสถานประกอบการ" : "เพิ่มสถานประกอบการ"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อ</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภท</span></label>
            <select name="category" className="select select-bordered select-sm" defaultValue={item?.category ?? "อื่นๆ"}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">สถานะ</span></label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "active"}>
              <option value="active">ดำเนินการ</option>
              <option value="inactive">ปิดกิจการ</option>
            </select>
          </div>
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
            <label className="label"><span className="label-text text-xs">จำนวนพนักงาน</span></label>
            <input name="employees" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.employees ?? 0} />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">วันที่จดทะเบียน</span></label>
            <input name="registered_date" type="date" className="input input-bordered input-sm" defaultValue={item?.registered_date ?? ""} />
          </div>
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
