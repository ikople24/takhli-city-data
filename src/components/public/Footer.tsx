import Link from "next/link";
import { MapPin } from "lucide-react";

const dataLinks = [
  { href: "/population", label: "ข้อมูลประชากร" },
  { href: "/business", label: "สถานประกอบการ" },
  { href: "/infrastructure", label: "โครงสร้างพื้นฐาน" },
  { href: "/services", label: "บริการสาธารณะ" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0E0E0E" }} className="text-white/60">
      {/* Top accent */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #8758FF60, #5CB8E460, transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #8758FF, #5CB8E4)" }}
            >
              ต
            </div>
            <div>
              <p className="font-semibold text-white text-sm leading-snug">
                ฐานข้อมูลกลางเมืองตาคลี
              </p>
              <p className="text-xs text-white/35">เทศบาลเมืองตาคลี</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            ระบบรวบรวมและเผยแพร่ข้อมูลสำคัญ
            <br />
            ของเทศบาลเมืองตาคลี จังหวัดนครสวรรค์
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white font-semibold text-sm mb-4">หมวดหมู่ข้อมูล</p>
          <ul className="space-y-2.5">
            {dataLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm hover:text-white transition-colors hover:underline underline-offset-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-semibold text-sm mb-4">ติดต่อ</p>
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "#8758FF" }} />
            <span className="leading-relaxed">
              เทศบาลเมืองตาคลี ถ.ตาคลี-ท่าตะโก
              <br />
              ต.ตาคลี อ.ตาคลี จ.นครสวรรค์ 60140
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 py-4">
        <p className="text-center text-xs text-white/25">
          © 2024 เทศบาลเมืองตาคลี จังหวัดนครสวรรค์ · สงวนลิขสิทธิ์
        </p>
      </div>
    </footer>
  );
}
