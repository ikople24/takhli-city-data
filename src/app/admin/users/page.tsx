import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Topbar from "@/components/admin/Topbar";
import { updateUserRole } from "./_actions";

const ROLES = ["viewer", "editor", "super_admin"];
const roleBadge: Record<string, string> = {
  super_admin: "badge-primary",
  editor: "badge-secondary",
  viewer: "badge-ghost",
};

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "super_admin") {
    redirect("/admin/dashboard");
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at");

  return (
    <div>
      <Topbar title="จัดการผู้ใช้งาน" />
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg border border-base-300">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="bg-base-200">ชื่อ</th>
                <th className="bg-base-200">User ID</th>
                <th className="bg-base-200">สิทธิ์ปัจจุบัน</th>
                <th className="bg-base-200">เข้าร่วมเมื่อ</th>
                <th className="bg-base-200">เปลี่ยนสิทธิ์</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name ?? "-"}</td>
                  <td className="text-xs font-mono text-base-content/50">
                    {u.id.slice(0, 8)}...
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${roleBadge[u.role] ?? "badge-ghost"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(u.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td>
                    <form
                      action={async (fd) => {
                        "use server";
                        await updateUserRole(u.id, fd.get("role") as string);
                      }}
                      className="flex gap-2 items-center"
                    >
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="select select-bordered select-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-primary btn-xs">
                        บันทึก
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/50">
                    ไม่มีผู้ใช้งาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
