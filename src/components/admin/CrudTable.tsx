"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import React from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface CrudTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  renderForm: (item: T | null, onClose: () => void) => React.ReactNode;
  onDelete: (id: string) => Promise<void>;
  addLabel?: string;
  role: string;
}

export default function CrudTable<T extends { id: string }>({
  data,
  columns,
  renderForm,
  onDelete,
  addLabel = "เพิ่มรายการ",
  role,
}: CrudTableProps<T>) {
  const router = useRouter();
  // undefined = modal closed, null = adding new, T = editing existing
  const [editing, setEditing] = useState<T | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canEdit = role === "editor" || role === "super_admin";
  const canDelete = role === "super_admin";

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await onDelete(id);
      router.refresh();
      setDeleting(null);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      {canEdit && (
        <button
          className="btn btn-primary btn-sm mb-4 gap-1"
          onClick={() => setEditing(null)}
        >
          <Plus size={14} />
          {addLabel}
        </button>
      )}

      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table table-zebra">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="bg-base-200">
                  {col.label}
                </th>
              ))}
              {canEdit && <th className="bg-base-200 w-20">จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (canEdit ? 1 : 0)}
                  className="text-center py-8 text-base-content/50"
                >
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "-")}
                  </td>
                ))}
                {canEdit && (
                  <td>
                    <div className="flex gap-1">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditing(row)}
                        title="แก้ไข"
                      >
                        <Pencil size={12} />
                      </button>
                      {canDelete && (
                        <button
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeleting(row.id)}
                          title="ลบ"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {editing !== undefined && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            {renderForm(editing, () => setEditing(undefined))}
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setEditing(undefined)}
          />
        </dialog>
      )}

      {/* Delete Confirm Modal */}
      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ยืนยันการลบ</h3>
            <p className="py-4">
              คุณต้องการลบรายการนี้ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            {deleteError && (
              <div className="alert alert-error alert-sm text-sm py-2">{deleteError}</div>
            )}
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleting(null)}
                disabled={deleteLoading}
              >
                ยกเลิก
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDelete(deleting)}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "ลบ"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => !deleteLoading && setDeleting(null)}
          />
        </dialog>
      )}
    </div>
  );
}
