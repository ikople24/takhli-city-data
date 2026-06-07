import { createClient } from "@/lib/supabase/server";
import Topbar from "@/components/admin/Topbar";
import BusinessTable from "./BusinessTable";

export default async function BusinessAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const { data } = await supabase.from("businesses").select("*").order("name");
  return (
    <div>
      <Topbar title="สถานประกอบการและธุรกิจ" />
      <div className="p-6">
        <BusinessTable data={data ?? []} role={profile?.role ?? "viewer"} />
      </div>
    </div>
  );
}
