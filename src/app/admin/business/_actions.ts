"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Business } from "@/types/database";

export async function upsertBusiness(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    category: formData.get("category") as Business["category"],
    address: (formData.get("address") as string) || null,
    area_name: (formData.get("area_name") as string) || null,
    lat: null as number | null,
    lng: null as number | null,
    employees: Number(formData.get("employees")),
    status: formData.get("status") as Business["status"],
    registered_date: (formData.get("registered_date") as string) || null,
  };
  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lat: _lat, lng: _lng, ...updatePayload } = payload;
    await supabase.from("businesses").update(updatePayload).eq("id", id);
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
