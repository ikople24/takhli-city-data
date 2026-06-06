"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Zap,
  Heart,
  UserCog,
  Download,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/population", label: "ประชากร", icon: Users },
  { href: "/admin/business", label: "ธุรกิจ", icon: Building2 },
  { href: "/admin/infrastructure", label: "โครงสร้างพื้นฐาน", icon: Zap },
  { href: "/admin/services", label: "บริการสาธารณะ", icon: Heart },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: UserCog },
  { href: "/admin/export", label: "Export ข้อมูล", icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 min-h-screen flex flex-col py-6 px-3 shrink-0"
      style={{ background: "#181818" }}
    >
      <div className="flex items-center gap-2 px-3 mb-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: "#8758FF" }}
        >
          ต
        </div>
        <span className="text-white font-semibold text-sm">ระบบจัดการข้อมูล</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={active ? { background: "#8758FF" } : {}}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-white/10">
        <Link
          href="/"
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          ← กลับหน้าเว็บ
        </Link>
      </div>
    </aside>
  );
}
