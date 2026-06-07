import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import PopulationTable from "./PopulationTable";

export default async function PopulationAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("population_data").select("*").order("area_name");
  return (
    <div>
      <Topbar title="ข้อมูลประชากร" />
      <div className="p-6">
        <PopulationTable data={data ?? []} role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
