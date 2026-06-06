import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#8758FF",
}: StatCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {typeof value === "number"
                ? value.toLocaleString("th-TH")
                : value}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: color + "20" }}
          >
            <Icon size={24} style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );
}
