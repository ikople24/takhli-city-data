# Design: เว็ปฐานข้อมูลกลางเมืองตาคลี

**Date:** 2026-06-06
**Status:** Implemented

## Summary

Municipal central database website for เทศบาลเมืองตาคลี, จังหวัดนครสวรรค์. Public-facing data portal + admin panel for managing 4 data categories.

## Tech Stack

- Next.js 16, TypeScript strict, App Router
- Tailwind CSS v4 (CSS-first via globals.css) + daisyUI v5 (custom theme: takhli)
- Supabase (PostgreSQL + Auth + RLS) via @supabase/ssr
- Recharts (charts), xlsx (Excel export), jsPDF (PDF), lucide-react (icons)
- GitHub + Vercel deployment

## Color Theme (takhli)

| Role | Hex | OKLCH |
|------|-----|-------|
| Primary | #8758FF | oklch(60.3% 0.234 290.6) |
| Secondary | #5CB8E4 | oklch(74.4% 0.108 231.5) |
| Neutral (admin sidebar) | #181818 | oklch(20.9% 0.000 263.3) |
| Base-100 (background) | #F2F2F2 | oklch(96.1% 0.000 263.3) |

## Database Schema

5 tables: `profiles`, `population_data`, `businesses`, `infrastructure`, `public_services`

RLS: Public SELECT, Editor INSERT/UPDATE, Super Admin DELETE

## User Roles

- `super_admin` — full access including user management
- `editor` — CRUD all data, no user management
- `viewer` — read-only admin panel

## Routes

**Public:** `/`, `/population`, `/business`, `/infrastructure`, `/services`
**Admin:** `/admin/dashboard`, `/admin/population`, `/admin/business`, `/admin/infrastructure`, `/admin/services`, `/admin/users`, `/admin/export`
**Auth:** `/auth/login`, `/auth/callback`
