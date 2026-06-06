import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  color?: string;
  breadcrumb?: string;
}

export default function PageHero({
  title,
  description,
  icon: Icon,
  color = "#8758FF",
  breadcrumb = "ข้อมูล",
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-base-200">
      <div className="absolute inset-0 hero-dots opacity-25" />
      <div
        className="absolute right-0 top-0 h-full w-2/3 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 80% at 100% 50%, ${color}12, transparent 70%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-8 py-10 lg:py-12 flex items-center gap-5 fade-up">
        {Icon && (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 hidden sm:flex"
            style={{ background: color + "15" }}
          >
            <Icon size={28} style={{ color }} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-xs text-base-content/40 hover:text-base-content/70 transition-colors">
              หน้าแรก
            </Link>
            <span className="text-base-content/25 text-xs">›</span>
            <span className="text-xs text-base-content/40">{breadcrumb}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          {description && (
            <p className="text-base-content/55 mt-1.5 text-sm">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
