import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { calculateMinimumQuote } from "../lib/pricing-math.mjs";

const root = new URL("../", import.meta.url);
const readRepoFile = (path) => readFileSync(new URL(path, root), "utf8");
const source = readRepoFile("lib/services-data.ts");
const compiled = ts.transpile(source, {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
});
const catalogModule = { exports: {} };
vm.runInNewContext(compiled, { module: catalogModule, exports: catalogModule.exports });
const services = catalogModule.exports.servicesData;

test("catalogue IDs and slugs are stable, unique, and URL-safe", () => {
  assert.ok(Array.isArray(services));
  assert.ok(services.length >= 19, `Expected catalogue to contain at least 19 services; found ${services.length}`);
  assert.equal(new Set(services.map((service) => service.id)).size, services.length, "duplicate service IDs");
  assert.equal(new Set(services.map((service) => service.slug)).size, services.length, "duplicate service slugs");
  for (const service of services) {
    assert.match(service.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(service.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("every service exposes complete public scope, package, FAQ and SEO data", () => {
  for (const service of services) {
    assert.ok(service.name.trim(), `${service.id}: name missing`);
    assert.ok(service.shortDescription.trim(), `${service.id}: short description missing`);
    assert.ok(service.longDescription.trim(), `${service.id}: long description missing`);
    assert.ok(service.category.trim(), `${service.id}: category missing`);
    assert.ok(service.categoryGroup.trim(), `${service.id}: category group missing`);
    assert.ok(service.billingUnit?.trim(), `${service.id}: billing unit missing`);
    assert.ok(service.targetCustomer?.trim(), `${service.id}: target customer missing`);
    assert.ok(service.deliverables?.length, `${service.id}: deliverables missing`);
    assert.ok(service.revisionPolicy?.trim(), `${service.id}: revision policy missing`);
    assert.ok(service.deliveryEstimate?.trim(), `${service.id}: delivery estimate missing`);
    assert.ok(service.exclusions?.length, `${service.id}: exclusions missing`);
    assert.ok(service.packages.length, `${service.id}: packages missing`);
    assert.ok(service.faqs.length, `${service.id}: FAQs missing`);
    assert.ok(service.seo.title.trim(), `${service.id}: SEO title missing`);
    assert.ok(service.seo.description.trim(), `${service.id}: SEO description missing`);
    assert.ok(service.seo.keywords.length, `${service.id}: SEO keywords missing`);
    for (const pkg of service.packages) {
      assert.ok(pkg.name.trim(), `${service.id}: package name missing`);
      assert.ok(pkg.price.trim(), `${service.id}/${pkg.name}: price or custom-quote label missing`);
      assert.ok(pkg.features.length, `${service.id}/${pkg.name}: package features missing`);
    }
  }
});

test("new candidate services are quote-led until unit costs and scopes are validated", () => {
  const expected = [
    "lyric-videos-music-visualisers",
    "corporate-digital-greeting-cards",
    "educational-worksheet-design",
  ];
  for (const slug of expected) {
    const service = services.find((item) => item.slug === slug);
    assert.ok(service, `missing service ${slug}`);
    assert.equal(service.pricingPrefix, "Custom Quote");
    assert.ok(service.packages.every((pkg) => pkg.price === "Custom Quote"));
  }
});

test("the public catalogue contains no internal cost or margin keys", () => {
  const forbidden = /^(internalCost|labourCost|laborCost|hourlyRate|contractorCost|softwareApiCost|paymentFeeRatePct|grossMargin|targetGrossMarginPct)$/i;
  function walk(value, path = "$") {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!forbidden.test(key), `internal pricing key leaked at ${path}.${key}`);
      walk(child, `${path}.${key}`);
    }
  }
  walk(services);
});

test("unknown service routes fail closed instead of rendering a success-shaped not-found page", () => {
  const page = readRepoFile("app/services/[slug]/page.tsx");
  assert.match(page, /import \{ notFound \} from "next\/navigation"/);
  assert.match(page, /if \(!service\)\s*\{\s*notFound\(\);\s*\}/);
  const pricing = readRepoFile("app/pricing/[servicename]/page.tsx");
  assert.match(pricing, /if \(!service\)\s*\{\s*notFound\(\);\s*\}/);
});

test("sitemap and robots use the canonical origin, keep the founder page, and deduplicate URLs", () => {
  const sitemap = readRepoFile("app/sitemap.ts");
  const robots = readRepoFile("app/robots.ts");
  assert.match(sitemap, /getServicesWithOverrides/);
  assert.match(sitemap, /getPublishedCmsTips/);
  assert.match(sitemap, /cmsTips[\s\n]*\.filter/);
  assert.match(sitemap, /new Map<string, MetadataRoute\.Sitemap\[number\]>/);
  assert.match(sitemap, /"\/meet-the-founder"/);
  assert.match(sitemap, /\/services\/\$\{service\.slug\}/);
  assert.match(sitemap, /\/pricing\/\$\{service\.slug\}/);
  assert.match(robots, /\$\{SITE_URL\}\/sitemap\.xml/);
});

test("minimum-quote math accounts for labour, third-party costs, rework and processing fees", () => {
  const quote = calculateMinimumQuote({
    labourHours: 10,
    hourlyRate: 500,
    contractorCost: 1000,
    softwareApiCost: 500,
    otherDirectCosts: 0,
    reworkAllowancePct: 10,
    fixedPaymentFee: 10,
    paymentFeeRatePct: 2,
    targetGrossMarginPct: 35,
  });
  assert.equal(quote.labourCost, 5000);
  assert.equal(quote.baseDirectCost, 6500);
  assert.ok(quote.minimumQuote >= 11365);
  assert.ok(quote.contributionMarginPct >= 35);
  assert.ok(quote.totalDeliveryCost < quote.recommendedSellingPrice);
});

test("minimum-quote math rejects unsafe or invalid margin assumptions", () => {
  assert.throws(() => calculateMinimumQuote({}), /labourHours/);
  assert.throws(() => calculateMinimumQuote({
    labourHours: 1, hourlyRate: 1, contractorCost: 0, softwareApiCost: 0,
    otherDirectCosts: 0, reworkAllowancePct: 0, fixedPaymentFee: 0,
    paymentFeeRatePct: 30, targetGrossMarginPct: 70,
  }), /below 100%/);
});

test("all seven service families are represented in both discovery and pricing UIs", () => {
  const expected = [
    "AI Creative & Video Production",
    "Graphic Design & Branding",
    "Digital Marketing",
    "AI & Business Automation",
    "Websites, Apps & Software",
    "Music & Creator",
    "Education & Digital Learning",
  ];
  const groups = [...new Set(services.map((service) => service.categoryGroup))].sort();
  assert.deepEqual(groups, [...expected].sort());
  assert.ok(services.every((service) => service.category === service.categoryGroup), "category labels and groups should use the same taxonomy");

  const directory = readRepoFile("app/services/page.tsx");
  const pricing = readRepoFile("app/pricing/page.tsx");
  for (const group of expected) {
    assert.ok(directory.includes(`"${group}"`), `missing directory filter for ${group}`);
    assert.ok(pricing.includes(`id: "${group}"`), `missing pricing group for ${group}`);
    assert.ok(pricing.includes(`"${group}": []`), `missing pricing data bucket for ${group}`);
  }
});

test("public contact helper points only to the official business WhatsApp destination", () => {
  const helper = readRepoFile("lib/whatsapp.ts");
  assert.match(helper, /WHATSAPP_NUMBER\s*=\s*"919492651908"/);
  assert.match(helper, /https:\/\/wa\.me\/\$\{WHATSAPP_NUMBER\}/);
  const publicSource = [
    readRepoFile("app/page.tsx"),
    readRepoFile("components/HomePageClient.tsx"),
    readRepoFile("app/services/[slug]/page.tsx"),
    readRepoFile("app/pricing/[servicename]/page.tsx"),
    readRepoFile("app/contact/page.tsx"),
    readRepoFile("app/portfolio/page.tsx"),
  ].join("\n");
  assert.ok(!publicSource.includes("wa.me/6303849852"));
  assert.ok(!publicSource.includes("api.whatsapp.com/send?phone=6303849852"));
});

test("homepage has a server-rendered canonical and metrics fail closed without owner data", () => {
  const home = readRepoFile("app/page.tsx");
  assert.doesNotMatch(home, /^["']use client["']/);
  assert.match(home, /alternates:\s*\{\s*canonical:\s*SITE_URL\s*\}/);
  assert.match(home, /HomePageClient/);

  const statsRoute = readRepoFile("app/api/public/stats/route.ts");
  assert.doesNotMatch(statsRoute, /projectsCompleted:\s*50|happyClients:\s*30|source:\s*"baseline"/);
  assert.match(statsRoute, /source:\s*"unavailable"/);

  const animation = readRepoFile("components/AnimatedStats.tsx");
  assert.doesNotMatch(animation, /projectsCompleted:\s*50|happyClients:\s*30|\|\|\s*50|\|\|\s*30/);
  assert.match(animation, /next\.source === "cms"/);
});

test("founder and review copy avoids unverifiable client metrics and verification labels", () => {
  const founder = readRepoFile("app/meet-the-founder/page.tsx");
  assert.doesNotMatch(founder, /50\+ Projects|30\+ Happy|30\+ happy clients/i);
  const testimonials = readRepoFile("components/Testimonials.tsx");
  assert.doesNotMatch(testimonials, /Verified Client|industry leaders and creators/i);
  assert.match(testimonials, /Approved Review/);
});

test("tips directory and article metadata use canonical URLs and safe fallback metadata", () => {
  const directoryLayout = readRepoFile("app/tips/layout.tsx");
  assert.match(directoryLayout, /alternates:\s*\{\s*canonical:\s*`\$\{SITE_URL\}\/tips`\s*\}/);
  const dynamicTips = readRepoFile("app/tips/[...slug]/page.tsx");
  assert.match(dynamicTips, /alternates:\s*\{\s*canonical\s*\}/);
  assert.match(dynamicTips, /const canonical = `\$\{SITE_URL\}\/tips\/\$\{tip\.category\.toLowerCase\(\)\}\/\$\{tip\.slug\}`/);
  assert.match(dynamicTips, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
});

test("public site settings cannot override the official business WhatsApp destination", () => {
  const settingsRoute = readRepoFile("app/api/public/site-settings/route.ts");
  assert.match(settingsRoute, /import \{ WHATSAPP_URL \} from "@\/lib\/whatsapp"/);
  assert.match(settingsRoute, /settings:\s*\{\s*whatsapp_url:\s*WHATSAPP_URL\s*\}/);
  assert.doesNotMatch(settingsRoute, /"whatsapp_url",\s*\n\s*"contact_email"/);
  const adminShell = readRepoFile("app/nsdtheadmin/components/AdminShell.tsx");
  assert.doesNotMatch(adminShell, /"whatsapp_url",\s*"contact_email"/);
});

test("service CTA query parameters preselect the enquiry form", () => {
  const contact = readRepoFile("app/contact/page.tsx");
  assert.match(contact, /new URLSearchParams\(window\.location\.search\)/);
  assert.match(contact, /params\.get\("service"\)/);
  assert.match(contact, /params\.get\("package"\)/);
  assert.match(contact, /service\.slug\.toLowerCase\(\) === requestedService/);
  assert.match(contact, /servicesData\.map\(\(service\) =>/);
  assert.match(contact, /value=\{service\.slug\}/);
  assert.match(contact, /fetch\("\/api\/contact"/);
});

test("service detail pages publish scoped Service and BreadcrumbList JSON-LD", () => {
  const page = readRepoFile("app/services/[slug]/page.tsx");
  assert.match(page, /"@type": "Service"/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(page, /serviceType: service\.category/);
  assert.match(page, /name: service\.name/);
  assert.match(page, /url: `\$\{SITE_URL\}\/services\/\$\{service\.slug\}`/);
  assert.ok((page.match(/type="application\/ld\+json"/g) || []).length >= 2);
  assert.doesNotMatch(page, /aggregateRating|reviewCount|ratingValue/);
});
