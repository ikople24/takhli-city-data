import { createClient } from "@/lib/supabase/server";
import { Users, Building2, Zap, Heart } from "lucide-react";
import StatCard from "@/components/public/StatCard";
import Link from "next/link";

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

  const categories = [
    {
      href: "/population",
      label: "ข้อมูลประชากร",
      desc: "จำนวนประชากร, ครัวเรือน, การกระจายอายุ",
      color: "#8758FF",
    },
    {
      href: "/business",
      label: "สถานประกอบการ",
      desc: "ร้านค้า, โรงงาน, ธุรกิจในพื้นที่",
      color: "#5CB8E4",
    },
    {
      href: "/infrastructure",
      label: "โครงสร้างพื้นฐาน",
      desc: "ถนน, ไฟฟ้า, ประปา, อินเทอร์เน็ต",
      color: "#8758FF",
    },
    {
      href: "/services",
      label: "บริการสาธารณะ",
      desc: "โรงพยาบาล, โรงเรียน, วัด, ตำรวจ",
      color: "#5CB8E4",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, #8758FF15 0%, #5CB8E415 100%)",
        }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          ฐานข้อมูลกลางเมืองตาคลี
        </h1>
        <p className="text-base-content/60 max-w-xl mx-auto text-sm lg:text-base">
          ระบบรวบรวมข้อมูลสำคัญของเทศบาลเมืองตาคลี จังหวัดนครสวรรค์
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard
          title="ประชากรทั้งหมด"
          value={totalPop}
          icon={Users}
          color="#8758FF"
        />
        <StatCard
          title="สถานประกอบการ"
          value={bizResult.count ?? 0}
          icon={Building2}
          color="#5CB8E4"
        />
        <StatCard
          title="โครงสร้างพื้นฐาน"
          value={infraResult.count ?? 0}
          icon={Zap}
          color="#8758FF"
        />
        <StatCard
          title="บริการสาธารณะ"
          value={svcResult.count ?? 0}
          icon={Heart}
          color="#5CB8E4"
        />
      </section>

      {/* Category cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className="card-body">
              <h2 className="card-title text-lg" style={{ color: cat.color }}>
                {cat.label}
              </h2>
              <p className="text-sm text-base-content/60">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
