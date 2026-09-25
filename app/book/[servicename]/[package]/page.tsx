import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/service-catalog";
import { ServiceBookingFlow } from "@/components/ServiceBookingFlow";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ servicename: string; package: string }>;
}) {
  const { servicename, package: packageSlug } = await params;
  const service = await getServiceBySlug(servicename);
  const decodedPackage = decodeURIComponent(packageSlug);
  const pkg = service?.packages.find((item) => item.name === decodedPackage);

  if (!service || !pkg) notFound();

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <ServiceBookingFlow service={service} pkg={pkg} />
      </main>
      <Footer />
    </div>
  );
}
