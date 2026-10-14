import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import type { ServiceDetail } from "@/lib/services-data";

type ServicePricingSectionProps = {
  service: ServiceDetail;
};

function needsCustomQuote(price: string) {
  return price.includes("+") || /–|-/.test(price.replace("₹", ""));
}

export function ServicePricingSection({ service }: ServicePricingSectionProps) {
  const hasConfirmedPackages = service.pricingPrefix !== "Custom Quote" && service.packages.length > 0;
  const quoteHref = `/contact?service=${encodeURIComponent(service.name)}`;

  return (
    <section className="px-6 pb-8 max-w-7xl mx-auto w-full">
      <section
        id="service-pricing"
        aria-labelledby="service-pricing-title"
        className="scroll-mt-28 rounded-3xl border border-zinc-200/70 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/90 p-6 sm:p-8 lg:p-10"
        style={{ scrollMarginTop: "7rem" }}
      >
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" /> Transparent Pricing
          </span>
          <h2 id="service-pricing-title" className="mt-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {service.name} Pricing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {hasConfirmedPackages
              ? "Compare the available packages and choose the scope that fits your project. Final scope is confirmed before work begins."
              : "Pricing for this service is scope-dependent. Contact us for a tailored quote before committing to a package."}
          </p>
        </div>

        {hasConfirmedPackages ? (
          <div className={`grid grid-cols-1 gap-5 ${service.packages.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : service.packages.length >= 3 ? "md:grid-cols-2 xl:grid-cols-3" : "max-w-3xl mx-auto"}`}>
            {service.packages.map((pkg) => {
              const custom = needsCustomQuote(pkg.price);
              const packageHref = custom
                ? `${quoteHref}&package=${encodeURIComponent(pkg.name)}`
                : `/book/${service.slug}/${encodeURIComponent(pkg.name)}`;
              return (
                <article key={pkg.name} className={`relative flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6 ${pkg.isPopular ? "border-indigo-500 shadow-lg shadow-indigo-500/10" : "border-zinc-200 dark:border-zinc-800"}`}>
                  {pkg.isPopular && <span className="mb-3 self-start rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Most Popular</span>}
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">{pkg.name}</h3>
                  {pkg.idealFor && <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{pkg.idealFor}</p>}
                  <p className="mt-5 break-words text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                    {pkg.price}{service.pricingPeriod && <span className="ml-1 text-sm font-medium text-zinc-500">{service.pricingPeriod}</span>}
                  </p>
                  {custom && <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">Starting/range price; final quote depends on project scope.</p>}
                  <ul className="mt-5 flex-1 space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                    {pkg.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>{feature}</span></li>)}
                  </ul>
                  <Link href={packageHref} className={`mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${pkg.isPopular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"}`}>
                    {custom ? "Request Custom Quote" : "Choose Package"}<ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
            <p className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">Custom Quote — Contact Us</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">We’ll confirm deliverables, timeline and final pricing after reviewing your requirements.</p>
            <Link href={quoteHref} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Get a Custom Quote <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}

        {hasConfirmedPackages && service.addOns && service.addOns.length > 0 && (
          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">Optional Add-ons</h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {service.addOns.map((addOn) => <li key={addOn.name} className="flex min-w-0 items-start justify-between gap-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800 px-4 py-3 text-sm"><span className="text-zinc-600 dark:text-zinc-300">{addOn.name}</span><span className="shrink-0 font-semibold text-zinc-900 dark:text-zinc-100">{addOn.price}</span></li>)}
            </ul>
          </div>
        )}
        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">Package scope, delivery schedule and revision limits are as listed above or confirmed in your project brief. Prices marked as ranges or starting points require a final scope confirmation.</p>
      </section>

      <div className="flex justify-center py-5 sm:py-6">
        <a href="#service-pricing" className="inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/5 px-6 py-3 text-sm font-bold text-indigo-600 transition-all hover:border-indigo-500 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:text-indigo-400">
          View Pricing <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <section aria-labelledby="service-ready-title" className="rounded-3xl bg-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 id="service-ready-title" className="font-display text-xl sm:text-2xl font-bold leading-tight">Ready to start this project?</h2>
            <p className="mt-2 text-sm leading-relaxed text-indigo-100">Contact us today to receive a precise quote and project scope for {service.name}.</p>
          </div>
          <Link href="/#contact" className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-indigo-600 transition-colors hover:bg-zinc-50 sm:w-auto">
            Start This Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </section>
  );
}
