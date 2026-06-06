import { createClient } from "@/lib/supabase/server";
import { Users, Building2, Zap, Heart, MapPin, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/public/StatCard";
import Link from "next/link";

const categories = [
  {
    href: "/population",
    label: "ข้อมูลประชากร",
    desc: "จำนวนประชากร ครัวเรือน และการกระจายตัวในแต่ละพื้นที่",
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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh" />
        <div className="absolute inset-0 hero-dots opacity-50" />

        {/* Decorative blobs */}
        <div
          className="absolute -top-40 -right-40 w-125 h-125 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8758FF, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #5CB8E4, transparent 70%)" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 py-20 lg:py-28 text-center">
          {/* Province badge */}
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
            <Link
              href="/auth/login"
              className="btn btn-sm btn-ghost rounded-full px-5 font-medium"
            >
              สำหรับเจ้าหน้าที่
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-4 -mt-4 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ประชากรทั้งหมด" value={totalPop}      icon={Users}     color="#8758FF" delay="0.4s" />
        <StatCard title="สถานประกอบการ"  value={bizResult.count ?? 0}   icon={Building2} color="#5CB8E4" delay="0.5s" />
        <StatCard title="โครงสร้างพื้นฐาน" value={infraResult.count ?? 0} icon={Zap}       color="#8758FF" delay="0.6s" />
        <StatCard title="บริการสาธารณะ"  value={svcResult.count ?? 0}   icon={Heart}     color="#5CB8E4" delay="0.7s" />
      </section>

      {/* ── Category cards ── */}
      <section className="max-w-5xl mx-auto px-4 py-12 pb-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-6 fade-up">
          หมวดหมู่ข้อมูล
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group card bg-base-100 border border-base-200 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              {/* Top accent strip */}
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
    </div>
  );
}
