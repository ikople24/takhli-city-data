# เว็ปฐานข้อมูลกลางเมืองตาคลี — Claude Instructions

## Tech Stack
- Next.js 16, App Router, TypeScript strict mode
- Tailwind CSS v4 (CSS-first, configured in globals.css) + daisyUI v5 (theme: `takhli`)
- Supabase (Database + Auth) via Supabase MCP
- lucide-react (icons), Recharts (charts), xlsx + jsPDF (export)

## Project Structure
- `src/app/(public)/` — หน้า public ไม่ต้อง login
- `src/app/admin/` — หน้า admin ต้อง login (guard ด้วย middleware)
- `src/app/auth/` — login + callback
- `src/lib/supabase/` — Supabase clients (client.ts = browser, server.ts = server)
- `src/components/public/` — components สำหรับ public
- `src/components/admin/` — components สำหรับ admin
- `src/types/database.ts` — TypeScript types สำหรับ Supabase tables

## Conventions
- ภาษาไทยทั้งหมดใน UI, labels, error messages
- ใช้ daisyUI v5 component classes: `btn`, `card`, `modal`, `table`, `badge`, `alert`, `input`, `select`
- สีหลัก: primary=#8758FF, secondary=#5CB8E4 (ในรูปแบบ oklch ใน globals.css)
- Admin sidebar background: #181818 (neutral)
- ไม่ใช้ shadcn/ui — ใช้ daisyUI เท่านั้น
- ไม่ต้องสร้าง tailwind.config.ts (Tailwind v4 ใช้ globals.css)

## Supabase MCP
- ใช้ Supabase MCP tools สำหรับทุกอย่างที่เกี่ยวกับ database (create tables, run SQL, check data)
- อย่าเขียน SQL ตรงๆ ใน code โดยไม่จำเป็น — ใช้ Supabase JS client
- ใช้ `supabase/server.ts` ใน Server Components และ Route Handlers
- ใช้ `supabase/client.ts` ใน Client Components เท่านั้น (เพราะต้องการ browser environment)

## Roles
- `super_admin`: ทุกอย่าง รวมจัดการ users
- `editor`: CRUD ข้อมูลทุกหมวด แต่ไม่จัดการ users
- `viewer`: ดูได้อย่างเดียวใน admin panel
- ตรวจ role จาก `profiles` table เสมอ ไม่ใช้จาก auth metadata

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
