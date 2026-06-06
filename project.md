# เว็ปฐานข้อมูลกลางเมืองตาคลี — Project Overview

## ลิงก์สำคัญ
- **GitHub:** https://github.com/ikople24/takhli-city-data
- **Vercel:** (เชื่อมต่อหลัง deploy)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/[project-id]

## สีประจำเทศบาล
- Primary: #8758FF (oklch: 60.3% 0.234 290.6)
- Secondary: #5CB8E4 (oklch: 74.4% 0.108 231.5)
- Dark: #181818 (oklch: 20.9% 0.000 263.3)
- Light: #F2F2F2 (oklch: 96.1% 0.000 263.3)

## Stack
- Next.js 16, TypeScript strict, Tailwind v4 (CSS-first), daisyUI v5
- Supabase (Auth + DB + RLS), deployed on Vercel

## Tables
| Table | คำอธิบาย |
|-------|---------|
| profiles | ผู้ใช้งานระบบ (extends auth.users) — มี role: super_admin/editor/viewer |
| population_data | ข้อมูลประชากรรายตำบล |
| businesses | สถานประกอบการ/ธุรกิจ |
| infrastructure | โครงสร้างพื้นฐาน (ถนน, ไฟฟ้า, ประปา, อินเทอร์เน็ต) |
| public_services | สาธารณสุข/ศึกษา/สังคม |

## Env Variables ที่ต้องตั้งใน Vercel
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## เชื่อมต่อ Vercel
1. Push code ขึ้น GitHub
2. ไปที่ vercel.com → New Project → Import `takhli-city-data`
3. Framework preset: Next.js (auto-detected)
4. ตั้ง Environment Variables จาก Supabase dashboard → Project Settings → API
5. Deploy

## เชื่อมต่อ Supabase MCP
1. ตั้ง `SUPABASE_ACCESS_TOKEN` ใน environment (จาก supabase.com/dashboard → Account → Access Tokens)
2. เปิด Claude Code ใน project folder — จะโหลด `.mcp.json` อัตโนมัติ
