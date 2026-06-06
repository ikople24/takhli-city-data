"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PublicService } from "@/types/database";

export async function upsertService(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as PublicService["type"],
    address: (formData.get("address") as string) || null,
    area_name: (formData.get("area_name") as string) || null,
    lat: null as number | null,
    lng: null as number | null,
    phone: (formData.get("phone") as string) || null,
    capacity: Number(formData.get("capacity")),
  };
  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lat: _lat, lng: _lng, ...updatePayload } = payload;
    await supabase.from("public_services").update(updatePayload).eq("id", id);
  } else {
    await supabase.from("public_services").insert(payload);
  }
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("public_services").delete().eq("id", id);
  revalidatePath("/admin/services");
}
