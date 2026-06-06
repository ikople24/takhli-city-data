# Department Pages & Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ขยายระบบจาก 4 หมวดข้อมูลพื้นฐาน เป็น 7 กองเทศบาล พร้อม section-grouped navigation และ mixed model pages (data table + document tools)

**Architecture:** Section-grouped admin sidebar แบ่ง 4 กลุ่ม, dropdown public navbar 2 หมวด, แต่ละ department page ใช้ daisyUI v5 radio tabs แบ่ง "ข้อมูล" กับ "สร้างเอกสาร". Engineering/Health reuse existing tables ผ่าน actions ใหม่; สร้าง 5 tables ใหม่สำหรับกองที่เหลือ

**Tech Stack:** Next.js 16 App Router, TypeScript strict, daisyUI v5, Supabase MCP, lucide-react

---

## File Map

**Modified:**
- `src/types/database.ts` — เพิ่ม 5 types ใหม่ + Database entries
- `src/components/admin/Sidebar.tsx` — เปลี่ยนเป็น section groups
- `src/components/public/Navbar.tsx` — เพิ่ม dropdown 2 กลุ่ม
- `src/app/(public)/page.tsx` — เพิ่ม 3 category cards

**Created:**
- `src/components/admin/DocumentToolCard.tsx`
- `src/app/admin/finance/{page.tsx,FinanceForm.tsx,_actions.ts}`
- `src/app/admin/engineering/{page.tsx,EngineeringForm.tsx,_actions.ts}`
- `src/app/admin/education/{page.tsx,EducationForm.tsx,_actions.ts}`
- `src/app/admin/health/{page.tsx,HealthForm.tsx,_actions.ts}`
- `src/app/admin/welfare/{page.tsx,WelfareForm.tsx,_actions.ts}`
- `src/app/admin/planning/{page.tsx,PlanningForm.tsx,_actions.ts}`
- `src/app/admin/water/{page.tsx,WaterForm.tsx,_actions.ts}`
- `src/app/(public)/education/page.tsx`
- `src/app/(public)/welfare/page.tsx`
- `src/app/(public)/plans/page.tsx`

---

## Task 1: TypeScript Types

**Files:**
- Modify: `src/types/database.ts`

- [ ] **Step 1: เพิ่ม 5 types และ Database entries**

เปิด `src/types/database.ts` และต่อท้ายก่อน `export type Database`:

```typescript
export type BudgetItem = {
  id: string;
  fiscal_year: number;
  category: "รายรับ" | "รายจ่าย" | "เงินอุดหนุน";
  department: string;
  item_name: string;
  amount: number;
  status: "อนุมัติ" | "รอ" | "ปรับแผน";
  created_at: string;
  updated_at: string;
};

export type EducationFacility = {
  id: string;
  name: string;
  type: "โรงเรียน" | "ศูนย์เด็กเล็ก" | "ห้องสมุด" | "อื่นๆ";
  student_count: number;
  tambon: string | null;
  address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type WelfareRecipient = {
  id: string;
  welfare_type: "ผู้สูงอายุ" | "คนพิการ" | "ผู้ด้อยโอกาส" | "เด็ก";
  tambon: string;
  recipient_count: number;
  fiscal_year: number;
  budget_used: number;
  created_at: string;
  updated_at: string;
};

export type WaterSupplyZone = {
  id: string;
  zone_name: string;
  meter_count: number;
  service_area: string | null;
  status: "ปกติ" | "ซ่อมบำรุง" | "ขยาย";
  coverage_percent: number;
  created_at: string;
  updated_at: string;
};

export type DevelopmentPlan = {
  id: string;
  project_name: string;
  strategy_no: number;
  fiscal_year: number;
  budget: number;
  kpi: string | null;
  status: "วางแผน" | "ดำเนินการ" | "เสร็จสิ้น";
  responsible_dept: string | null;
  created_at: string;
  updated_at: string;
};
```

จากนั้นใน `export type Database` เพิ่มใน `Tables`:

```typescript
      budget_items: {
        Row: BudgetItem;
        Insert: Omit<BudgetItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BudgetItem, "id">>;
        Relationships: [];
      };
      education_facilities: {
        Row: EducationFacility;
        Insert: Omit<EducationFacility, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<EducationFacility, "id">>;
        Relationships: [];
      };
      welfare_recipients: {
        Row: WelfareRecipient;
        Insert: Omit<WelfareRecipient, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<WelfareRecipient, "id">>;
        Relationships: [];
      };
      water_supply_zones: {
        Row: WaterSupplyZone;
        Insert: Omit<WaterSupplyZone, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<WaterSupplyZone, "id">>;
        Relationships: [];
      };
      development_plans: {
        Row: DevelopmentPlan;
        Insert: Omit<DevelopmentPlan, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DevelopmentPlan, "id">>;
        Relationships: [];
      };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/thanawat/Fullstack/takhli_city_data && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for 5 new department tables"
```

---

## Task 2: Database Migrations (5 Tables)

**Files:** Supabase via MCP

- [ ] **Step 1: สร้าง budget_items**

ใช้ Supabase MCP tool `apply_migration` ด้วย SQL:

```sql
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('รายรับ', 'รายจ่าย', 'เงินอุดหนุน')),
  department TEXT NOT NULL DEFAULT '',
  item_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'รอ' CHECK (status IN ('อนุมัติ', 'รอ', 'ปรับแผน')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read" ON budget_items FOR SELECT USING (true);
CREATE POLICY "allow_auth_write" ON budget_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 2: สร้าง education_facilities**

```sql
CREATE TABLE education_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'โรงเรียน' CHECK (type IN ('โรงเรียน', 'ศูนย์เด็กเล็ก', 'ห้องสมุด', 'อื่นๆ')),
  student_count INT NOT NULL DEFAULT 0,
  tambon TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE education_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read" ON education_facilities FOR SELECT USING (true);
CREATE POLICY "allow_auth_write" ON education_facilities FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 3: สร้าง welfare_recipients**

```sql
CREATE TABLE welfare_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  welfare_type TEXT NOT NULL CHECK (welfare_type IN ('ผู้สูงอายุ', 'คนพิการ', 'ผู้ด้อยโอกาส', 'เด็ก')),
  tambon TEXT NOT NULL DEFAULT '',
  recipient_count INT NOT NULL DEFAULT 0,
  fiscal_year INT NOT NULL,
  budget_used NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE welfare_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read" ON welfare_recipients FOR SELECT USING (true);
CREATE POLICY "allow_auth_write" ON welfare_recipients FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 4: สร้าง water_supply_zones**

```sql
CREATE TABLE water_supply_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  meter_count INT NOT NULL DEFAULT 0,
  service_area TEXT,
  status TEXT NOT NULL DEFAULT 'ปกติ' CHECK (status IN ('ปกติ', 'ซ่อมบำรุง', 'ขยาย')),
  coverage_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE water_supply_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read" ON water_supply_zones FOR SELECT USING (true);
CREATE POLICY "allow_auth_write" ON water_supply_zones FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 5: สร้าง development_plans**

```sql
CREATE TABLE development_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  strategy_no INT NOT NULL DEFAULT 1 CHECK (strategy_no BETWEEN 1 AND 6),
  fiscal_year INT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  kpi TEXT,
  status TEXT NOT NULL DEFAULT 'วางแผน' CHECK (status IN ('วางแผน', 'ดำเนินการ', 'เสร็จสิ้น')),
  responsible_dept TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE development_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_public_read" ON development_plans FOR SELECT USING (true);
CREATE POLICY "allow_auth_write" ON development_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 6: Verify tables exist**

ใช้ Supabase MCP `list_tables` และตรวจว่ามี 5 tables ใหม่

- [ ] **Step 7: Commit**

```bash
git commit --allow-empty -m "feat: create 5 department database tables via Supabase MCP"
```

---

## Task 3: DocumentToolCard Component

**Files:**
- Create: `src/components/admin/DocumentToolCard.tsx`

- [ ] **Step 1: สร้าง component**

```typescript
// src/components/admin/DocumentToolCard.tsx
interface DocumentToolCardProps {
  title: string;
  description: string;
  command: string;
  type: "command" | "skill";
}

export default function DocumentToolCard({
  title,
  description,
  command,
  type,
}: DocumentToolCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body p-4 gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`badge badge-sm ${
              type === "command" ? "badge-primary" : "badge-secondary"
            }`}
          >
            {type === "command" ? "command" : "skill"}
          </span>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-xs text-base-content/60">{description}</p>
        <code className="text-xs font-mono bg-base-200 px-2 py-1 rounded mt-1 block">
          {command}
        </code>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/DocumentToolCard.tsx
git commit -m "feat: add DocumentToolCard component for department document tools"
```

---

## Task 4: Admin Sidebar Section Groups

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`

- [ ] **Step 1: แทนที่เนื้อหาทั้งหมดใน Sidebar.tsx**

```typescript
// src/components/admin/Sidebar.tsx
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
  Banknote,
  HardHat,
  GraduationCap,
  Stethoscope,
  HeartHandshake,
  Target,
  Droplets,
} from "lucide-react";

const navSections = [
  {
    label: null,
    items: [
      { href: "/admin/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
      { href: "/admin/export", label: "Export ข้อมูล", icon: Download },
    ],
  },
  {
    label: "ข้อมูลพื้นฐาน",
    items: [
      { href: "/admin/population", label: "ประชากร", icon: Users },
      { href: "/admin/business", label: "ธุรกิจ", icon: Building2 },
      { href: "/admin/infrastructure", label: "โครงสร้างพื้นฐาน", icon: Zap },
      { href: "/admin/services", label: "บริการสาธารณะ", icon: Heart },
    ],
  },
  {
    label: "กองต่างๆ",
    items: [
      { href: "/admin/finance", label: "กองคลัง", icon: Banknote },
      { href: "/admin/engineering", label: "กองช่าง", icon: HardHat },
      { href: "/admin/education", label: "กองการศึกษา", icon: GraduationCap },
      { href: "/admin/health", label: "กองสาธารณสุข", icon: Stethoscope },
      { href: "/admin/welfare", label: "กองสวัสดิการ", icon: HeartHandshake },
      { href: "/admin/planning", label: "กองยุทธศาสตร์", icon: Target },
      { href: "/admin/water", label: "กองประปา", icon: Droplets },
    ],
  },
  {
    label: "ระบบ",
    items: [
      { href: "/admin/users", label: "จัดการผู้ใช้", icon: UserCog },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 min-h-screen flex flex-col py-6 px-3 shrink-0 overflow-y-auto"
      style={{ background: "#181818" }}
    >
      <div className="flex items-center gap-2 px-3 mb-6">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: "#8758FF" }}
        >
          ต
        </div>
        <span className="text-white font-semibold text-sm">ระบบจัดการข้อมูล</span>
      </div>

      <nav className="flex-1 space-y-4">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
                    style={active ? { background: "#8758FF" } : {}}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/Sidebar.tsx
git commit -m "feat: restructure admin sidebar into section groups for departments"
```

---

## Task 5: Public Navbar Dropdowns

**Files:**
- Modify: `src/components/public/Navbar.tsx`

- [ ] **Step 1: แทนที่เนื้อหาทั้งหมดใน Navbar.tsx**

```typescript
// src/components/public/Navbar.tsx
import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";

const basicLinks = [
  { href: "/population", label: "ประชากร" },
  { href: "/business", label: "ธุรกิจ" },
  { href: "/infrastructure", label: "โครงสร้างพื้นฐาน" },
  { href: "/services", label: "บริการสาธารณะ" },
];

const deptLinks = [
  { href: "/education", label: "การศึกษา" },
  { href: "/welfare", label: "สวัสดิการ" },
  { href: "/plans", label: "แผนพัฒนา" },
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
          {/* Dropdown: ข้อมูลพื้นฐาน */}
          <li>
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm text-base-content/65 hover:text-primary hover:bg-primary/8 transition-all font-medium cursor-pointer"
              >
                ข้อมูลพื้นฐาน
                <ChevronDown size={12} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl border border-base-200 w-52 z-50 mt-1 p-2"
              >
                {basicLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="rounded-lg text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Dropdown: ข้อมูลกอง */}
          <li>
            <div className="dropdown dropdown-hover">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm text-base-content/65 hover:text-primary hover:bg-primary/8 transition-all font-medium cursor-pointer"
              >
                ข้อมูลกอง
                <ChevronDown size={12} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl border border-base-200 w-52 z-50 mt-1 p-2"
              >
                {deptLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="rounded-lg text-sm">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
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
            <ul className="dropdown-content menu bg-base-100 rounded-2xl shadow-xl border border-base-200 w-56 z-50 mt-2 p-2">
              <li className="menu-title text-xs">ข้อมูลพื้นฐาน</li>
              {basicLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rounded-lg text-sm">{l.label}</Link>
                </li>
              ))}
              <li className="menu-title text-xs mt-2">ข้อมูลกอง</li>
              {deptLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rounded-lg text-sm">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add src/components/public/Navbar.tsx
git commit -m "feat: add dropdown navigation groups to public navbar"
```

---

## Task 6: Admin Finance Page (กองคลัง)

**Files:**
- Create: `src/app/admin/finance/_actions.ts`
- Create: `src/app/admin/finance/FinanceForm.tsx`
- Create: `src/app/admin/finance/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts**

```typescript
// src/app/admin/finance/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertBudgetItem(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    fiscal_year: Number(formData.get("fiscal_year")),
    category: formData.get("category") as string,
    department: formData.get("department") as string,
    item_name: formData.get("item_name") as string,
    amount: Number(formData.get("amount")),
    status: formData.get("status") as string,
  };
  if (id) {
    await supabase.from("budget_items").update(payload).eq("id", id);
  } else {
    await supabase.from("budget_items").insert(payload);
  }
  revalidatePath("/admin/finance");
}

export async function deleteBudgetItem(id: string) {
  const supabase = await createClient();
  await supabase.from("budget_items").delete().eq("id", id);
  revalidatePath("/admin/finance");
}
```

- [ ] **Step 2: สร้าง FinanceForm.tsx**

```typescript
// src/app/admin/finance/FinanceForm.tsx
"use client";
import { upsertBudgetItem } from "./_actions";
import type { BudgetItem } from "@/types/database";

const CATEGORIES = ["รายรับ", "รายจ่าย", "เงินอุดหนุน"];
const STATUSES = ["อนุมัติ", "รอ", "ปรับแผน"];

export default function FinanceForm({
  item,
  onClose,
}: {
  item: BudgetItem | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertBudgetItem(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขรายการงบประมาณ" : "เพิ่มรายการงบประมาณ"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อรายการ</span></label>
          <input name="item_name" className="input input-bordered input-sm" defaultValue={item?.item_name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ปีงบประมาณ (พ.ศ.)</span></label>
            <input name="fiscal_year" type="number" min="2560" max="2600" className="input input-bordered input-sm" defaultValue={item?.fiscal_year ?? 2568} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">วงเงิน (บาท)</span></label>
            <input name="amount" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.amount ?? 0} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">หมวดหมู่</span></label>
            <select name="category" className="select select-bordered select-sm" defaultValue={item?.category ?? "รายจ่าย"}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">สถานะ</span></label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "รอ"}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">กองรับผิดชอบ</span></label>
          <input name="department" className="input input-bordered input-sm" defaultValue={item?.department ?? ""} required />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/finance/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteBudgetItem } from "./_actions";
import FinanceForm from "./FinanceForm";
import type { BudgetItem } from "@/types/database";
import { Banknote } from "lucide-react";

const columns = [
  { key: "item_name" as const, label: "ชื่อรายการ" },
  { key: "category" as const, label: "หมวด" },
  { key: "fiscal_year" as const, label: "ปีงบ" },
  {
    key: "amount" as const,
    label: "วงเงิน (บาท)",
    render: (v: BudgetItem[keyof BudgetItem]) =>
      (v as number).toLocaleString("th-TH"),
  },
  { key: "department" as const, label: "กอง" },
  { key: "status" as const, label: "สถานะ" },
];

const docTools = [
  {
    title: "สรุปงบประมาณ",
    description: "วิเคราะห์และสรุปข้อมูลงบประมาณ รายรับ-รายจ่าย เปรียบเทียบ YoY",
    command: "/budget-summary",
    type: "command" as const,
  },
  {
    title: "เอกสารจัดซื้อจัดจ้าง",
    description: "TOR วงเงิน→วิธีจัดซื้อ checklist ตรวจรับงาน",
    command: "procurement skill",
    type: "skill" as const,
  },
  {
    title: "วิเคราะห์ข้อมูล KPI",
    description: "สถิติ เปรียบเทียบ YoY KPI formula",
    command: "data-analysis skill",
    type: "skill" as const,
  },
];

export default async function FinancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("budget_items").select("*", { count: "exact" }).order("fiscal_year", { ascending: false });

  const totalAmount = (data ?? []).reduce((s, r) => s + (r.amount ?? 0), 0);

  return (
    <div>
      <Topbar title="กองคลัง" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="finance_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">รายการทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <Banknote size={20} style={{ color: "#8758FF" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">วงเงินรวม</p>
                  <p className="text-xl font-bold">{totalAmount.toLocaleString("th-TH")}</p>
                  <p className="text-xs text-base-content/40">บาท</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <FinanceForm item={item as BudgetItem | null} onClose={onClose} />
              )}
              onDelete={deleteBudgetItem}
              addLabel="เพิ่มรายการงบประมาณ"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="finance_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารและรายงานสำหรับกองคลัง</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/finance/
git commit -m "feat: add กองคลัง admin page with budget CRUD and document tools"
```

---

## Task 7: Admin Engineering Page (กองช่าง)

**Files:**
- Create: `src/app/admin/engineering/_actions.ts`
- Create: `src/app/admin/engineering/EngineeringForm.tsx`
- Create: `src/app/admin/engineering/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts** (reuse infrastructure table, revalidate ทั้งสองหน้า)

```typescript
// src/app/admin/engineering/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Infrastructure } from "@/types/database";

export async function upsertEngineering(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as Infrastructure["type"],
    area_name: (formData.get("area_name") as string) || null,
    status: formData.get("status") as Infrastructure["status"],
    description: (formData.get("description") as string) || null,
    coverage_km: Number(formData.get("coverage_km")),
  };
  if (id) {
    await supabase.from("infrastructure").update(payload).eq("id", id);
  } else {
    await supabase.from("infrastructure").insert(payload);
  }
  revalidatePath("/admin/engineering");
  revalidatePath("/admin/infrastructure");
}

export async function deleteEngineering(id: string) {
  const supabase = await createClient();
  await supabase.from("infrastructure").delete().eq("id", id);
  revalidatePath("/admin/engineering");
  revalidatePath("/admin/infrastructure");
}
```

- [ ] **Step 2: สร้าง EngineeringForm.tsx**

```typescript
// src/app/admin/engineering/EngineeringForm.tsx
"use client";
import { upsertEngineering } from "./_actions";
import type { Infrastructure } from "@/types/database";

const TYPES = ["ถนน", "ไฟฟ้า", "ประปา", "อินเทอร์เน็ต", "อื่นๆ"];
const STATUSES = ["ดี", "ปานกลาง", "ต้องซ่อม"];

export default function EngineeringForm({
  item,
  onClose,
}: {
  item: Infrastructure | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertEngineering(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลโครงสร้างพื้นฐาน" : "เพิ่มข้อมูลโครงสร้างพื้นฐาน"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อ</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภท</span></label>
            <select name="type" className="select select-bordered select-sm" defaultValue={item?.type ?? "อื่นๆ"}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">สภาพ</span></label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "ดี"}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">พื้นที่</span></label>
          <input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">คำอธิบาย</span></label>
          <input name="description" className="input input-bordered input-sm" defaultValue={item?.description ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ระยะทาง (กม.)</span></label>
          <input name="coverage_km" type="number" min="0" step="0.1" className="input input-bordered input-sm" defaultValue={item?.coverage_km ?? 0} />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/engineering/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteEngineering } from "./_actions";
import EngineeringForm from "./EngineeringForm";
import type { Infrastructure } from "@/types/database";
import { HardHat } from "lucide-react";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท" },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "status" as const, label: "สภาพ" },
  { key: "coverage_km" as const, label: "ระยะทาง (กม.)" },
];

const docTools = [
  {
    title: "แผนโครงการก่อสร้าง",
    description: "จัดทำแผนโครงการพร้อม KPI งบประมาณ และไทม์ไลน์",
    command: "/project-plan",
    type: "command" as const,
  },
  {
    title: "TOR โครงสร้างพื้นฐาน",
    description: "TOR Smart Light/CCTV/Sensor ROI anti-lock-in",
    command: "smart-infrastructure skill",
    type: "skill" as const,
  },
  {
    title: "วิเคราะห์ GIS เชิงพื้นที่",
    description: "แผนที่ layers TOR ระบบ GIS วิเคราะห์น้ำท่วม",
    command: "gis-spatial skill",
    type: "skill" as const,
  },
];

export default async function EngineeringPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("infrastructure").select("*", { count: "exact" }).order("name");

  const needRepair = (data ?? []).filter((r) => r.status === "ต้องซ่อม").length;

  return (
    <div>
      <Topbar title="กองช่าง" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="eng_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">รายการทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <HardHat size={20} style={{ color: "#8758FF" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">ต้องซ่อมบำรุง</p>
                  <p className="text-xl font-bold text-error">{needRepair}</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <EngineeringForm item={item as Infrastructure | null} onClose={onClose} />
              )}
              onDelete={deleteEngineering}
              addLabel="เพิ่มข้อมูลโครงสร้างพื้นฐาน"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="eng_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารและรายงานสำหรับกองช่าง</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/engineering/
git commit -m "feat: add กองช่าง admin page reusing infrastructure table"
```

---

## Task 8: Admin Education Page (กองการศึกษา)

**Files:**
- Create: `src/app/admin/education/_actions.ts`
- Create: `src/app/admin/education/EducationForm.tsx`
- Create: `src/app/admin/education/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts**

```typescript
// src/app/admin/education/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertEducation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    student_count: Number(formData.get("student_count")),
    tambon: (formData.get("tambon") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
  };
  if (id) {
    await supabase.from("education_facilities").update(payload).eq("id", id);
  } else {
    await supabase.from("education_facilities").insert(payload);
  }
  revalidatePath("/admin/education");
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();
  await supabase.from("education_facilities").delete().eq("id", id);
  revalidatePath("/admin/education");
}
```

- [ ] **Step 2: สร้าง EducationForm.tsx**

```typescript
// src/app/admin/education/EducationForm.tsx
"use client";
import { upsertEducation } from "./_actions";
import type { EducationFacility } from "@/types/database";

const TYPES = ["โรงเรียน", "ศูนย์เด็กเล็ก", "ห้องสมุด", "อื่นๆ"];

export default function EducationForm({
  item,
  onClose,
}: {
  item: EducationFacility | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertEducation(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลสถานศึกษา" : "เพิ่มข้อมูลสถานศึกษา"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อสถานศึกษา</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภท</span></label>
            <select name="type" className="select select-bordered select-sm" defaultValue={item?.type ?? "โรงเรียน"}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">จำนวนนักเรียน</span></label>
            <input name="student_count" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.student_count ?? 0} required />
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ตำบล</span></label>
          <input name="tambon" className="input input-bordered input-sm" defaultValue={item?.tambon ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ที่อยู่</span></label>
          <input name="address" className="input input-bordered input-sm" defaultValue={item?.address ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">เบอร์ติดต่อ</span></label>
          <input name="phone" className="input input-bordered input-sm" defaultValue={item?.phone ?? ""} />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/education/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteEducation } from "./_actions";
import EducationForm from "./EducationForm";
import type { EducationFacility } from "@/types/database";
import { GraduationCap } from "lucide-react";

const columns = [
  { key: "name" as const, label: "ชื่อสถานศึกษา" },
  { key: "type" as const, label: "ประเภท" },
  { key: "tambon" as const, label: "ตำบล" },
  {
    key: "student_count" as const,
    label: "นักเรียน",
    render: (v: EducationFacility[keyof EducationFacility]) =>
      (v as number).toLocaleString("th-TH"),
  },
  { key: "phone" as const, label: "โทร" },
];

const docTools = [
  {
    title: "แผนโครงการการศึกษา",
    description: "จัดทำแผนโครงการพร้อม KPI งบประมาณ",
    command: "/project-plan",
    type: "command" as const,
  },
  {
    title: "รายงานประจำปี",
    description: "โครงสร้าง 6 บท สูตรเขียนผลสำเร็จ checklist เผยแพร่",
    command: "annual-report skill",
    type: "skill" as const,
  },
  {
    title: "วิเคราะห์ข้อมูลการศึกษา",
    description: "สถิติ เปรียบเทียบ YoY KPI formula",
    command: "data-analysis skill",
    type: "skill" as const,
  },
];

export default async function EducationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("education_facilities").select("*", { count: "exact" }).order("name");

  const totalStudents = (data ?? []).reduce((s, r) => s + (r.student_count ?? 0), 0);

  return (
    <div>
      <Topbar title="กองการศึกษา" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="edu_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">สถานศึกษาทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <GraduationCap size={20} style={{ color: "#8758FF" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">นักเรียนรวม</p>
                  <p className="text-xl font-bold">{totalStudents.toLocaleString("th-TH")}</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <EducationForm item={item as EducationFacility | null} onClose={onClose} />
              )}
              onDelete={deleteEducation}
              addLabel="เพิ่มสถานศึกษา"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="edu_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารสำหรับกองการศึกษา</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/education/
git commit -m "feat: add กองการศึกษา admin page with education facilities CRUD"
```

---

## Task 9: Admin Health Page (กองสาธารณสุข)

**Files:**
- Create: `src/app/admin/health/_actions.ts`
- Create: `src/app/admin/health/HealthForm.tsx`
- Create: `src/app/admin/health/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts** (reuse public_services table)

```typescript
// src/app/admin/health/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PublicService } from "@/types/database";

export async function upsertHealth(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as PublicService["type"],
    address: (formData.get("address") as string) || null,
    area_name: (formData.get("area_name") as string) || null,
    phone: (formData.get("phone") as string) || null,
    capacity: Number(formData.get("capacity")),
    lat: null as number | null,
    lng: null as number | null,
  };
  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lat: _lat, lng: _lng, ...updatePayload } = payload;
    await supabase.from("public_services").update(updatePayload).eq("id", id);
  } else {
    await supabase.from("public_services").insert(payload);
  }
  revalidatePath("/admin/health");
  revalidatePath("/admin/services");
}

export async function deleteHealth(id: string) {
  const supabase = await createClient();
  await supabase.from("public_services").delete().eq("id", id);
  revalidatePath("/admin/health");
  revalidatePath("/admin/services");
}
```

- [ ] **Step 2: สร้าง HealthForm.tsx**

```typescript
// src/app/admin/health/HealthForm.tsx
"use client";
import { upsertHealth } from "./_actions";
import type { PublicService } from "@/types/database";

const TYPES = ["โรงพยาบาล", "โรงเรียน", "วัด", "สถานีตำรวจ", "อื่นๆ"];

export default function HealthForm({
  item,
  onClose,
}: {
  item: PublicService | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertHealth(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลบริการสาธารณะ" : "เพิ่มข้อมูลบริการสาธารณะ"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อ</span></label>
          <input name="name" className="input input-bordered input-sm" defaultValue={item?.name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภท</span></label>
            <select name="type" className="select select-bordered select-sm" defaultValue={item?.type ?? "อื่นๆ"}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ความจุ</span></label>
            <input name="capacity" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.capacity ?? 0} />
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">พื้นที่</span></label>
          <input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ที่อยู่</span></label>
          <input name="address" className="input input-bordered input-sm" defaultValue={item?.address ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">เบอร์โทร</span></label>
          <input name="phone" className="input input-bordered input-sm" defaultValue={item?.phone ?? ""} />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/health/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteHealth } from "./_actions";
import HealthForm from "./HealthForm";
import type { PublicService } from "@/types/database";
import { Stethoscope } from "lucide-react";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท" },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "capacity" as const, label: "ความจุ" },
  { key: "phone" as const, label: "โทร" },
];

const docTools = [
  {
    title: "รณรงค์สุขภาพ",
    description: "สร้างเนื้อหาสื่อรณรงค์ Facebook ใบปลิว หอกระจาย",
    command: "/health-campaign",
    type: "command" as const,
  },
  {
    title: "PDPA Compliance",
    description: "ตรวจสอบ PDPA สำหรับระบบที่เก็บข้อมูลบุคคล",
    command: "pdpa-compliance skill",
    type: "skill" as const,
  },
  {
    title: "วิเคราะห์ข้อมูลสาธารณสุข",
    description: "สถิติ เปรียบเทียบ YoY KPI formula",
    command: "data-analysis skill",
    type: "skill" as const,
  },
];

export default async function HealthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("public_services").select("*", { count: "exact" }).order("name");

  return (
    <div>
      <Topbar title="กองสาธารณสุข" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="health_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">บริการสาธารณะทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <Stethoscope size={20} style={{ color: "#5CB8E4" }} />
                  </div>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <HealthForm item={item as PublicService | null} onClose={onClose} />
              )}
              onDelete={deleteHealth}
              addLabel="เพิ่มบริการสาธารณะ"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="health_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารสำหรับกองสาธารณสุข</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/health/
git commit -m "feat: add กองสาธารณสุข admin page reusing public_services table"
```

---

## Task 10: Admin Welfare Page (กองสวัสดิการ)

**Files:**
- Create: `src/app/admin/welfare/_actions.ts`
- Create: `src/app/admin/welfare/WelfareForm.tsx`
- Create: `src/app/admin/welfare/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts**

```typescript
// src/app/admin/welfare/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertWelfare(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    welfare_type: formData.get("welfare_type") as string,
    tambon: formData.get("tambon") as string,
    recipient_count: Number(formData.get("recipient_count")),
    fiscal_year: Number(formData.get("fiscal_year")),
    budget_used: Number(formData.get("budget_used")),
  };
  if (id) {
    await supabase.from("welfare_recipients").update(payload).eq("id", id);
  } else {
    await supabase.from("welfare_recipients").insert(payload);
  }
  revalidatePath("/admin/welfare");
}

export async function deleteWelfare(id: string) {
  const supabase = await createClient();
  await supabase.from("welfare_recipients").delete().eq("id", id);
  revalidatePath("/admin/welfare");
}
```

- [ ] **Step 2: สร้าง WelfareForm.tsx**

```typescript
// src/app/admin/welfare/WelfareForm.tsx
"use client";
import { upsertWelfare } from "./_actions";
import type { WelfareRecipient } from "@/types/database";

const TYPES = ["ผู้สูงอายุ", "คนพิการ", "ผู้ด้อยโอกาส", "เด็ก"];

export default function WelfareForm({
  item,
  onClose,
}: {
  item: WelfareRecipient | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertWelfare(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลสวัสดิการ" : "เพิ่มข้อมูลสวัสดิการ"}
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ประเภทสวัสดิการ</span></label>
            <select name="welfare_type" className="select select-bordered select-sm" defaultValue={item?.welfare_type ?? "ผู้สูงอายุ"}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ปีงบประมาณ (พ.ศ.)</span></label>
            <input name="fiscal_year" type="number" min="2560" className="input input-bordered input-sm" defaultValue={item?.fiscal_year ?? 2568} required />
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ตำบล</span></label>
          <input name="tambon" className="input input-bordered input-sm" defaultValue={item?.tambon ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">จำนวนผู้รับ</span></label>
            <input name="recipient_count" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.recipient_count ?? 0} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">งบที่ใช้ (บาท)</span></label>
            <input name="budget_used" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.budget_used ?? 0} required />
          </div>
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/welfare/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteWelfare } from "./_actions";
import WelfareForm from "./WelfareForm";
import type { WelfareRecipient } from "@/types/database";
import { HeartHandshake } from "lucide-react";

const columns = [
  { key: "welfare_type" as const, label: "ประเภท" },
  { key: "tambon" as const, label: "ตำบล" },
  { key: "fiscal_year" as const, label: "ปีงบ" },
  {
    key: "recipient_count" as const,
    label: "ผู้รับ",
    render: (v: WelfareRecipient[keyof WelfareRecipient]) =>
      (v as number).toLocaleString("th-TH"),
  },
  {
    key: "budget_used" as const,
    label: "งบที่ใช้ (บาท)",
    render: (v: WelfareRecipient[keyof WelfareRecipient]) =>
      (v as number).toLocaleString("th-TH"),
  },
];

const docTools = [
  {
    title: "รายงานสวัสดิการ",
    description: "จัดทำรายงานผู้สูงอายุ คนพิการ และผู้ด้อยโอกาส",
    command: "/welfare-report",
    type: "command" as const,
  },
  {
    title: "ตอบหนังสือร้องเรียน",
    description: "Flow รับเรื่อง → กอง → ตอบกลับ ตารางระยะเวลา",
    command: "citizen-complaint skill",
    type: "skill" as const,
  },
  {
    title: "หนังสือราชการ",
    description: "รูปแบบหนังสือ/ประกาศ/บันทึกที่ถูกระเบียบสารบรรณ",
    command: "thai-official-doc skill",
    type: "skill" as const,
  },
];

export default async function WelfarePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("welfare_recipients").select("*", { count: "exact" }).order("fiscal_year", { ascending: false });

  const totalRecipients = (data ?? []).reduce((s, r) => s + (r.recipient_count ?? 0), 0);

  return (
    <div>
      <Topbar title="กองสวัสดิการ" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="welfare_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">รายการทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <HeartHandshake size={20} style={{ color: "#5CB8E4" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">ผู้รับสวัสดิการรวม</p>
                  <p className="text-xl font-bold">{totalRecipients.toLocaleString("th-TH")}</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <WelfareForm item={item as WelfareRecipient | null} onClose={onClose} />
              )}
              onDelete={deleteWelfare}
              addLabel="เพิ่มข้อมูลสวัสดิการ"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="welfare_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารสำหรับกองสวัสดิการ</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/welfare/
git commit -m "feat: add กองสวัสดิการ admin page with welfare recipients CRUD"
```

---

## Task 11: Admin Planning Page (กองยุทธศาสตร์)

**Files:**
- Create: `src/app/admin/planning/_actions.ts`
- Create: `src/app/admin/planning/PlanningForm.tsx`
- Create: `src/app/admin/planning/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts**

```typescript
// src/app/admin/planning/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertPlan(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    project_name: formData.get("project_name") as string,
    strategy_no: Number(formData.get("strategy_no")),
    fiscal_year: Number(formData.get("fiscal_year")),
    budget: Number(formData.get("budget")),
    kpi: (formData.get("kpi") as string) || null,
    status: formData.get("status") as string,
    responsible_dept: (formData.get("responsible_dept") as string) || null,
  };
  if (id) {
    await supabase.from("development_plans").update(payload).eq("id", id);
  } else {
    await supabase.from("development_plans").insert(payload);
  }
  revalidatePath("/admin/planning");
}

export async function deletePlan(id: string) {
  const supabase = await createClient();
  await supabase.from("development_plans").delete().eq("id", id);
  revalidatePath("/admin/planning");
}
```

- [ ] **Step 2: สร้าง PlanningForm.tsx**

```typescript
// src/app/admin/planning/PlanningForm.tsx
"use client";
import { upsertPlan } from "./_actions";
import type { DevelopmentPlan } from "@/types/database";

const STATUSES = ["วางแผน", "ดำเนินการ", "เสร็จสิ้น"];
const STRATEGIES = [1, 2, 3, 4, 5, 6];

export default function PlanningForm({
  item,
  onClose,
}: {
  item: DevelopmentPlan | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertPlan(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขแผนโครงการ" : "เพิ่มแผนโครงการ"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อโครงการ</span></label>
          <input name="project_name" className="input input-bordered input-sm" defaultValue={item?.project_name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ยุทธศาสตร์ที่</span></label>
            <select name="strategy_no" className="select select-bordered select-sm" defaultValue={item?.strategy_no ?? 1}>
              {STRATEGIES.map((n) => <option key={n} value={n}>ยุทธศาสตร์ที่ {n}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ปีงบประมาณ (พ.ศ.)</span></label>
            <input name="fiscal_year" type="number" min="2560" className="input input-bordered input-sm" defaultValue={item?.fiscal_year ?? 2568} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">งบประมาณ (บาท)</span></label>
            <input name="budget" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.budget ?? 0} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">สถานะ</span></label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "วางแผน"}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ตัวชี้วัด (KPI)</span></label>
          <input name="kpi" className="input input-bordered input-sm" defaultValue={item?.kpi ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">กองรับผิดชอบ</span></label>
          <input name="responsible_dept" className="input input-bordered input-sm" defaultValue={item?.responsible_dept ?? ""} />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/planning/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deletePlan } from "./_actions";
import PlanningForm from "./PlanningForm";
import type { DevelopmentPlan } from "@/types/database";
import { Target } from "lucide-react";

const columns = [
  { key: "project_name" as const, label: "ชื่อโครงการ" },
  { key: "strategy_no" as const, label: "ยุทธศาสตร์" },
  { key: "fiscal_year" as const, label: "ปีงบ" },
  {
    key: "budget" as const,
    label: "งบ (บาท)",
    render: (v: DevelopmentPlan[keyof DevelopmentPlan]) =>
      (v as number).toLocaleString("th-TH"),
  },
  { key: "status" as const, label: "สถานะ" },
  { key: "responsible_dept" as const, label: "กอง" },
];

const docTools = [
  {
    title: "แผนโครงการ KPI + งบ",
    description: "จัดทำแผนโครงการพร้อม KPI งบประมาณ ไทม์ไลน์",
    command: "/project-plan",
    type: "command" as const,
  },
  {
    title: "สรุปงบประมาณ",
    description: "วิเคราะห์และสรุปงบ รายรับ-รายจ่าย เปรียบเทียบ YoY",
    command: "/budget-summary",
    type: "command" as const,
  },
  {
    title: "เผยแพร่ Open Data",
    description: "เผยแพร่ข้อมูล data.go.th metadata DCAT ITA checklist",
    command: "open-data skill",
    type: "skill" as const,
  },
];

export default async function PlanningPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("development_plans").select("*", { count: "exact" }).order("fiscal_year", { ascending: false });

  const inProgress = (data ?? []).filter((r) => r.status === "ดำเนินการ").length;

  return (
    <div>
      <Topbar title="กองยุทธศาสตร์" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="planning_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">โครงการทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <Target size={20} style={{ color: "#8758FF" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">กำลังดำเนินการ</p>
                  <p className="text-xl font-bold text-primary">{inProgress}</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <PlanningForm item={item as DevelopmentPlan | null} onClose={onClose} />
              )}
              onDelete={deletePlan}
              addLabel="เพิ่มแผนโครงการ"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="planning_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารสำหรับกองยุทธศาสตร์</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/planning/
git commit -m "feat: add กองยุทธศาสตร์ admin page with development plans CRUD"
```

---

## Task 12: Admin Water Page (กองประปา)

**Files:**
- Create: `src/app/admin/water/_actions.ts`
- Create: `src/app/admin/water/WaterForm.tsx`
- Create: `src/app/admin/water/page.tsx`

- [ ] **Step 1: สร้าง _actions.ts**

```typescript
// src/app/admin/water/_actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertWaterZone(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    zone_name: formData.get("zone_name") as string,
    meter_count: Number(formData.get("meter_count")),
    service_area: (formData.get("service_area") as string) || null,
    status: formData.get("status") as string,
    coverage_percent: Number(formData.get("coverage_percent")),
  };
  if (id) {
    await supabase.from("water_supply_zones").update(payload).eq("id", id);
  } else {
    await supabase.from("water_supply_zones").insert(payload);
  }
  revalidatePath("/admin/water");
}

export async function deleteWaterZone(id: string) {
  const supabase = await createClient();
  await supabase.from("water_supply_zones").delete().eq("id", id);
  revalidatePath("/admin/water");
}
```

- [ ] **Step 2: สร้าง WaterForm.tsx**

```typescript
// src/app/admin/water/WaterForm.tsx
"use client";
import { upsertWaterZone } from "./_actions";
import type { WaterSupplyZone } from "@/types/database";

const STATUSES = ["ปกติ", "ซ่อมบำรุง", "ขยาย"];

export default function WaterForm({
  item,
  onClose,
}: {
  item: WaterSupplyZone | null;
  onClose: () => void;
}) {
  return (
    <form action={async (fd) => { await upsertWaterZone(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">
        {item ? "แก้ไขข้อมูลโซนประปา" : "เพิ่มข้อมูลโซนประปา"}
      </h3>
      <div className="space-y-3">
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">ชื่อโซน/พื้นที่</span></label>
          <input name="zone_name" className="input input-bordered input-sm" defaultValue={item?.zone_name ?? ""} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">จำนวนมิเตอร์</span></label>
            <input name="meter_count" type="number" min="0" className="input input-bordered input-sm" defaultValue={item?.meter_count ?? 0} required />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text text-xs">ครอบคลุม (%)</span></label>
            <input name="coverage_percent" type="number" min="0" max="100" step="0.1" className="input input-bordered input-sm" defaultValue={item?.coverage_percent ?? 0} required />
          </div>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">พื้นที่ให้บริการ</span></label>
          <input name="service_area" className="input input-bordered input-sm" defaultValue={item?.service_area ?? ""} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text text-xs">สถานะ</span></label>
          <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "ปกติ"}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: สร้าง page.tsx**

```typescript
// src/app/admin/water/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import DocumentToolCard from "@/components/admin/DocumentToolCard";
import { deleteWaterZone } from "./_actions";
import WaterForm from "./WaterForm";
import type { WaterSupplyZone } from "@/types/database";
import { Droplets } from "lucide-react";

const columns = [
  { key: "zone_name" as const, label: "โซน/พื้นที่" },
  {
    key: "meter_count" as const,
    label: "จำนวนมิเตอร์",
    render: (v: WaterSupplyZone[keyof WaterSupplyZone]) =>
      (v as number).toLocaleString("th-TH"),
  },
  { key: "service_area" as const, label: "พื้นที่บริการ" },
  { key: "coverage_percent" as const, label: "ครอบคลุม (%)" },
  { key: "status" as const, label: "สถานะ" },
];

const docTools = [
  {
    title: "ตอบหนังสือประชาชน",
    description: "ร่างหนังสือตอบหรือแจ้งผลการดำเนินการ",
    command: "/citizen-service",
    type: "command" as const,
  },
  {
    title: "TOR ระบบประปาอัจฉริยะ",
    description: "TOR Smart Water/Sensor ROI anti-lock-in",
    command: "smart-infrastructure skill",
    type: "skill" as const,
  },
];

export default async function WaterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user!.id).single();
  const { data, count } = await supabase
    .from("water_supply_zones").select("*", { count: "exact" }).order("zone_name");

  const totalMeters = (data ?? []).reduce((s, r) => s + (r.meter_count ?? 0), 0);

  return (
    <div>
      <Topbar title="กองประปา" />
      <div className="p-6">
        <div className="tabs tabs-border mb-6">
          <input type="radio" name="water_tabs" role="tab" className="tab" aria-label="ข้อมูล" defaultChecked />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-base-content/60">โซนทั้งหมด</p>
                      <p className="text-xl font-bold">{count ?? 0}</p>
                    </div>
                    <Droplets size={20} style={{ color: "#5CB8E4" }} />
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <p className="text-xs text-base-content/60">มิเตอร์รวม</p>
                  <p className="text-xl font-bold">{totalMeters.toLocaleString("th-TH")}</p>
                </div>
              </div>
            </div>
            <CrudTable
              data={data ?? []}
              columns={columns}
              renderForm={(item, onClose) => (
                <WaterForm item={item as WaterSupplyZone | null} onClose={onClose} />
              )}
              onDelete={deleteWaterZone}
              addLabel="เพิ่มโซนประปา"
              role={profile?.role ?? "viewer"}
            />
          </div>

          <input type="radio" name="water_tabs" role="tab" className="tab" aria-label="สร้างเอกสาร" />
          <div role="tabpanel" className="tab-content pt-6">
            <p className="text-sm text-base-content/60 mb-4">เครื่องมือสร้างเอกสารสำหรับกองประปา</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docTools.map((t) => (
                <DocumentToolCard key={t.command} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add src/app/admin/water/
git commit -m "feat: add กองประปา admin page with water supply zones CRUD"
```

---

## Task 13: Public Education Page

**Files:**
- Create: `src/app/(public)/education/page.tsx`

- [ ] **Step 1: สร้าง page.tsx**

```typescript
// src/app/(public)/education/page.tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import PageHero from "@/components/public/PageHero";
import StatCard from "@/components/public/StatCard";
import { GraduationCap } from "lucide-react";
import type { EducationFacility } from "@/types/database";
import React from "react";

const columns: {
  key: keyof EducationFacility;
  label: string;
  render?: (value: EducationFacility[keyof EducationFacility], row: EducationFacility) => React.ReactNode;
}[] = [
  { key: "name", label: "ชื่อสถานศึกษา" },
  { key: "type", label: "ประเภท" },
  { key: "tambon", label: "ตำบล" },
  {
    key: "student_count",
    label: "จำนวนนักเรียน",
    render: (v) => (v as number).toLocaleString("th-TH"),
  },
  { key: "phone", label: "โทร" },
];

export default async function EducationPublicPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("education_facilities")
    .select("*")
    .order("name");

  const totalStudents = (data ?? []).reduce((s, r) => s + (r.student_count ?? 0), 0);

  return (
    <div>
      <PageHero
        title="การศึกษา"
        description="สถานศึกษา ศูนย์เด็กเล็ก และจำนวนนักเรียนในพื้นที่เทศบาลเมืองตาคลี"
        icon={GraduationCap}
        color="#8758FF"
        breadcrumb="การศึกษา"
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="สถานศึกษาทั้งหมด" value={data?.length ?? 0} icon={GraduationCap} color="#8758FF" />
          <StatCard title="นักเรียนรวม" value={totalStudents} icon={GraduationCap} color="#5CB8E4" />
        </div>
        <DataTable
          data={data ?? []}
          columns={columns}
          emptyMessage="ยังไม่มีข้อมูลสถานศึกษา"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add "src/app/(public)/education/"
git commit -m "feat: add public education page"
```

---

## Task 14: Public Welfare Page

**Files:**
- Create: `src/app/(public)/welfare/page.tsx`

- [ ] **Step 1: สร้าง page.tsx**

```typescript
// src/app/(public)/welfare/page.tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import PageHero from "@/components/public/PageHero";
import StatCard from "@/components/public/StatCard";
import { HeartHandshake } from "lucide-react";
import type { WelfareRecipient } from "@/types/database";
import React from "react";

const columns: {
  key: keyof WelfareRecipient;
  label: string;
  render?: (value: WelfareRecipient[keyof WelfareRecipient], row: WelfareRecipient) => React.ReactNode;
}[] = [
  { key: "welfare_type", label: "ประเภทสวัสดิการ" },
  { key: "tambon", label: "ตำบล" },
  { key: "fiscal_year", label: "ปีงบประมาณ" },
  {
    key: "recipient_count",
    label: "จำนวนผู้รับ",
    render: (v) => (v as number).toLocaleString("th-TH"),
  },
];

export default async function WelfarePublicPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("welfare_recipients")
    .select("*")
    .order("fiscal_year", { ascending: false });

  const totalRecipients = (data ?? []).reduce((s, r) => s + (r.recipient_count ?? 0), 0);

  return (
    <div>
      <PageHero
        title="สวัสดิการ"
        description="ข้อมูลผู้สูงอายุ คนพิการ และผู้รับสวัสดิการในตำบลต่างๆ (แสดงข้อมูลรวม)"
        icon={HeartHandshake}
        color="#5CB8E4"
        breadcrumb="สวัสดิการ"
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="ผู้รับสวัสดิการรวม" value={totalRecipients} icon={HeartHandshake} color="#5CB8E4" />
        </div>
        <DataTable
          data={data ?? []}
          columns={columns}
          emptyMessage="ยังไม่มีข้อมูลสวัสดิการ"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add "src/app/(public)/welfare/"
git commit -m "feat: add public welfare page"
```

---

## Task 15: Public Plans Page

**Files:**
- Create: `src/app/(public)/plans/page.tsx`

- [ ] **Step 1: สร้าง page.tsx**

```typescript
// src/app/(public)/plans/page.tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import PageHero from "@/components/public/PageHero";
import StatCard from "@/components/public/StatCard";
import { Target } from "lucide-react";
import type { DevelopmentPlan } from "@/types/database";
import React from "react";

const columns: {
  key: keyof DevelopmentPlan;
  label: string;
  render?: (value: DevelopmentPlan[keyof DevelopmentPlan], row: DevelopmentPlan) => React.ReactNode;
}[] = [
  { key: "project_name", label: "ชื่อโครงการ" },
  { key: "strategy_no", label: "ยุทธศาสตร์" },
  { key: "fiscal_year", label: "ปีงบ" },
  {
    key: "budget",
    label: "งบประมาณ (บาท)",
    render: (v) => (v as number).toLocaleString("th-TH"),
  },
  { key: "status", label: "สถานะ" },
  { key: "responsible_dept", label: "กอง" },
];

export default async function PlansPublicPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("development_plans")
    .select("*")
    .order("fiscal_year", { ascending: false });

  const inProgress = (data ?? []).filter((r) => r.status === "ดำเนินการ").length;
  const totalBudget = (data ?? []).reduce((s, r) => s + (r.budget ?? 0), 0);

  return (
    <div>
      <PageHero
        title="แผนพัฒนา"
        description="โครงการและแผนยุทธศาสตร์การพัฒนาเมืองตาคลี พ.ศ. 2566-2570"
        icon={Target}
        color="#8758FF"
        breadcrumb="แผนพัฒนา"
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="โครงการทั้งหมด" value={data?.length ?? 0} icon={Target} color="#8758FF" />
          <StatCard title="กำลังดำเนินการ" value={inProgress} icon={Target} color="#5CB8E4" />
          <StatCard title="งบประมาณรวม (บาท)" value={totalBudget} icon={Target} color="#8758FF" />
        </div>
        <DataTable
          data={data ?? []}
          columns={columns}
          emptyMessage="ยังไม่มีข้อมูลแผนพัฒนา"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify + Commit**

```bash
npx tsc --noEmit 2>&1 | head -10
git add "src/app/(public)/plans/"
git commit -m "feat: add public development plans page"
```

---

## Task 16: Homepage Category Cards Update

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: เพิ่ม 3 imports และ 3 category cards ใน categories array**

เปิด `src/app/(public)/page.tsx` และแก้ไข:

1. เพิ่ม imports ใน import block:

```typescript
import { Users, Building2, Zap, Heart, MapPin, ArrowUpRight, GraduationCap, HeartHandshake, Target } from "lucide-react";
```

2. เพิ่ม 3 รายการต่อท้าย `categories` array:

```typescript
  {
    href: "/education",
    label: "การศึกษา",
    desc: "สถานศึกษา ศูนย์เด็กเล็ก และจำนวนนักเรียนในพื้นที่ตาคลี",
    color: "#8758FF",
    icon: GraduationCap,
  },
  {
    href: "/welfare",
    label: "สวัสดิการ",
    desc: "ผู้สูงอายุ คนพิการ และผู้รับสวัสดิการในตำบลต่างๆ",
    color: "#5CB8E4",
    icon: HeartHandshake,
  },
  {
    href: "/plans",
    label: "แผนพัฒนา",
    desc: "โครงการและแผนยุทธศาสตร์การพัฒนาเมืองตาคลี",
    color: "#8758FF",
    icon: Target,
  },
```

3. ปรับ grid class จาก `grid-cols-1 sm:grid-cols-2` เป็น `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` เพื่อรองรับ 7 cards:

หาบรรทัด `className="grid grid-cols-1 sm:grid-cols-2 gap-5"` และเปลี่ยนเป็น:
```typescript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(public)/page.tsx"
git commit -m "feat: add education, welfare, and plans categories to homepage"
```

---

## Verification

- [ ] **Final check: Run dev server และตรวจทุกหน้า**

```bash
npm run dev
```

ตรวจหน้าเหล่านี้:
1. `http://localhost:3000` — homepage มี 7 category cards
2. `http://localhost:3000/education` — public education page
3. `http://localhost:3000/welfare` — public welfare page
4. `http://localhost:3000/plans` — public plans page
5. `http://localhost:3000/admin/dashboard` — sidebar มี section groups
6. `http://localhost:3000/admin/finance` — tabs ทำงาน, CrudTable แสดงผล
7. `http://localhost:3000/admin/engineering` — tabs ทำงาน
8. `http://localhost:3000/admin/education` — tabs ทำงาน
9. `http://localhost:3000/admin/health` — tabs ทำงาน
10. `http://localhost:3000/admin/welfare` — tabs ทำงาน
11. `http://localhost:3000/admin/planning` — tabs ทำงาน
12. `http://localhost:3000/admin/water` — tabs ทำงาน
