import { servicesData, ServiceDetail, ServicePackage } from "@/lib/services-data";

export const PRICING_RULE_VERSION = "2026-09-25-v1";

export type PricingMode = "fixed" | "starting" | "calculator" | "custom_quote";

export type BookingPricing = {
  serviceId: string;
  packageId: string;
  serviceName: string;
  packageName: string;
  pricingMode: PricingMode;
  currency: "INR";
  projectTotalPaise: number;
  advancePercentage: number;
  advanceAmountPaise: number;
  balanceAmountPaise: number;
  monthly: boolean;
  snapshot: Record<string, unknown>;
};

function parseExactRupees(value: string) {
  const cleaned = value.replace(/[₹,\s]/g, "");
  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) return null;

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? Math.round(amount * 100) : null;
}

export function getPricingMode(service: ServiceDetail, pkg: ServicePackage): PricingMode {
  if (
    pkg.price.includes("+") ||
    /–|-/.test(pkg.price.replace("₹", "")) ||
    service.pricingPrefix === "Custom Quote"
  ) {
    return "custom_quote";
  }

  return "fixed";
}

function getAdvancePercentage(service: ServiceDetail, totalPaise: number) {
  if (service.pricingPeriod === "/month") return 100;
  if (totalPaise <= 99900) return 100;
  return 50;
}

export function findServicePackage(serviceId: string, packageId: string) {
  const service = servicesData.find((item) => item.id === serviceId || item.slug === serviceId);
  if (!service) return null;

  const pkg = service.packages.find((item) => item.name === packageId);
  if (!pkg) return null;

  return { service, pkg };
}

export function calculateBookingPricing(
  serviceId: string,
  packageId: string,
  selectedOptions: Record<string, unknown> = {},
): BookingPricing {
  const result = findServicePackage(serviceId, packageId);
  if (!result) throw new Error("SERVICE_OR_PACKAGE_NOT_FOUND");

  const { service, pkg } = result;
  const pricingMode = getPricingMode(service, pkg);
  if (pricingMode === "custom_quote") throw new Error("CUSTOM_QUOTE_REQUIRED");

  const totalPaise = parseExactRupees(pkg.price);
  if (totalPaise === null || totalPaise <= 0) throw new Error("INVALID_PRICE");

  const advancePercentage = getAdvancePercentage(service, totalPaise);
  const advanceAmountPaise = Math.round(totalPaise * advancePercentage / 100);
  const balanceAmountPaise = totalPaise - advanceAmountPaise;

  if (advanceAmountPaise < 0 || balanceAmountPaise < 0 || totalPaise !== advanceAmountPaise + balanceAmountPaise) {
    throw new Error("PRICE_RECONCILIATION_FAILED");
  }

  return {
    serviceId: service.id,
    packageId: pkg.name,
    serviceName: service.name,
    packageName: pkg.name,
    pricingMode,
    currency: "INR",
    projectTotalPaise: totalPaise,
    advancePercentage,
    advanceAmountPaise,
    balanceAmountPaise,
    monthly: service.pricingPeriod === "/month",
    snapshot: {
      version: PRICING_RULE_VERSION,
      service: {
        id: service.id,
        name: service.name,
        category: service.category,
        pricingPrefix: service.pricingPrefix,
        pricingPeriod: service.pricingPeriod,
      },
      package: {
        name: pkg.name,
        displayedPrice: pkg.price,
        features: pkg.features,
        idealFor: pkg.idealFor || null,
        isPopular: Boolean(pkg.isPopular),
      },
      selectedOptions,
      projectTotalPaise: totalPaise,
      advancePercentage,
      advanceAmountPaise,
      balanceAmountPaise,
      currency: "INR",
    },
  };
}
