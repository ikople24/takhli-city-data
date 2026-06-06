import Link from "next/link";

const navLinks = [
  { href: "/population", label: "ประชากร" },
  { href: "/business", label: "ธุรกิจ" },
  { href: "/infrastructure", label: "โครงสร้างพื้นฐาน" },
  { href: "/services", label: "บริการสาธารณะ" },
];

export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 shadow-sm px-4 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "#8758FF" }}
          >
            ต
          </div>
          <span className="font-semibold text-sm hidden sm:block">
            ฐานข้อมูลกลางเมืองตาคลี
          </span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-lg text-sm">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/auth/login" className="btn btn-primary btn-sm">
          เข้าสู่ระบบ
        </Link>
        <div className="dropdown dropdown-end lg:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-sm">
            ☰
          </button>
          <ul className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-48 z-50 mt-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
