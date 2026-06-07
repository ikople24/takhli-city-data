"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { exportToExcel, exportToCSV } from "@/lib/utils/export";
import { Download } from "lucide-react";

type TableKey = "population_data" | "businesses" | "infrastructure" | "public_services";

const tables: { key: TableKey; label: string }[] = [
  { key: "population_data", label: "ข้อมูลประชากร" },
  { key: "businesses", label: "สถานประกอบการ" },
  { key: "infrastructure", label: "โครงสร้างพื้นฐาน" },
  { key: "public_services", label: "บริการสาธารณะ" },
];

export default function ExportClient() {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  async function handleExport(tableKey: TableKey, label: string, format: "xlsx" | "csv") {
    const loadingKey = `${tableKey}-${format}`;
    setLoading(loadingKey);
    try {
      const { data } = await supabase.from(tableKey).select("*");
      if (data && data.length > 0) {
        const dateStr = new Date().toLocaleDateString("th-TH").replace(/\//g, "-");
        const filename = `${label}-${dateStr}`;
        if (format === "xlsx") {
          exportToExcel(data as Record<string, unknown>[], filename);
        } else {
          exportToCSV(data as Record<string, unknown>[], filename);
        }
      } else {
        alert("ไม่มีข้อมูลสำหรับ export");
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6">
      <p className="text-sm text-base-content/60 mb-6">
        ดาวน์โหลดข้อมูลทุกหมวดในรูปแบบ Excel หรือ CSV
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tables.map((t) => (
          <div key={t.key} className="card bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <h2 className="card-title text-base mb-3">{t.label}</h2>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm gap-1 flex-1"
                  onClick={() => handleExport(t.key, t.label, "xlsx")}
                  disabled={loading !== null}
                >
                  {loading === `${t.key}-xlsx` ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Download size={12} />
                  )}
                  Excel
                </button>
                <button
                  className="btn btn-outline btn-sm gap-1 flex-1"
                  onClick={() => handleExport(t.key, t.label, "csv")}
                  disabled={loading !== null}
                >
                  {loading === `${t.key}-csv` ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Download size={12} />
                  )}
                  CSV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
