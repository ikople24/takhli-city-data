"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Role } from "@/types/database";

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role: role as Role }).eq("id", userId);
  revalidatePath("/admin/users");
}
