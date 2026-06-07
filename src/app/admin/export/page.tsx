import Topbar from "@/components/admin/Topbar";
import ExportClient from "./ExportClient";

export default function ExportPage() {
  return (
    <div>
      <Topbar title="Export ข้อมูล" />
      <ExportClient />
    </div>
  );
}
