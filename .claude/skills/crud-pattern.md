# Admin CRUD Page Pattern

## โครงสร้าง page (Server Component)

```tsx
// src/app/admin/[module]/page.tsx
import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import CrudTable from "@/components/admin/CrudTable";
import { upsertRecord, deleteRecord } from "./_actions";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("table_name").select("*").order("updated_at", { ascending: false });
  return (
    <div>
      <Topbar title="ชื่อหน้า" />
      <div className="p-6">
        <CrudTable data={data ?? []} columns={columns}
          renderForm={(item, onClose) => <Form item={item} onClose={onClose} />}
          onDelete={deleteRecord} addLabel="เพิ่มรายการ" role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
```

## Server Actions pattern (ใน `_actions.ts`)

```ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertRecord(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = { /* fields from formData */ };
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

## CrudTable component
- Location: `src/components/admin/CrudTable.tsx`
- Props: data, columns, renderForm, onDelete, addLabel, role
- Handles: modal open/close, delete confirmation, role-based show/hide of edit buttons
