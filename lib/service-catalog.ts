import "server-only";
import { servicesData, ServiceDetail } from "@/lib/services-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type RuntimeService = ServiceDetail & {
  active?: boolean;
  featured?: boolean;
};

function merge(service: ServiceDetail, override: any): RuntimeService {
  if (!override?.config) return service;

  return {
    ...service,
    ...override.config,
    packages: Array.isArray(override.config.packages) ? override.config.packages : service.packages,
    active: override.config.active !== false,
    featured: override.config.featured === true,
  } as RuntimeService;
}

export async function getServicesWithOverrides(): Promise<RuntimeService[]> {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("admin_service_overrides")
      .select("service_id,config");

    if (error) return servicesData;

    const map = new Map((data || []).map((row: any) => [row.service_id, row]));

    return servicesData
      .map((service) => merge(service, map.get(service.id)))
      .filter((service) => service.active !== false);
  } catch {
    return servicesData;
  }
}

export async function getServiceBySlug(slug: string): Promise<RuntimeService | null> {
  const services = await getServicesWithOverrides();
  return services.find((service) => service.slug === slug) || null;
}

export async function getServiceById(id: string): Promise<RuntimeService | null> {
  const services = await getServicesWithOverrides();
  return services.find((service) => service.id === id || service.slug === id) || null;
}
