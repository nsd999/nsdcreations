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
