import { getServerAdmin } from "@/lib/admin-auth";
import AdminShell from "@/app/nsdtheadmin/components/AdminShell";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const admin = await getServerAdmin();
  const resolved = await params;
  return <AdminShell initialPath={resolved.path || []} admin={admin} />;
}
