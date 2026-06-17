import AdminHubBreadcrumbs from "../../components/AdminHubBreadcrumbs";
import HolidaysManager from "../components/HolidaysManager";

export default function DiasFestivosPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminHubBreadcrumbs />
      <HolidaysManager />
    </div>
  );
}
