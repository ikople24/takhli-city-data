import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import ServiceTable from "./ServiceTable";

export default async function ServicesAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("public_services").select("*").order("name");
  return (
    <div>
      <Topbar title="บริการสาธารณะ" />
      <div className="p-6">
        <ServiceTable data={data ?? []} role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
