# เว็ปฐานข้อมูลกลางเมืองตาคลี Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็ปฐานข้อมูลกลางเมืองตาคลี — public dashboard + admin panel สำหรับจัดการข้อมูล 4 หมวด (ประชากร, ธุรกิจ, โครงสร้างพื้นฐาน, สาธารณสุข/ศึกษา)

**Architecture:** Next.js 15 App Router, route groups `(public)` และ `admin`, middleware guard `/admin/*` → `/auth/login`, Supabase handles database + auth + RLS

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind v4, daisyUI (theme: takhli), lucide-react, Recharts, xlsx, jsPDF, @supabase/supabase-js, @supabase/ssr

---

## Phase 1: Project Bootstrap

### Task 1: Create Next.js App

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Bootstrap**

```bash
cd /Users/thanawat/Fullstack/takhli_city_data
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --yes
```

Expected: project files created, `npm run dev` works on port 3000

- [ ] **Step 2: Install dependencies**

```bash
npm install daisyui lucide-react recharts xlsx jspdf @supabase/supabase-js @supabase/ssr
npm install -D @types/jspdf
```

- [ ] **Step 3: Configure daisyUI custom theme in `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        takhli: {
          primary: "#8758FF",
          secondary: "#5CB8E4",
          accent: "#8758FF",
          neutral: "#181818",
          "base-100": "#F2F2F2",
          "base-200": "#E5E5E5",
          "base-300": "#D4D4D4",
          "base-content": "#181818",
          info: "#5CB8E4",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
    darkTheme: "takhli",
  },
};
export default config;
```

- [ ] **Step 4: Update `src/app/layout.tsx` to use theme**

```tsx
import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "ฐานข้อมูลกลางเมืองตาคลี",
  description: "ระบบฐานข้อมูลกลางของเทศบาลเมืองตาคลี จังหวัดนครสวรรค์",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-theme="takhli">
      <body className={sarabun.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Update `globals.css` — keep only Tailwind directives**

```css
@import "tailwindcss";
```

- [ ] **Step 6: Run dev server to verify theme loads**

```bash
npm run dev
```

Expected: localhost:3000 loads with #F2F2F2 background, no errors

- [ ] **Step 7: Create `.env.example`**

```bash
cat > .env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF
```

- [ ] **Step 8: Create `.gitignore` entries (add to existing)**

```
.env.local
.env.*.local
```

- [ ] **Step 9: Create `.env.local` from example (fill in later)**

```bash
cp .env.example .env.local
```

- [ ] **Step 10: Init git and push to GitHub**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js 15 + daisyUI takhli theme"
gh repo create takhli-city-data --public --source=. --remote=origin --push
```

Expected: repo visible at github.com/[username]/takhli-city-data

---

## Phase 2: Claude + MCP Config

### Task 2: CLAUDE.md + .claude config

**Files:**
- Create: `CLAUDE.md`, `.claude/settings.json`, `.claude/skills/db-migration.md`, `.claude/skills/crud-pattern.md`, `.claude/skills/export-data.md`, `.mcp.json`, `project.md`, `task.md`

- [ ] **Step 1: Create `CLAUDE.md`**

```markdown
# เว็ปฐานข้อมูลกลางเมืองตาคลี — Claude Instructions

## Tech Stack
- Next.js 15, App Router, TypeScript strict mode
- Tailwind CSS v4 + daisyUI (theme: `takhli`)
- Supabase (Database + Auth) via Supabase MCP
- lucide-react (icons), Recharts (charts), xlsx + jsPDF (export)

## Project Structure
- `src/app/(public)/` — หน้า public ไม่ต้อง login
- `src/app/admin/` — หน้า admin ต้อง login (guard ด้วย middleware)
- `src/app/auth/` — login + callback
- `src/lib/supabase/` — Supabase clients
- `src/components/public/` — components สำหรับ public
- `src/components/admin/` — components สำหรับ admin

## Conventions
- ภาษาไทยทั้งหมดใน UI, labels, error messages
- ใช้ daisyUI component classes: `btn`, `card`, `modal`, `table`, `badge`, `alert`, `input`, `select`
- สีหลัก: primary=#8758FF, secondary=#5CB8E4
- Admin sidebar background: #181818 (neutral)
- ไม่ใช้ shadcn/ui — ใช้ daisyUI เท่านั้น

## Supabase MCP
- ใช้ Supabase MCP tools สำหรับทุกอย่างที่เกี่ยวกับ database
- อย่าเขียน SQL ตรงๆ ใน code โดยไม่จำเป็น — ใช้ Supabase JS client
- ใช้ `supabase/server.ts` ใน Server Components และ Route Handlers
- ใช้ `supabase/client.ts` ใน Client Components เท่านั้น

## Roles
- `super_admin`: ทุกอย่าง รวมจัดการ users
- `editor`: CRUD ข้อมูลทุกหมวด แต่ไม่จัดการ users
- `viewer`: ดูได้อย่างเดียวใน admin panel
- ตรวจ role จาก `profiles` table เสมอ ไม่ใช่จาก auth metadata

## Database Tables
- `profiles` — extends auth.users, มี role field
- `population_data` — ข้อมูลประชากรรายตำบล
- `businesses` — สถานประกอบการ
- `infrastructure` — โครงสร้างพื้นฐาน
- `public_services` — สาธารณสุข/ศึกษา/สังคม

## Skills available
- `.claude/skills/db-migration.md` — วิธีสร้าง/แก้ไข tables ผ่าน MCP
- `.claude/skills/crud-pattern.md` — pattern สำหรับ CRUD admin pages
- `.claude/skills/export-data.md` — วิธี export Excel/PDF
```

- [ ] **Step 2: Create `.claude/settings.json`**

```json
{
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git:*)",
      "Bash(gh:*)",
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Bash(cp:*)",
      "Bash(cat:*)"
    ]
  }
}
```

- [ ] **Step 3: Create `.claude/skills/db-migration.md`**

```markdown
# Supabase DB Migration via MCP

## เมื่อต้องสร้าง/แก้ไข table

1. ใช้ Supabase MCP tool `execute_sql` เพื่อรัน SQL
2. ทำ migration ทีละขั้น อย่ารวม SQL หลาย statement ในครั้งเดียว
3. หลังจาก create table ต้องตั้ง RLS เสมอ

## RLS Pattern มาตรฐาน

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read" ON table_name FOR SELECT USING (true);

-- Editor insert/update (ตรวจ role จาก profiles)
CREATE POLICY "editor_insert" ON table_name FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'super_admin'))
  );

CREATE POLICY "editor_update" ON table_name FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor', 'super_admin'))
  );

-- Super admin delete
CREATE POLICY "admin_delete" ON table_name FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );
```

## เมื่อ add column

```sql
ALTER TABLE table_name ADD COLUMN column_name TYPE;
```
```

- [ ] **Step 4: Create `.claude/skills/crud-pattern.md`**

```markdown
# Admin CRUD Page Pattern

## โครงสร้าง page

```tsx
// src/app/admin/[module]/page.tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/admin/DataTable";
import { columns } from "./_columns";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("table_name").select("*").order("updated_at", { ascending: false });
  return <DataTable data={data ?? []} columns={columns} addLabel="เพิ่มรายการ" />;
}
```

## DataTable props
- `data`: T[] — ข้อมูลจาก Supabase
- `columns`: ColumnDef[] — กำหนด columns + render
- `addLabel`: string — label ปุ่มเพิ่ม
- DataTable จัดการ modal add/edit/delete ภายใน

## Server Actions pattern (ใน `_actions.ts`)

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertRecord(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = { /* fields */ };
  if (id) {
    await supabase.from("table_name").update(payload).eq("id", id);
  } else {
    await supabase.from("table_name").insert(payload);
  }
  revalidatePath("/admin/module");
}

export async function deleteRecord(id: string) {
  const supabase = await createClient();
  await supabase.from("table_name").delete().eq("id", id);
  revalidatePath("/admin/module");
}
```
```

- [ ] **Step 5: Create `.claude/skills/export-data.md`**

```markdown
# Export Data Pattern

## Excel (xlsx)

```ts
import * as XLSX from "xlsx";

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ข้อมูล");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
```

## PDF (jsPDF)

```ts
import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportToPDF(headers: string[], rows: string[][], filename: string) {
  const doc = new jsPDF();
  doc.text(filename, 14, 20);
  (doc as any).autoTable({ head: [headers], body: rows, startY: 30 });
  doc.save(`${filename}.pdf`);
}
```

## CSV

```ts
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(r => Object.values(r).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; a.click();
}
```
```

- [ ] **Step 6: Create `.mcp.json`**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "${SUPABASE_ACCESS_TOKEN}"]
    }
  }
}
```

- [ ] **Step 7: Create `project.md`**

```markdown
# เว็ปฐานข้อมูลกลางเมืองตาคลี — Project Overview

## ลิงก์สำคัญ
- **GitHub:** https://github.com/[username]/takhli-city-data
- **Vercel:** (เชื่อมต่อหลัง deploy)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[project-id]

## สีประจำเทศบาล
- Primary: #8758FF
- Secondary: #5CB8E4
- Dark: #181818
- Light: #F2F2F2

## Tables
| Table | คำอธิบาย |
|-------|---------|
| profiles | ผู้ใช้งานระบบ (extends auth.users) |
| population_data | ข้อมูลประชากรรายตำบล |
| businesses | สถานประกอบการ/ธุรกิจ |
| infrastructure | โครงสร้างพื้นฐาน |
| public_services | สาธารณสุข/ศึกษา/สังคม |

## Env Variables ที่ต้องตั้งใน Vercel
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Connect Vercel
1. Push code ขึ้น GitHub
2. ไปที่ vercel.com → New Project → Import `takhli-city-data`
3. ตั้ง env vars จาก Supabase dashboard
4. Deploy
```

- [ ] **Step 8: Create `task.md`**

```markdown
# Task Tracking — เว็ปฐานข้อมูลกลางเมืองตาคลี

## กำลังทำ
- (ว่าง)

## รอทำ
- [ ] เชื่อมต่อ Vercel
- [ ] ใส่ข้อมูลจริงลง Supabase

## เสร็จแล้ว
- [x] Bootstrap Next.js 15
- [x] ตั้ง daisyUI custom theme
- [x] Claude config + MCP config
```

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add Claude config, MCP, project docs, and custom skills"
git push
```

---

## Phase 3: Supabase Setup

### Task 3: Create Tables + RLS via MCP

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/types/database.ts`

> ขั้นตอนนี้ต้องมี Supabase project ID และ access token พร้อม
> ใช้ Supabase MCP tool `execute_sql` สำหรับทุก SQL ด้านล่าง

- [ ] **Step 1: Create `profiles` table**

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('super_admin', 'editor', 'viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_read_all" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "admin_update_all" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
```

- [ ] **Step 2: Create auto-create profile trigger**

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

- [ ] **Step 3: Create `population_data` table**

```sql
CREATE TABLE population_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  total_population INT DEFAULT 0,
  male INT DEFAULT 0,
  female INT DEFAULT 0,
  age_0_14 INT DEFAULT 0,
  age_15_59 INT DEFAULT 0,
  age_60_plus INT DEFAULT 0,
  households INT DEFAULT 0,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);
ALTER TABLE population_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON population_data FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON population_data FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON population_data FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON population_data FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
```

- [ ] **Step 4: Create `businesses` table**

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('ร้านค้า','โรงงาน','บริการ','เกษตร','อื่นๆ')) DEFAULT 'อื่นๆ',
  address TEXT,
  area_name TEXT,
  lat FLOAT,
  lng FLOAT,
  employees INT DEFAULT 0,
  status TEXT CHECK (status IN ('active','inactive')) DEFAULT 'active',
  registered_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON businesses FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON businesses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON businesses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON businesses FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
```

- [ ] **Step 5: Create `infrastructure` table**

```sql
CREATE TABLE infrastructure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ถนน','ไฟฟ้า','ประปา','อินเทอร์เน็ต','อื่นๆ')) DEFAULT 'อื่นๆ',
  area_name TEXT,
  status TEXT CHECK (status IN ('ดี','ปานกลาง','ต้องซ่อม')) DEFAULT 'ดี',
  description TEXT,
  coverage_km FLOAT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON infrastructure FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON infrastructure FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON infrastructure FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON infrastructure FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
```

- [ ] **Step 6: Create `public_services` table**

```sql
CREATE TABLE public_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('โรงพยาบาล','โรงเรียน','วัด','สถานีตำรวจ','อื่นๆ')) DEFAULT 'อื่นๆ',
  address TEXT,
  area_name TEXT,
  lat FLOAT,
  lng FLOAT,
  phone TEXT,
  capacity INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON public_services FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON public_services FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON public_services FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON public_services FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
```

- [ ] **Step 7: Create `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 8: Create `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

- [ ] **Step 9: Create `src/types/database.ts`**

```ts
export type Role = "super_admin" | "editor" | "viewer";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface PopulationData {
  id: string;
  area_name: string;
  total_population: number;
  male: number;
  female: number;
  age_0_14: number;
  age_15_59: number;
  age_60_plus: number;
  households: number;
  year: number;
  updated_at: string;
  updated_by: string | null;
}

export interface Business {
  id: string;
  name: string;
  category: "ร้านค้า" | "โรงงาน" | "บริการ" | "เกษตร" | "อื่นๆ";
  address: string | null;
  area_name: string | null;
  lat: number | null;
  lng: number | null;
  employees: number;
  status: "active" | "inactive";
  registered_date: string | null;
  updated_at: string;
}

export interface Infrastructure {
  id: string;
  name: string;
  type: "ถนน" | "ไฟฟ้า" | "ประปา" | "อินเทอร์เน็ต" | "อื่นๆ";
  area_name: string | null;
  status: "ดี" | "ปานกลาง" | "ต้องซ่อม";
  description: string | null;
  coverage_km: number;
  updated_at: string;
}

export interface PublicService {
  id: string;
  name: string;
  type: "โรงพยาบาล" | "โรงเรียน" | "วัด" | "สถานีตำรวจ" | "อื่นๆ";
  address: string | null;
  area_name: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  capacity: number;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at">; Update: Partial<Profile> };
      population_data: { Row: PopulationData; Insert: Omit<PopulationData, "id" | "updated_at">; Update: Partial<PopulationData> };
      businesses: { Row: Business; Insert: Omit<Business, "id" | "updated_at">; Update: Partial<Business> };
      infrastructure: { Row: Infrastructure; Insert: Omit<Infrastructure, "id" | "updated_at">; Update: Partial<Infrastructure> };
      public_services: { Row: PublicService; Insert: Omit<PublicService, "id" | "updated_at">; Update: Partial<PublicService> };
    };
  };
};
```

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: add Supabase clients, TypeScript types, and database schema"
git push
```

---

## Phase 4: Middleware & Auth

### Task 4: Route Guard + Login Page

**Files:**
- Create: `src/middleware.ts`, `src/app/auth/login/page.tsx`, `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create `src/middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Create `src/app/auth/login/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#181818" }}>
      <div className="card w-96 bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: "#8758FF" }}>
              <span className="text-white text-2xl font-bold">ต</span>
            </div>
            <h1 className="text-xl font-bold">ฐานข้อมูลกลางเมืองตาคลี</h1>
            <p className="text-sm text-base-content/60">เข้าสู่ระบบเจ้าหน้าที่</p>
          </div>
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">อีเมล</span></label>
              <input type="email" className="input input-bordered" value={email}
                onChange={e => setEmail(e.target.value)} required placeholder="admin@takhli.go.th" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">รหัสผ่าน</span></label>
              <input type="password" className="input input-bordered" value={password}
                onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/auth/callback/route.ts`**

```ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(`${origin}/admin/dashboard`);
}
```

- [ ] **Step 4: Verify middleware works**

```bash
npm run dev
# เปิด http://localhost:3000/admin/dashboard
# ต้อง redirect ไป /auth/login
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add auth middleware, login page, and callback route"
git push
```

---

## Phase 5: Public Frontend

### Task 5: Public Layout + Components

**Files:**
- Create: `src/app/(public)/layout.tsx`, `src/components/public/Navbar.tsx`, `src/components/public/Footer.tsx`, `src/components/public/StatCard.tsx`, `src/components/public/DataTable.tsx`

- [ ] **Step 1: Create `src/components/public/Navbar.tsx`**

```tsx
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#8758FF" }}>ต</div>
          <span className="font-semibold text-sm hidden sm:block">ฐานข้อมูลกลางเมืองตาคลี</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">
          {navLinks.map(l => (
            <li key={l.href}><Link href={l.href} className="rounded-lg text-sm">{l.label}</Link></li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/auth/login" className="btn btn-primary btn-sm">เข้าสู่ระบบ</Link>
        <div className="dropdown dropdown-end lg:hidden">
          <button className="btn btn-ghost btn-sm">☰</button>
          <ul className="dropdown-content menu bg-base-100 rounded-box shadow-lg w-48 z-50">
            {navLinks.map(l => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/public/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-neutral text-neutral-content mt-auto">
      <p className="text-sm opacity-70">© 2024 เทศบาลเมืองตาคลี จังหวัดนครสวรรค์</p>
    </footer>
  );
}
```

- [ ] **Step 3: Create `src/components/public/StatCard.tsx`**

```tsx
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = "#8758FF" }: StatCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">{title}</p>
            <p className="text-2xl font-bold mt-1">{typeof value === "number" ? value.toLocaleString("th-TH") : value}</p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center opacity-90" style={{ background: color + "20" }}>
            <Icon size={24} style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/public/DataTable.tsx`**

```tsx
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({ data, columns, emptyMessage = "ไม่มีข้อมูล" }: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="text-center py-12 text-base-content/50">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-base-300">
      <table className="table table-zebra">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className="bg-base-200">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={String(col.key)}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/(public)/layout.tsx`**

```tsx
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add public layout, navbar, footer, and shared components"
git push
```

### Task 6: Homepage + Public Data Pages

**Files:**
- Create: `src/app/(public)/page.tsx`, `src/app/(public)/population/page.tsx`, `src/app/(public)/business/page.tsx`, `src/app/(public)/infrastructure/page.tsx`, `src/app/(public)/services/page.tsx`

- [ ] **Step 1: Create `src/app/(public)/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { Users, Building2, Zap, Heart } from "lucide-react";
import StatCard from "@/components/public/StatCard";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const [pop, biz, infra, svc] = await Promise.all([
    supabase.from("population_data").select("total_population").then(r => r.data?.reduce((s, d) => s + (d.total_population ?? 0), 0) ?? 0),
    supabase.from("businesses").select("id", { count: "exact" }).then(r => r.count ?? 0),
    supabase.from("infrastructure").select("id", { count: "exact" }).then(r => r.count ?? 0),
    supabase.from("public_services").select("id", { count: "exact" }).then(r => r.count ?? 0),
  ]);

  const categories = [
    { href: "/population", label: "ข้อมูลประชากร", desc: "จำนวนประชากร, ครัวเรือน, การศึกษา", color: "#8758FF" },
    { href: "/business", label: "สถานประกอบการ", desc: "ร้านค้า, โรงงาน, ธุรกิจในพื้นที่", color: "#5CB8E4" },
    { href: "/infrastructure", label: "โครงสร้างพื้นฐาน", desc: "ถนน, ไฟฟ้า, ประปา, อินเทอร์เน็ต", color: "#8758FF" },
    { href: "/services", label: "บริการสาธารณะ", desc: "โรงพยาบาล, โรงเรียน, วัด, ตำรวจ", color: "#5CB8E4" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 text-center" style={{ background: "linear-gradient(135deg, #8758FF15, #5CB8E415)" }}>
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">ฐานข้อมูลกลางเมืองตาคลี</h1>
        <p className="text-base-content/60 max-w-xl mx-auto">ระบบรวบรวมข้อมูลสำคัญของเทศบาลเมืองตาคลี จังหวัดนครสวรรค์</p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard title="ประชากรทั้งหมด" value={pop} icon={Users} color="#8758FF" />
        <StatCard title="สถานประกอบการ" value={biz} icon={Building2} color="#5CB8E4" />
        <StatCard title="โครงสร้างพื้นฐาน" value={infra} icon={Zap} color="#8758FF" />
        <StatCard title="บริการสาธารณะ" value={svc} icon={Heart} color="#5CB8E4" />
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categories.map(cat => (
          <Link key={cat.href} href={cat.href} className="card bg-base-100 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="card-body">
              <h2 className="card-title text-lg" style={{ color: cat.color }}>{cat.label}</h2>
              <p className="text-sm text-base-content/60">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/(public)/population/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";
import type { PopulationData } from "@/types/database";

const columns = [
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "total_population" as const, label: "ประชากรรวม", render: (v: PopulationData["total_population"]) => v?.toLocaleString("th-TH") },
  { key: "male" as const, label: "ชาย", render: (v: PopulationData["male"]) => v?.toLocaleString("th-TH") },
  { key: "female" as const, label: "หญิง", render: (v: PopulationData["female"]) => v?.toLocaleString("th-TH") },
  { key: "households" as const, label: "ครัวเรือน", render: (v: PopulationData["households"]) => v?.toLocaleString("th-TH") },
  { key: "year" as const, label: "ปี" },
];

export default async function PopulationPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("population_data").select("*").order("area_name");
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ข้อมูลประชากร</h1>
      <DataTable data={data ?? []} columns={columns} emptyMessage="ยังไม่มีข้อมูลประชากร" />
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/(public)/business/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";

const columns = [
  { key: "name" as const, label: "ชื่อสถานประกอบการ" },
  { key: "category" as const, label: "ประเภท", render: (v: string) => <span className="badge badge-outline">{v}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "employees" as const, label: "พนักงาน" },
  { key: "status" as const, label: "สถานะ", render: (v: string) => (
    <span className={`badge ${v === "active" ? "badge-success" : "badge-error"} badge-sm`}>
      {v === "active" ? "ดำเนินการ" : "ปิดกิจการ"}
    </span>
  )},
];

export default async function BusinessPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("businesses").select("*").order("name");
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">สถานประกอบการและธุรกิจ</h1>
      <DataTable data={data ?? []} columns={columns} emptyMessage="ยังไม่มีข้อมูลสถานประกอบการ" />
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/(public)/infrastructure/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";

const statusColor: Record<string, string> = { "ดี": "badge-success", "ปานกลาง": "badge-warning", "ต้องซ่อม": "badge-error" };

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท", render: (v: string) => <span className="badge badge-outline">{v}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "status" as const, label: "สภาพ", render: (v: string) => <span className={`badge badge-sm ${statusColor[v] ?? ""}`}>{v}</span> },
  { key: "coverage_km" as const, label: "ระยะทาง (กม.)" },
];

export default async function InfrastructurePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("infrastructure").select("*").order("type");
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">โครงสร้างพื้นฐาน</h1>
      <DataTable data={data ?? []} columns={columns} emptyMessage="ยังไม่มีข้อมูลโครงสร้างพื้นฐาน" />
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/(public)/services/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/public/DataTable";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "type" as const, label: "ประเภท", render: (v: string) => <span className="badge badge-outline">{v}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "phone" as const, label: "โทรศัพท์" },
  { key: "capacity" as const, label: "ความจุ" },
];

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("public_services").select("*").order("type");
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">บริการสาธารณะ</h1>
      <DataTable data={data ?? []} columns={columns} emptyMessage="ยังไม่มีข้อมูลบริการสาธารณะ" />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add public homepage and data pages (population, business, infrastructure, services)"
git push
```

---

## Phase 6: Admin Frontend

### Task 7: Admin Layout + Sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/components/admin/Sidebar.tsx`, `src/components/admin/Topbar.tsx`

- [ ] **Step 1: Create `src/components/admin/Sidebar.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Zap, Heart, UserCog, Download } from "lucide-react";

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
    <aside className="w-60 min-h-screen flex flex-col py-6 px-3" style={{ background: "#181818" }}>
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#8758FF" }}>ต</div>
        <span className="text-white font-semibold text-sm">ระบบจัดการข้อมูล</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={active ? { background: "#8758FF" } : {}}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3">
        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">← กลับหน้าเว็บ</Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/Topbar.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function Topbar({ title }: { title: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-6">
      <h1 className="font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-base-content/60">{user?.email}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `src/components/admin/LogoutButton.tsx`**

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }
  return (
    <button onClick={handleLogout} className="btn btn-ghost btn-sm gap-1">
      <LogOut size={14} /> ออกจากระบบ
    </button>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/layout.tsx`**

```tsx
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-base-200 min-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add admin layout with dark sidebar and topbar"
git push
```

### Task 8: Admin Dashboard

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`, `src/components/admin/charts/BarChart.tsx`, `src/components/admin/charts/PieChart.tsx`

- [ ] **Step 1: Create `src/components/admin/charts/BarChart.tsx`**

```tsx
"use client";
import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
}

export default function BarChart({ data, color = "#8758FF" }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsBar data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v: number) => v.toLocaleString("th-TH")} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/charts/PieChart.tsx`**

```tsx
"use client";
import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8758FF", "#5CB8E4", "#36d399", "#fbbd23", "#f87272"];

interface PieChartProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsPie>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v: number) => v.toLocaleString("th-TH")} />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 3: Create `src/app/admin/dashboard/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import BarChart from "@/components/admin/charts/BarChart";
import PieChart from "@/components/admin/charts/PieChart";
import { Users, Building2, Zap, Heart } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [popData, bizData, infraData, svcData] = await Promise.all([
    supabase.from("population_data").select("area_name, total_population"),
    supabase.from("businesses").select("category"),
    supabase.from("infrastructure").select("status"),
    supabase.from("public_services").select("type"),
  ]);

  const popChart = (popData.data ?? []).map(d => ({ name: d.area_name, value: d.total_population ?? 0 }));
  const bizByCategory = Object.entries(
    (bizData.data ?? []).reduce((acc, d) => ({ ...acc, [d.category]: (acc[d.category] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  const infraByStatus = Object.entries(
    (infraData.data ?? []).reduce((acc, d) => ({ ...acc, [d.status]: (acc[d.status] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  const svcByType = Object.entries(
    (svcData.data ?? []).reduce((acc, d) => ({ ...acc, [d.type]: (acc[d.type] ?? 0) + 1 }), {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: "ประชากรรวม", value: popChart.reduce((s, d) => s + d.value, 0).toLocaleString("th-TH"), icon: Users, color: "#8758FF" },
    { label: "สถานประกอบการ", value: bizData.data?.length ?? 0, icon: Building2, color: "#5CB8E4" },
    { label: "โครงสร้างพื้นฐาน", value: infraData.data?.length ?? 0, icon: Zap, color: "#8758FF" },
    { label: "บริการสาธารณะ", value: svcData.data?.length ?? 0, icon: Heart, color: "#5CB8E4" },
  ];

  return (
    <div>
      <Topbar title="ภาพรวมข้อมูล" />
      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-base-content/60">{s.label}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                  </div>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm">ประชากรรายพื้นที่</h2>
              <BarChart data={popChart} color="#8758FF" />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm">ธุรกิจตามประเภท</h2>
              <PieChart data={bizByCategory} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm">สภาพโครงสร้างพื้นฐาน</h2>
              <PieChart data={infraByStatus} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-sm">บริการสาธารณะตามประเภท</h2>
              <BarChart data={svcByType} color="#5CB8E4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin dashboard with stat cards and Recharts charts"
git push
```

### Task 9: Admin CRUD Pages (Population, Business, Infrastructure, Services)

**Files:**
- Create: `src/app/admin/population/page.tsx`, `src/app/admin/population/_actions.ts`
- Create: `src/app/admin/business/page.tsx`, `src/app/admin/business/_actions.ts`
- Create: `src/app/admin/infrastructure/page.tsx`, `src/app/admin/infrastructure/_actions.ts`
- Create: `src/app/admin/services/page.tsx`, `src/app/admin/services/_actions.ts`
- Create: `src/components/admin/CrudTable.tsx`

- [ ] **Step 1: Create `src/components/admin/CrudTable.tsx`**

```tsx
"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface CrudTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  renderForm: (item: T | null, onClose: () => void) => React.ReactNode;
  onDelete: (id: string) => Promise<void>;
  addLabel?: string;
  role: string;
}

export default function CrudTable<T extends { id: string }>({
  data, columns, renderForm, onDelete, addLabel = "เพิ่มรายการ", role
}: CrudTableProps<T>) {
  const [editing, setEditing] = useState<T | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  const canEdit = role === "editor" || role === "super_admin";
  const canDelete = role === "super_admin";

  return (
    <div>
      {canEdit && (
        <button className="btn btn-primary btn-sm mb-4 gap-1" onClick={() => setEditing(null)}>
          <Plus size={14} /> {addLabel}
        </button>
      )}
      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table table-zebra">
          <thead>
            <tr>
              {columns.map(col => <th key={String(col.key)} className="bg-base-200">{col.label}</th>)}
              {canEdit && <th className="bg-base-200">จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="text-center py-8 text-base-content/50">ไม่มีข้อมูล</td></tr>
            )}
            {data.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "-")}
                  </td>
                ))}
                {canEdit && (
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" onClick={() => setEditing(row)}><Pencil size={12} /></button>
                      {canDelete && (
                        <button className="btn btn-ghost btn-xs text-error" onClick={() => setDeleting(row.id)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {editing !== undefined && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            {renderForm(editing, () => setEditing(undefined))}
          </div>
          <div className="modal-backdrop" onClick={() => setEditing(undefined)} />
        </dialog>
      )}

      {/* Delete Confirm Modal */}
      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ยืนยันการลบ</h3>
            <p className="py-4">คุณต้องการลบรายการนี้ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeleting(null)}>ยกเลิก</button>
              <button className="btn btn-error" onClick={async () => { await onDelete(deleting); setDeleting(null); }}>ลบ</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleting(null)} />
        </dialog>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/admin/population/_actions.ts`**

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertPopulation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    area_name: formData.get("area_name") as string,
    total_population: Number(formData.get("total_population")),
    male: Number(formData.get("male")),
    female: Number(formData.get("female")),
    age_0_14: Number(formData.get("age_0_14")),
    age_15_59: Number(formData.get("age_15_59")),
    age_60_plus: Number(formData.get("age_60_plus")),
    households: Number(formData.get("households")),
    year: Number(formData.get("year")),
  };
  if (id) {
    await supabase.from("population_data").update(payload).eq("id", id);
  } else {
    await supabase.from("population_data").insert(payload);
  }
  revalidatePath("/admin/population");
}

export async function deletePopulation(id: string) {
  const supabase = await createClient();
  await supabase.from("population_data").delete().eq("id", id);
  revalidatePath("/admin/population");
}
```

- [ ] **Step 3: Create `src/app/admin/population/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { upsertPopulation, deletePopulation } from "./_actions";
import type { PopulationData } from "@/types/database";

const columns = [
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "total_population" as const, label: "ประชากรรวม", render: (v: number) => v?.toLocaleString("th-TH") },
  { key: "male" as const, label: "ชาย" },
  { key: "female" as const, label: "หญิง" },
  { key: "households" as const, label: "ครัวเรือน" },
  { key: "year" as const, label: "ปี" },
];

function PopulationForm({ item, onClose }: { item: PopulationData | null; onClose: () => void }) {
  return (
    <form action={async (fd) => { await upsertPopulation(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">{item ? "แก้ไขข้อมูลประชากร" : "เพิ่มข้อมูลประชากร"}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 form-control">
          <label className="label text-xs">พื้นที่ (ตำบล/หมู่บ้าน)</label>
          <input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name} required />
        </div>
        {[["total_population","ประชากรรวม"],["male","ชาย"],["female","หญิง"],["age_0_14","อายุ 0-14"],["age_15_59","อายุ 15-59"],["age_60_plus","อายุ 60+"],["households","ครัวเรือน"],["year","ปี"]].map(([name, label]) => (
          <div key={name} className="form-control">
            <label className="label text-xs">{label}</label>
            <input name={name} type="number" className="input input-bordered input-sm" defaultValue={(item as Record<string,unknown>)?.[name] as number ?? ""} required />
          </div>
        ))}
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}

export default async function PopulationAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("population_data").select("*").order("area_name");

  return (
    <div>
      <Topbar title="ข้อมูลประชากร" />
      <div className="p-6">
        <CrudTable
          data={data ?? []}
          columns={columns}
          renderForm={(item, onClose) => <PopulationForm item={item as PopulationData | null} onClose={onClose} />}
          onDelete={deletePopulation}
          addLabel="เพิ่มข้อมูลประชากร"
          role={profile?.role ?? "viewer"}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/business/_actions.ts`**

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertBusiness(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    address: formData.get("address") as string,
    area_name: formData.get("area_name") as string,
    employees: Number(formData.get("employees")),
    status: formData.get("status") as string,
    registered_date: formData.get("registered_date") as string || null,
  };
  if (id) {
    await supabase.from("businesses").update(payload).eq("id", id);
  } else {
    await supabase.from("businesses").insert(payload);
  }
  revalidatePath("/admin/business");
}

export async function deleteBusiness(id: string) {
  const supabase = await createClient();
  await supabase.from("businesses").delete().eq("id", id);
  revalidatePath("/admin/business");
}
```

- [ ] **Step 5: Create `src/app/admin/business/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { upsertBusiness, deleteBusiness } from "./_actions";
import type { Business } from "@/types/database";

const columns = [
  { key: "name" as const, label: "ชื่อ" },
  { key: "category" as const, label: "ประเภท", render: (v: string) => <span className="badge badge-outline badge-sm">{v}</span> },
  { key: "area_name" as const, label: "พื้นที่" },
  { key: "employees" as const, label: "พนักงาน" },
  { key: "status" as const, label: "สถานะ", render: (v: string) => <span className={`badge badge-sm ${v === "active" ? "badge-success" : "badge-error"}`}>{v === "active" ? "ดำเนินการ" : "ปิด"}</span> },
];

function BusinessForm({ item, onClose }: { item: Business | null; onClose: () => void }) {
  return (
    <form action={async (fd) => { await upsertBusiness(fd); onClose(); }}>
      {item && <input type="hidden" name="id" value={item.id} />}
      <h3 className="font-bold text-lg mb-4">{item ? "แก้ไขสถานประกอบการ" : "เพิ่มสถานประกอบการ"}</h3>
      <div className="space-y-3">
        <div className="form-control"><label className="label text-xs">ชื่อ</label><input name="name" className="input input-bordered input-sm" defaultValue={item?.name} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label text-xs">ประเภท</label>
            <select name="category" className="select select-bordered select-sm" defaultValue={item?.category ?? "อื่นๆ"}>
              {["ร้านค้า","โรงงาน","บริการ","เกษตร","อื่นๆ"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label text-xs">สถานะ</label>
            <select name="status" className="select select-bordered select-sm" defaultValue={item?.status ?? "active"}>
              <option value="active">ดำเนินการ</option>
              <option value="inactive">ปิดกิจการ</option>
            </select>
          </div>
        </div>
        <div className="form-control"><label className="label text-xs">พื้นที่</label><input name="area_name" className="input input-bordered input-sm" defaultValue={item?.area_name ?? ""} /></div>
        <div className="form-control"><label className="label text-xs">ที่อยู่</label><input name="address" className="input input-bordered input-sm" defaultValue={item?.address ?? ""} /></div>
        <div className="form-control"><label className="label text-xs">จำนวนพนักงาน</label><input name="employees" type="number" className="input input-bordered input-sm" defaultValue={item?.employees ?? 0} /></div>
        <div className="form-control"><label className="label text-xs">วันที่จดทะเบียน</label><input name="registered_date" type="date" className="input input-bordered input-sm" defaultValue={item?.registered_date ?? ""} /></div>
      </div>
      <div className="modal-action mt-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>ยกเลิก</button>
        <button type="submit" className="btn btn-primary btn-sm">บันทึก</button>
      </div>
    </form>
  );
}

export default async function BusinessAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("businesses").select("*").order("name");
  return (
    <div>
      <Topbar title="สถานประกอบการและธุรกิจ" />
      <div className="p-6">
        <CrudTable data={data ?? []} columns={columns}
          renderForm={(item, onClose) => <BusinessForm item={item as Business | null} onClose={onClose} />}
          onDelete={deleteBusiness} addLabel="เพิ่มสถานประกอบการ" role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create infrastructure + services pages** (ใช้ pattern เดียวกับ business)

สร้าง `src/app/admin/infrastructure/_actions.ts`:
```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertInfrastructure(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
    area_name: formData.get("area_name") as string,
    status: formData.get("status") as string,
    description: formData.get("description") as string,
    coverage_km: Number(formData.get("coverage_km")),
  };
  if (id) { await supabase.from("infrastructure").update(payload).eq("id", id); }
  else { await supabase.from("infrastructure").insert(payload); }
  revalidatePath("/admin/infrastructure");
}

export async function deleteInfrastructure(id: string) {
  const supabase = await createClient();
  await supabase.from("infrastructure").delete().eq("id", id);
  revalidatePath("/admin/infrastructure");
}
```

สร้าง `src/app/admin/infrastructure/page.tsx` — ใช้ pattern เดียวกับ business page แต่ fields: name, type (ถนน/ไฟฟ้า/ประปา/อินเทอร์เน็ต/อื่นๆ), area_name, status (ดี/ปานกลาง/ต้องซ่อม), description, coverage_km

สร้าง `src/app/admin/services/_actions.ts` — เหมือน pattern ด้านบน สำหรับ table `public_services`

สร้าง `src/app/admin/services/page.tsx` — fields: name, type (โรงพยาบาล/โรงเรียน/วัด/สถานีตำรวจ/อื่นๆ), address, area_name, phone, capacity

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add admin CRUD pages for all data categories"
git push
```

### Task 10: Admin Users + Export Pages

**Files:**
- Create: `src/app/admin/users/page.tsx`, `src/app/admin/users/_actions.ts`
- Create: `src/app/admin/export/page.tsx`, `src/lib/utils/export.ts`

- [ ] **Step 1: Create `src/lib/utils/export.ts`**

```ts
import * as XLSX from "xlsx";

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ข้อมูล");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(r => Object.values(r).map(v => `"${String(v ?? "")}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Create `src/app/admin/users/_actions.ts`**

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/users");
}
```

- [ ] **Step 3: Create `src/app/admin/users/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Topbar from "@/components/admin/Topbar";
import { updateUserRole } from "./_actions";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  if (profile?.role !== "super_admin") redirect("/admin/dashboard");

  const { data: users } = await supabase.from("profiles").select("*").order("created_at");

  return (
    <div>
      <Topbar title="จัดการผู้ใช้งาน" />
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-base-300">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="bg-base-200">ชื่อ</th>
                <th className="bg-base-200">ID</th>
                <th className="bg-base-200">สิทธิ์</th>
                <th className="bg-base-200">เข้าร่วมเมื่อ</th>
                <th className="bg-base-200">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map(u => (
                <tr key={u.id}>
                  <td>{u.full_name ?? "-"}</td>
                  <td className="text-xs text-base-content/50 font-mono">{u.id.slice(0, 8)}...</td>
                  <td>
                    <span className={`badge badge-sm ${u.role === "super_admin" ? "badge-primary" : u.role === "editor" ? "badge-secondary" : "badge-ghost"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="text-sm">{new Date(u.created_at).toLocaleDateString("th-TH")}</td>
                  <td>
                    <form action={async (fd) => { "use server"; await updateUserRole(u.id, fd.get("role") as string); }}>
                      <div className="flex gap-2 items-center">
                        <select name="role" defaultValue={u.role} className="select select-bordered select-xs">
                          <option value="viewer">viewer</option>
                          <option value="editor">editor</option>
                          <option value="super_admin">super_admin</option>
                        </select>
                        <button type="submit" className="btn btn-primary btn-xs">บันทึก</button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/export/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { exportToExcel, exportToCSV } from "@/lib/utils/export";
import { Download } from "lucide-react";

const tables = [
  { key: "population_data", label: "ข้อมูลประชากร" },
  { key: "businesses", label: "สถานประกอบการ" },
  { key: "infrastructure", label: "โครงสร้างพื้นฐาน" },
  { key: "public_services", label: "บริการสาธารณะ" },
];

export default function ExportPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  async function handleExport(table: string, label: string, format: "xlsx" | "csv") {
    setLoading(`${table}-${format}`);
    const { data } = await supabase.from(table as "population_data").select("*");
    if (data && data.length > 0) {
      const filename = `${label}-${new Date().toLocaleDateString("th-TH").replace(/\//g, "-")}`;
      if (format === "xlsx") exportToExcel(data as Record<string, unknown>[], filename);
      else exportToCSV(data as Record<string, unknown>[], filename);
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="h-14 bg-base-100 border-b border-base-300 flex items-center px-6">
        <h1 className="font-semibold">Export ข้อมูล</h1>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tables.map(t => (
            <div key={t.key} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">{t.label}</h2>
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-outline btn-sm gap-1"
                    onClick={() => handleExport(t.key, t.label, "xlsx")}
                    disabled={loading === `${t.key}-xlsx`}>
                    {loading === `${t.key}-xlsx` ? <span className="loading loading-spinner loading-xs" /> : <Download size={12} />}
                    Excel
                  </button>
                  <button className="btn btn-outline btn-sm gap-1"
                    onClick={() => handleExport(t.key, t.label, "csv")}
                    disabled={loading === `${t.key}-csv`}>
                    {loading === `${t.key}-csv` ? <span className="loading loading-spinner loading-xs" /> : <Download size={12} />}
                    CSV
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add admin users management and data export page"
git push
```

---

## Phase 7: GitHub + Vercel Prep

### Task 11: Vercel Config + Final Docs

**Files:**
- Create: `vercel.json`, `docs/superpowers/specs/2026-06-06-takhli-city-data-design.md`
- Modify: `project.md`, `task.md`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

- [ ] **Step 2: Final build check**

```bash
npm run build
```

Expected: ✓ Compiled successfully, no TypeScript errors

- [ ] **Step 3: Update `task.md`**

```markdown
# Task Tracking — เว็ปฐานข้อมูลกลางเมืองตาคลี

## กำลังทำ
- (ว่าง)

## รอทำ
- [ ] เชื่อมต่อ Vercel: vercel.com → New Project → Import takhli-city-data → ตั้ง env vars
- [ ] ใส่ข้อมูลจริงลง Supabase ผ่าน admin panel
- [ ] สร้าง super_admin user แรกใน Supabase Auth dashboard

## เสร็จแล้ว
- [x] Bootstrap Next.js 15 + daisyUI custom theme takhli
- [x] Claude config + MCP config + custom skills
- [x] Supabase schema (5 tables + RLS)
- [x] Auth middleware + login page
- [x] Public frontend (homepage + 4 data pages)
- [x] Admin dashboard + charts
- [x] Admin CRUD pages (population, business, infrastructure, services)
- [x] Admin users management
- [x] Export Excel/CSV
- [x] Vercel config
- [x] Push to GitHub
```

- [ ] **Step 4: Final push**

```bash
git add .
git commit -m "feat: add vercel config, finalize docs, project ready for deployment"
git push
```

---

## Verification Checklist

- [ ] `npm run build` — ผ่าน ไม่มี TypeScript errors
- [ ] `npm run dev` — localhost:3000 แสดงหน้าแรก theme สีม่วง-ฟ้าถูกต้อง
- [ ] `/auth/login` — login form แสดงถูกต้อง
- [ ] `/admin/dashboard` โดยไม่ login — redirect ไป `/auth/login`
- [ ] Supabase tables ครบ 5 tables + RLS ตั้งแล้ว
- [ ] GitHub repo ไม่มี `.env.local` ใน commits
- [ ] `vercel.json` + `project.md` มีขั้นตอน connect Vercel ครบ
