import { createClient } from "@/lib/supabase/server";
import {
  Users, Building2, Zap, Heart, MapPin, ArrowUpRight,
  MessageSquare, Bell, ShoppingBag, Activity, Phone,
  Banknote, FileText, Database, ClipboardList,
  Map, Cpu, Shield,
} from "lucide-react";
import StatCard from "@/components/public/StatCard";
import Link from "next/link";

/* ─── Data: existing public data categories ─── */
const dataCategories = [
  {
    href: "/population",
    label: "ข้อมูลประชากร",
    desc: "จำนวนประชากร ครัวเรือน และการกระจายตัวในแต่ละตำบล",
    color: "#8758FF",
    icon: Users,
  },
  {
    href: "/business",
    label: "สถานประกอบการ",
    desc: "ร้านค้า โรงงาน และธุรกิจทุกประเภทในพื้นที่ตาคลี",
    color: "#5CB8E4",
    icon: Building2,
  },
  {
    href: "/infrastructure",
    label: "โครงสร้างพื้นฐาน",
    desc: "ถนน ระบบไฟฟ้า ประปา และอินเทอร์เน็ตชุมชน",
    color: "#8758FF",
    icon: Zap,
  },
  {
    href: "/services",
    label: "บริการสาธารณะ",
    desc: "โรงพยาบาล โรงเรียน วัด และสถานีตำรวจ",
    color: "#5CB8E4",
    icon: Heart,
  },
];

/* ─── Data: citizen services (from skills) ─── */
const citizenServices = [
  {
    icon: MessageSquare,
    label: "ยื่นเรื่องร้องเรียน",
    desc: "ร้องเรียนปัญหาในพื้นที่ผ่านระบบออนไลน์",
    color: "#8758FF",
    soon: true,
  },
  {
    icon: Bell,
    label: "ข่าวสารและประกาศ",
    desc: "ประกาศและข่าวสารล่าสุดจากเทศบาล",
    color: "#5CB8E4",
    soon: true,
  },
  {
    icon: ShoppingBag,
    label: "สินค้า OTOP ตาคลี",
    desc: "ผลิตภัณฑ์ชุมชนและสินค้าท้องถิ่น",
    color: "#8758FF",
    soon: true,
  },
  {
    icon: Heart,
    label: "สวัสดิการประชาชน",
    desc: "โครงการช่วยเหลือและสวัสดิการต่าง ๆ",
    color: "#5CB8E4",
    soon: true,
  },
  {
    icon: Activity,
    label: "รณรงค์สาธารณสุข",
    desc: "ข้อมูลสุขภาพและกิจกรรมรณรงค์",
    color: "#8758FF",
    soon: true,
  },
  {
    icon: Phone,
    label: "ติดต่อเทศบาล",
    desc: "ช่องทางติดต่อและที่อยู่สำนักงาน",
    color: "#5CB8E4",
    soon: false,
  },
];

/* ─── Data: governance & transparency (from skills) ─── */
const governanceItems = [
  {
    icon: Banknote,
    label: "งบประมาณโปร่งใส",
    desc: "รายรับ-รายจ่ายและงบประมาณประจำปีของเทศบาล",
    color: "#8758FF",
  },
  {
    icon: FileText,
    label: "รายงานประจำปี",
    desc: "ผลการดำเนินงานและแผนพัฒนาท้องถิ่น",
    color: "#5CB8E4",
  },
  {
    icon: Database,
    label: "Open Data",
    desc: "ชุดข้อมูลเปิดตามมาตรฐาน DCAT สำหรับนักพัฒนา",
    color: "#8758FF",
  },
  {
    icon: ClipboardList,
    label: "จัดซื้อจัดจ้าง",
    desc: "ประกาศและผลการจัดซื้อจัดจ้างตาม พ.ร.บ. 2560",
    color: "#5CB8E4",
  },
];

/* ─── Data: smart city (from skills) ─── */
const smartItems = [
  {
    icon: Map,
    label: "GIS แผนที่ชุมชน",
    desc: "ข้อมูลเชิงพื้นที่และแผนที่โครงสร้างพื้นฐาน",
    color: "#8758FF",
  },
  {
    icon: Cpu,
    label: "Smart Infrastructure",
    desc: "ระบบ Smart Lighting, CCTV และ Environmental Sensor",
    color: "#5CB8E4",
  },
  {
    icon: Shield,
    label: "PDPA & ความปลอดภัย",
    desc: "นโยบายคุ้มครองข้อมูลส่วนบุคคลของประชาชน",
    color: "#8758FF",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const popResult = await supabase.from("population_data").select("*");
  const [bizResult, infraResult, svcResult] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("infrastructure").select("id", { count: "exact", head: true }),
    supabase.from("public_services").select("id", { count: "exact", head: true }),
  ]);

  const totalPop =
    popResult.data?.reduce((s, d) => s + (d.total_population ?? 0), 0) ?? 0;

  return (
    <div>
      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-dots opacity-50" />
        <div
          className="absolute -top-40 -right-40 w-125 h-125 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8758FF, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #5CB8E4, transparent 70%)" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 py-20 lg:py-28 text-center">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 fade-up"
            style={{
              background: "rgba(135, 88, 255, 0.1)",
              color: "#8758FF",
              border: "1px solid rgba(135, 88, 255, 0.25)",
            }}
          >
            <MapPin size={11} />
            เทศบาลเมืองตาคลี จังหวัดนครสวรรค์
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight tracking-tight fade-up-1">
            ฐานข้อมูลกลาง
            <br />
            <span className="gradient-text">เมืองตาคลี</span>
          </h1>

          <p className="text-base-content/55 max-w-md mx-auto text-base lg:text-lg leading-relaxed fade-up-2">
            ระบบรวบรวมและเผยแพร่ข้อมูลสำคัญของเทศบาล
            <br className="hidden sm:block" />
            เพื่อการวางแผนและพัฒนาชุมชน
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 fade-up-3">
            <Link
              href="/population"
              className="btn btn-sm text-white rounded-full px-6 font-medium border-0"
              style={{ background: "linear-gradient(135deg, #8758FF, #5CB8E4)" }}
            >
              เริ่มดูข้อมูล
            </Link>
            <Link href="/auth/login" className="btn btn-sm btn-ghost rounded-full px-5 font-medium">
              สำหรับเจ้าหน้าที่
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 -mt-4 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ประชากรทั้งหมด"   value={totalPop}              icon={Users}     color="#8758FF" delay="0.4s" />
        <StatCard title="สถานประกอบการ"    value={bizResult.count ?? 0}   icon={Building2} color="#5CB8E4" delay="0.5s" />
        <StatCard title="โครงสร้างพื้นฐาน" value={infraResult.count ?? 0} icon={Zap}       color="#8758FF" delay="0.6s" />
        <StatCard title="บริการสาธารณะ"    value={svcResult.count ?? 0}   icon={Heart}     color="#5CB8E4" delay="0.7s" />
      </section>

      {/* ══════════════════════════════════════════════
          DATA CATEGORIES
      ══════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <SectionHeader
          tag="ข้อมูลชุมชน"
          title="ฐานข้อมูลสาธารณะ"
          subtitle="เรียกดูข้อมูลสำคัญของเมืองตาคลีได้ทันที"
          delay="0.05s"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          {dataCategories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group card bg-base-100 border border-base-200 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div
                className="h-0.75 w-full"
                style={{ background: `linear-gradient(90deg, ${cat.color}, ${cat.color}40)` }}
              />
              <div className="card-body p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: cat.color + "15" }}
                  >
                    <cat.icon size={22} style={{ color: cat.color }} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-base-content/25 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <h2 className="font-bold text-[15px] mb-1.5">{cat.label}</h2>
                <p className="text-sm text-base-content/55 leading-relaxed">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CITIZEN SERVICES
      ══════════════════════════════════════════════ */}
      <section className="border-t border-base-200">
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(180deg, rgba(135,88,255,0.03) 0%, transparent 100%)" }}
        >
          <div className="absolute inset-0 hero-dots opacity-20" />
          <div className="relative max-w-5xl mx-auto px-4 py-14">
            <SectionHeader
              tag="บริการออนไลน์"
              title="บริการประชาชนดิจิทัล"
              subtitle="ช่องทางบริการและข้อมูลสำหรับประชาชนชาวตาคลี"
              delay="0s"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
              {citizenServices.map((svc, i) => (
                <div
                  key={svc.label}
                  className="group relative bg-base-100 rounded-2xl border border-base-200 p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer fade-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {svc.soon && (
                    <span
                      className="absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                      style={{
                        background: "rgba(135,88,255,0.1)",
                        color: "#8758FF",
                      }}
                    >
                      เร็วๆ นี้
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: svc.color + "14" }}
                  >
                    <svc.icon size={20} style={{ color: svc.color }} />
                  </div>
                  <p className="text-xs font-semibold leading-snug">{svc.label}</p>
                  <p className="text-[11px] text-base-content/45 mt-1 leading-snug">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          GOVERNANCE & TRANSPARENCY
      ══════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <SectionHeader
          tag="ธรรมาภิบาล"
          title="ความโปร่งใสดิจิทัล"
          subtitle="ข้อมูลสาธารณะด้านงบประมาณ จัดซื้อจัดจ้าง และการรายงาน"
          delay="0s"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {governanceItems.map((item, i) => (
            <div
              key={item.label}
              className="group relative bg-base-100 rounded-2xl border border-base-200 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Subtle top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.75"
                style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
              />
              {/* Coming soon badge */}
              <span
                className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(135,88,255,0.08)", color: "#8758FF" }}
              >
                เร็วๆ นี้
              </span>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: item.color + "14" }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <p className="font-bold text-sm mb-1">{item.label}</p>
              <p className="text-[12px] text-base-content/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SMART CITY BANNER
      ══════════════════════════════════════════════ */}
      <section className="border-t border-base-200 mb-0">
        <div
          className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #8758FF08 0%, #5CB8E408 100%)" }}
        >
          <div className="absolute inset-0 hero-dots opacity-15" />
          <div className="relative max-w-5xl mx-auto px-4 py-14">
            <SectionHeader
              tag="เมืองอัจฉริยะ"
              title="ตาคลี Smart City"
              subtitle="เทคโนโลยีและระบบสารสนเทศเพื่อพัฒนาเมืองอัจฉริยะ"
              delay="0s"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
              {smartItems.map((item, i) => (
                <div
                  key={item.label}
                  className="group relative bg-base-100/80 rounded-2xl border border-base-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden fade-up"
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  <div
                    className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                    style={{ background: item.color + "25" }}
                  />
                  <span
                    className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mb-4"
                    style={{ background: item.color + "14", color: item.color }}
                  >
                    เร็วๆ นี้
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: item.color + "14" }}
                  >
                    <item.icon size={24} style={{ color: item.color }} />
                  </div>
                  <p className="font-bold text-base mb-2">{item.label}</p>
                  <p className="text-sm text-base-content/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Shared section header component ─── */
function SectionHeader({
  tag,
  title,
  subtitle,
  delay = "0s",
}: {
  tag: string;
  title: string;
  subtitle: string;
  delay?: string;
}) {
  return (
    <div className="fade-up" style={{ animationDelay: delay }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-base-content/35 mb-1.5">
        {tag}
      </p>
      <h2 className="text-xl lg:text-2xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-base-content/50">{subtitle}</p>
    </div>
  );
}
