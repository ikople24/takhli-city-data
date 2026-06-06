import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  delay?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#8758FF",
  delay = "0s",
}: StatCardProps) {
  return (
    <div
      className="relative bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:-translate-y-1 fade-up"
      style={{ animationDelay: delay }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.75 rounded-l-2xl"
        style={{ background: color }}
      />

      {/* Subtle glow blob */}
      <div
        className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: color + "30" }}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-base-content/45 uppercase tracking-widest mb-2 truncate">
              {title}
            </p>
            <p
              className="text-2xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {typeof value === "number"
                ? value.toLocaleString("th-TH")
                : value}
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: color + "18" }}
          >
            <Icon size={22} style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );
}
