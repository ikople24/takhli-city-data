"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertPopulation(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const insertPayload = {
    area_name: formData.get("area_name") as string,
    total_population: Number(formData.get("total_population")),
    male: Number(formData.get("male")),
    female: Number(formData.get("female")),
    age_0_14: Number(formData.get("age_0_14")),
    age_15_59: Number(formData.get("age_15_59")),
    age_60_plus: Number(formData.get("age_60_plus")),
    households: Number(formData.get("households")),
    year: Number(formData.get("year")),
    updated_by: user?.id ?? null,
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updated_by: _ub, ...updatePayload } = insertPayload;
  if (id) {
    await supabase.from("population_data").update(updatePayload).eq("id", id);
  } else {
    await supabase.from("population_data").insert(insertPayload);
  }
  revalidatePath("/admin/population");
}

export async function deletePopulation(id: string) {
  const supabase = await createClient();
  await supabase.from("population_data").delete().eq("id", id);
  revalidatePath("/admin/population");
}
