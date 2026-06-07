import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import InfraTable from "./InfraTable";

export default async function InfrastructureAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("infrastructure").select("*").order("name");
  return (
    <div>
      <Topbar title="โครงสร้างพื้นฐาน" />
      <div className="p-6">
        <InfraTable data={data ?? []} role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
