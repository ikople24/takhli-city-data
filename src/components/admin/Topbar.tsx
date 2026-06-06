import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Topbar({ title }: { title: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
      <h1 className="font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-base-content/60">{user?.email}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
