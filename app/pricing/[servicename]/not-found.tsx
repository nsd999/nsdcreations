import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col relative min-h-screen bg-[#FAFAFA] dark:bg-[#09090b]">
      <Navbar />
      <div className="absolute inset-0 grid-background pointer-events-none -z-10" />

      <main className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-8">
          <Search className="w-10 h-10 text-indigo-500" />
        </div>
        
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
          Service Not Found
        </h1>
        
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto mb-10">
          The pricing plan or service you&apos;re looking for doesn&apos;t exist or has been moved. 
          Please check our complete list of services.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg active:scale-95 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 active:scale-95 transition-all w-full sm:w-auto"
          >
            Browse All Services
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
