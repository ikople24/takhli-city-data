"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Infrastructure } from "@/types/database";

export async function upsertInfrastructure(formData: FormData) {
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
  revalidatePath("/admin/infrastructure");
}

export async function deleteInfrastructure(id: string) {
  const supabase = await createClient();
  await supabase.from("infrastructure").delete().eq("id", id);
  revalidatePath("/admin/infrastructure");
}
