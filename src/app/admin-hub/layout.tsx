import AdminHubSidebar from "./components/AdminHubSidebar";
import AdminHubTopBar from "./components/AdminHubTopBar";

export default function AdminHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F8F8]">
      <AdminHubSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHubTopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
