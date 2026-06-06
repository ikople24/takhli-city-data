# Supabase DB Migration via MCP

## เมื่อต้องสร้าง/แก้ไข table

1. ใช้ Supabase MCP tool เพื่อรัน SQL
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
