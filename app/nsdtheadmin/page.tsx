import { redirect } from "next/navigation";
import { getServerAdmin } from "@/lib/admin-auth";

export default async function AdminRootPage() {
  const admin = await getServerAdmin();
  redirect(admin ? "/nsdtheadmin/dashboard" : "/nsdtheadmin/login");
}
