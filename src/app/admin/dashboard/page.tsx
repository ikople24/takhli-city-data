import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import BarChart from "@/components/admin/charts/BarChart";
import PieChart from "@/components/admin/charts/PieChart";
import { Users, Building2, Zap, Heart } from "lucide-react";

function groupBy<T>(arr: T[], key: keyof T): Record<string, number> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}

function toChartData(record: Record<string, number>) {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [popData, bizData, infraData, svcData] = await Promise.all([
    supabase.from("population_data").select("area_name, total_population"),
    supabase.from("businesses").select("category"),
    supabase.from("infrastructure").select("status"),
    supabase.from("public_services").select("type"),
  ]);

  const popRows = popData.data ?? [];
  const bizRows = bizData.data ?? [];
  const infraRows = infraData.data ?? [];
  const svcRows = svcData.data ?? [];

  const totalPop = popRows.reduce((s, d) => s + (d.total_population ?? 0), 0);
  const popChart = popRows.map((d) => ({
    name: d.area_name,
    value: d.total_population ?? 0,
  }));
  const bizChart = toChartData(groupBy(bizRows, "category"));
  const infraChart = toChartData(groupBy(infraRows, "status"));
  const svcChart = toChartData(groupBy(svcRows, "type"));

  const stats = [
    { label: "ประชากรรวม", value: totalPop.toLocaleString("th-TH"), icon: Users, color: "#8758FF" },
    { label: "สถานประกอบการ", value: bizRows.length, icon: Building2, color: "#5CB8E4" },
    { label: "โครงสร้างพื้นฐาน", value: infraRows.length, icon: Zap, color: "#8758FF" },
    { label: "บริการสาธารณะ", value: svcRows.length, icon: Heart, color: "#5CB8E4" },
  ];

  return (
    <div>
      <Topbar title="ภาพรวมข้อมูล" />
      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-base-content/60">{s.label}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                  </div>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm mb-2">ประชากรรายพื้นที่</h2>
              <BarChart data={popChart} color="#8758FF" />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm mb-2">ธุรกิจตามประเภท</h2>
              <PieChart data={bizChart} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm mb-2">สภาพโครงสร้างพื้นฐาน</h2>
              <PieChart data={infraChart} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm mb-2">บริการสาธารณะตามประเภท</h2>
              <BarChart data={svcChart} color="#5CB8E4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
