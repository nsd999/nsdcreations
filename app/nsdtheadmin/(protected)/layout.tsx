import { redirect } from "next/navigation";
import { getServerAdmin } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getServerAdmin();
  if (!admin) redirect("/nsdtheadmin/login");
  return <>{children}</>;
}
