import Link from "next/link";
import { MapPin } from "lucide-react";

const navLinks = [
  { href: "/population", label: "ประชากร" },
  { href: "/business", label: "ธุรกิจ" },
  { href: "/infrastructure", label: "โครงสร้างพื้นฐาน" },
  { href: "/services", label: "บริการสาธารณะ" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8758FF, #5CB8E4)" }}
          >
            ต
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-sm">ฐานข้อมูลกลางเมืองตาคลี</p>
            <p className="flex items-center gap-1 text-[10px] text-base-content/45 font-normal mt-0.5">
              <MapPin size={9} />
              จังหวัดนครสวรรค์
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm text-base-content/65 hover:text-primary hover:bg-primary/8 transition-all font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/auth/login"
            className="btn btn-sm text-white rounded-lg px-4 font-medium text-sm border-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #8758FF, #6B8FFF)" }}
          >
            เข้าสู่ระบบ
          </Link>

          {/* Mobile menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="เมนู"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <ul className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl border border-base-200 w-52 z-50 mt-2 p-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rounded-lg text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
