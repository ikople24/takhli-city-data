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

### Dev Skills (Web App)
- `.claude/skills/db-migration.md` — วิธีสร้าง/แก้ไข tables ผ่าน MCP
- `.claude/skills/crud-pattern.md` — pattern สำหรับ CRUD admin pages
- `.claude/skills/export-data.md` — วิธี export Excel/PDF

### Municipal Knowledge Skills
- `.claude/skills/thai-official-doc.md` — รูปแบบหนังสือ/ประกาศ/บันทึกราชการ
- `.claude/skills/procurement.md` — TOR, วงเงิน→วิธีจัดซื้อ, checklist
- `.claude/skills/local-law.md` — อ้างมาตรา พ.ร.บ., ร่างเทศบัญญัติ
- `.claude/skills/social-media-gov.md` — template โพสต์รัฐ, DO&DON'T
- `.claude/skills/citizen-complaint.md` — Flow รับเรื่องร้องเรียน → ตอบกลับ
- `.claude/skills/annual-report.md` — โครงสร้างรายงานประจำปี 6 บท
- `.claude/skills/data-analysis.md` — สถิติ, เปรียบเทียบ YoY, KPI
- `.claude/skills/pdpa-compliance.md` — PDPA สำหรับ CCTV/IoT/แอป
- `.claude/skills/gis-spatial.md` — แผนที่, GIS layers, วิเคราะห์น้ำท่วม
- `.claude/skills/open-data.md` — เผยแพร่ data.go.th, metadata DCAT
- `.claude/skills/smart-infrastructure.md` — TOR Smart Light/CCTV/Sensor

---

# เทศบาลเมืองตาคลี — AI Workspace Dashboard

```
หน่วยงาน : เทศบาลเมืองตาคลี (ทม.ตาคลี)  จ.นครสวรรค์
วิสัยทัศน์: "ตาคลี เมืองแห่งความสุข อย่างยั่งยืน"
พื้นที่   : 16 ตร.กม.  |  ประชากร ~23,901 คน  |  23 ชุมชน
ติดต่อ   : 0-5621-9299  |  saraban@takhlicity.go.th
เลขที่หนังสือ: นว ๕๒๑๐๑/...
```

## QUICK START — ต้องการทำอะไร?

| ต้องการ... | ใช้ |
|-----------|-----|
| ร่างหนังสือราชการ / ประกาศ / คำสั่ง | `communication-docs` agent |
| โพสต์ Facebook / Line OA ข่าวเทศบาล | `/draft-announcement` |
| เขียน TOR / เลือกวิธีจัดซื้อ | `legal-compliance` agent |
| ตรวจ PDPA ก่อน launch Smart City | `legal-compliance` agent |
| วางแผนติดตั้ง CCTV / Smart Light / IoT | `smart-city-data` agent |
| สรุปงบประมาณ / วิเคราะห์ KPI | `/budget-summary` หรือ `smart-city-data` |
| รายงานการประชุม | `/meeting-minutes` |
| แผนโครงการพร้อม KPI + งบ | `/project-plan` |
| ตอบหนังสือ / แจ้งผลประชาชน | `/citizen-service` |
| รณรงค์สุขภาพ (Facebook + ใบปลิว + หอกระจาย) | `/health-campaign` |
| รายงานสวัสดิการ ผู้สูงอายุ คนพิการ | `/welfare-report` |
| ประชาสัมพันธ์สินค้า OTOP | `/otop-promote` |

## AGENT MAP — แผนผังทีม AI

```
┌─────────────────── SKILL SUBAGENTS (ผู้เชี่ยวชาญข้ามกอง) ──────────────────┐
│                                                                              │
│  ⚖️  legal-compliance          💡 smart-city-data         📝 communication-docs │
│  กม.ท้องถิ่น + พัสดุ + PDPA    GIS + Open Data + IoT + KPI   หนังสือ + โซเชียล + ร้องเรียน │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── TEAM AGENTS (แยกตามกอง) ────────────────────────────┐
│                                                                              │
│  🏛️  secretary-office    💰 finance           🔧 engineering                │
│  สนป. / งานทั่วไป / ประชาสัมพันธ์  กองคลัง / ภาษี / พัสดุ  กองช่าง / ถนน / ก่อสร้าง        │
│                                                                              │
│  🎓 education            🏥 public-health      🤝 social-welfare             │
│  กองการศึกษา / เด็กเล็ก / กีฬา  กองสาธารณสุข / ขยะ / สิ่งแวดล้อม  กองสวัสดิการ / ผู้สูงอายุ    │
│                                                                              │
│  📊 planning              🚰 water-supply                                   │
│  กองยุทธศาสตร์ / แผนพัฒนา / งบ  กองประปา / น้ำ / มิเตอร์                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────── SLASH COMMANDS ────────────────────────────────────┐
│  /draft-announcement   /meeting-minutes   /citizen-service   /project-plan  │
│  /budget-summary       /welfare-report    /health-campaign   /otop-promote  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## ยุทธศาสตร์ พ.ศ. 2566–2570

| # | ด้าน | สาระ |
|---|------|------|
| 1 | โครงสร้างพื้นฐาน | ถนน ระบบน้ำ ไฟฟ้าสาธารณะ |
| 2 | เศรษฐกิจ | OTOP อาชีพ เศรษฐกิจพอเพียง |
| 3 | สังคม/การศึกษา | โรงเรียน ศูนย์เด็กเล็ก กีฬา วัฒนธรรม |
| 4 | สาธารณสุข | โรคติดต่อ สุขาภิบาล สิ่งแวดล้อม |
| 5 | ทรัพยากรธรรมชาติ | สิ่งแวดล้อม การท่องเที่ยวยั่งยืน |
| 6 | การบริหาร | ธรรมาภิบาล Smart City บริการดิจิทัล |

## แนวทางการใช้งาน AI

**ภาษา:** ราชการเต็มรูปแบบสำหรับเอกสาร | กึ่งทางการสำหรับโซเชียล/ประชาสัมพันธ์  
**ความเป็นส่วนตัว:** ห้ามระบุชื่อ-ข้อมูลส่วนบุคคลในเอกสารสาธารณะ ใช้ข้อมูลรวม (Aggregate) เท่านั้น  
**งบประมาณ:** อ้างอิงเฉพาะข้อมูลที่เปิดเผยต่อสาธารณะได้
