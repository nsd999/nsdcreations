import "server-only";
import { servicesData } from "@/lib/services-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function merge(service: any, override: any) {
  if (!override?.config) return service;

  return {
    ...service,
    ...override.config,
    packages: Array.isArray(override.config.packages) ? override.config.packages : service.packages,
    active: override.config.active !== false,
    featured: override.config.featured === true,
  };
}

export async function getServicesWithOverrides() {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db.from("admin_service_overrides").select("service_id,config");
    if (error) return servicesData;

    const map = new Map((data || []).map((row: any) => [row.service_id, row]));
    return servicesData
      .map((service) => merge(service, map.get(service.id)))
      .filter((service: any) => service.active !== false);
  } catch {
    return servicesData;
  }
}

export async function getServiceBySlug(slug: string) {
  const services = await getServicesWithOverrides();
  return services.find((service) => service.slug === slug) || null;
}
