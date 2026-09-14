import { cookies } from "next/headers";
import AdminHubSidebar from "./components/AdminHubSidebar";
import AdminHubTopBar from "./components/AdminHubTopBar";
import {
  ADMIN_HUB_LOCALE_COOKIE,
  AdminHubI18nProvider,
  parseAdminHubLocale,
} from "./i18n";

export default async function AdminHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLocale = parseAdminHubLocale(
    cookieStore.get(ADMIN_HUB_LOCALE_COOKIE)?.value,
  );

  return (
    <AdminHubI18nProvider initialLocale={initialLocale}>
      <div className="flex h-screen overflow-hidden bg-[#F8F8F8]">
        <AdminHubSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHubTopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminHubI18nProvider>
  );
}
