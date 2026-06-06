# Design Spec: Department Pages & Navigation Restructure
Date: 2026-06-06

## Summary

ขยายระบบ takhli-city-data จาก 4 หมวดข้อมูลพื้นฐาน เป็นระบบที่ครอบคลุม 7 กองของเทศบาล
โดยใช้ **Section-Grouped Sidebar** pattern และแต่ละ department page เป็น **mixed model** (data table + document generation)

---

## 1. Navigation Restructure

### 1.1 Admin Sidebar (`src/components/admin/Sidebar.tsx`)

ปรับจาก flat list เป็น section groups:

```
ภาพรวม
  - /admin/dashboard   → ภาพรวม
  - /admin/export      → Export ข้อมูล

ข้อมูลพื้นฐาน
  - /admin/population     → ประชากร
  - /admin/business       → ธุรกิจ
  - /admin/infrastructure → โครงสร้างพื้นฐาน
  - /admin/services       → บริการสาธารณะ

กองต่างๆ
  - /admin/finance        → กองคลัง
  - /admin/engineering    → กองช่าง
  - /admin/education      → กองการศึกษา
  - /admin/health         → กองสาธารณสุข
  - /admin/welfare        → กองสวัสดิการ
  - /admin/planning       → กองยุทธศาสตร์
  - /admin/water          → กองประปา

ระบบ
  - /admin/users → จัดการผู้ใช้
```

Section headers เป็น `<p>` เล็ก uppercase สีจาง ไม่ clickable

### 1.2 Public Navbar (`src/components/public/Navbar.tsx`)

เพิ่ม dropdown 2 กลุ่ม:
- **ข้อมูลพื้นฐาน ▾** → ประชากร, ธุรกิจ, โครงสร้างพื้นฐาน, บริการสาธารณะ
- **ข้อมูลกอง ▾** → การศึกษา, สวัสดิการ, แผนพัฒนา

Mobile: แสดงทุก links แบบ flat ใน dropdown menu เดิม

---

## 2. Database Tables ใหม่

สร้าง 5 tables ใหม่ผ่าน Supabase MCP:

### `budget_items`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| fiscal_year | int4 | ปีงบประมาณ พ.ศ. |
| category | text | หมวดหมู่งบ (รายรับ/รายจ่าย/เงินอุดหนุน) |
| department | text | กองที่รับงบ |
| item_name | text | ชื่อรายการ |
| amount | numeric | วงเงิน (บาท) |
| status | text | อนุมัติ/รอ/ปรับแผน |
| created_at | timestamptz | |

### `education_facilities`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name | text | ชื่อสถานศึกษา |
| type | text | โรงเรียน/ศูนย์เด็กเล็ก/ห้องสมุด |
| student_count | int4 | จำนวนนักเรียน/ผู้ใช้บริการ |
| tambon | text | ตำบลที่ตั้ง |
| address | text | ที่อยู่ |
| phone | text | เบอร์ติดต่อ |
| created_at | timestamptz | |

### `welfare_recipients`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| welfare_type | text | ผู้สูงอายุ/คนพิการ/ผู้ด้อยโอกาส/เด็ก |
| tambon | text | ตำบล |
| recipient_count | int4 | จำนวนผู้รับสวัสดิการ |
| fiscal_year | int4 | ปีงบประมาณ |
| budget_used | numeric | งบที่ใช้ (บาท) |
| created_at | timestamptz | |

### `water_supply_zones`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| zone_name | text | ชื่อโซน/พื้นที่ |
| meter_count | int4 | จำนวนมิเตอร์ |
| service_area | text | พื้นที่ให้บริการ |
| status | text | ปกติ/ซ่อมบำรุง/ขยาย |
| coverage_percent | numeric | % ครัวเรือนที่ครอบคลุม |
| created_at | timestamptz | |

### `development_plans`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| project_name | text | ชื่อโครงการ |
| strategy_no | int4 | ยุทธศาสตร์ที่ (1-6) |
| fiscal_year | int4 | ปีงบประมาณ |
| budget | numeric | งบประมาณ (บาท) |
| kpi | text | ตัวชี้วัด |
| status | text | วางแผน/ดำเนินการ/เสร็จสิ้น |
| responsible_dept | text | กองรับผิดชอบ |
| created_at | timestamptz | |

**หมายเหตุ:**
- กองช่าง ใช้ `infrastructure` table เดิม — filter ด้วย `type IN ('ถนน','ไฟฟ้า','ระบบน้ำ','ก่อสร้าง')`
- กองสาธารณสุข ใช้ `public_services` table เดิม — filter ด้วย `type IN ('โรงพยาบาล','อนามัย','สุขาภิบาล','สิ่งแวดล้อม')`

---

## 3. Admin Pages ใหม่ (7 pages)

### Template แต่ละ department page

```
src/app/admin/<dept>/
├── page.tsx          ← Server Component (fetch data)
├── <Dept>Form.tsx    ← Client Component (modal form)
└── _actions.ts       ← Server Actions (CRUD)
```

### Layout ของแต่ละ page

```
Header: ชื่อกอง + count badge

[Tabs]
  ├── [ข้อมูล]
  │   ├── StatCards (2-3 ใบ)
  │   └── CrudTable (เหมือนหน้าอื่น)
  │
  └── [สร้างเอกสาร]
      └── Grid ของ DocumentToolCard
          แต่ละ card มี: ชื่อ command/skill, คำอธิบาย, ปุ่ม "ใช้งาน"
```

### Mapping Commands/Skills ต่อ department

| กอง | Page | Commands | Skills |
|-----|------|---------|--------|
| กองคลัง | /admin/finance | /budget-summary | procurement, data-analysis |
| กองช่าง | /admin/engineering | /project-plan | smart-infrastructure, gis-spatial |
| กองการศึกษา | /admin/education | /project-plan | annual-report, data-analysis |
| กองสาธารณสุข | /admin/health | /health-campaign | pdpa-compliance, data-analysis |
| กองสวัสดิการ | /admin/welfare | /welfare-report | citizen-complaint, thai-official-doc |
| กองยุทธศาสตร์ | /admin/planning | /project-plan, /budget-summary | open-data, data-analysis |
| กองประปา | /admin/water | /citizen-service | smart-infrastructure |

---

## 4. Public Pages ใหม่ (3 pages)

```
src/app/(public)/
├── education/page.tsx   → แสดง education_facilities
├── welfare/page.tsx     → แสดง welfare_recipients (aggregate เท่านั้น)
└── plans/page.tsx       → แสดง development_plans
```

แต่ละหน้าใช้ pattern เดิม: PageHero + StatCard + DataTable

### Homepage (`page.tsx`) ปรับ Category Cards

จาก 4 cards → 7 cards แบ่ง 2 แถว:
- แถวแรก (4 cards): ประชากร, ธุรกิจ, โครงสร้างพื้นฐาน, บริการสาธารณะ
- แถวสอง (3 cards): การศึกษา, สวัสดิการ, แผนพัฒนา

---

## 5. File ที่ต้องเปลี่ยนแปลง

### แก้ไข (existing files)
- `src/components/admin/Sidebar.tsx` — เพิ่ม section groups
- `src/components/public/Navbar.tsx` — เพิ่ม dropdowns
- `src/app/(public)/page.tsx` — เพิ่ม category cards
- `src/types/database.ts` — เพิ่ม types สำหรับ 5 tables ใหม่

### สร้างใหม่ (new files)
- `src/app/admin/finance/` (page, form, actions)
- `src/app/admin/engineering/` (page, form, actions)
- `src/app/admin/education/` (page, form, actions)
- `src/app/admin/health/` (page, form, actions)
- `src/app/admin/welfare/` (page, form, actions)
- `src/app/admin/planning/` (page, form, actions)
- `src/app/admin/water/` (page, form, actions)
- `src/app/(public)/education/page.tsx`
- `src/app/(public)/welfare/page.tsx`
- `src/app/(public)/plans/page.tsx`
- `src/components/admin/DocumentToolCard.tsx` — reusable card สำหรับ document tools tab

---

## 6. สิ่งที่ไม่อยู่ใน scope นี้

- ระบบ generate document จริง (ปุ่ม "ใช้งาน" แสดง command name ก่อน, ยังไม่ integrate AI)
- Authentication สำหรับ document tools (ใช้ role system เดิม)
- GIS/map visualization
