"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";

type AdminIdentity = {
  sessionId: string;
  userId: string;
  username: string | null;
  lastAuthenticatedAt: string;
  expiresAt: string;
} | null;

const sections = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "payments", label: "Payments", icon: CircleDollarSign },
  { id: "leads", label: "Leads", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "notification-subscribers", label: "Subscribers", icon: MessageSquare },
  { id: "tips", label: "Tips", icon: FileText },
  { id: "quotes", label: "Quotes", icon: BriefcaseBusiness },
  { id: "services", label: "Services", icon: Package },
  { id: "pricing", label: "Pricing", icon: BarChart3 },
  { id: "content", label: "Content", icon: Pencil },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "portfolio", label: "Portfolio", icon: Globe2 },
  { id: "seo", label: "SEO", icon: Activity },
  { id: "site-settings", label: "Site Settings", icon: Settings },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "logs", label: "Audit Logs", icon: Activity },
];

function money(paise = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(paise || 0) / 100);
}

function dateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "slate" | "indigo" }) {
  const classes = {
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    slate: "bg-white/5 text-zinc-300 border-white/10",
  }[tone];

  return <span className={"inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider " + classes}>{children}</span>;
}

function getTone(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes("confirm") || lower.includes("success") || lower === "won" || lower === "approved" || lower === "active") return "green" as const;
  if (lower.includes("pending") || lower.includes("await") || lower.includes("draft") || lower.includes("qualified") || lower.includes("sent")) return "amber" as const;
  if (lower.includes("failed") || lower.includes("refund") || lower.includes("reject") || lower === "lost" || lower === "inactive") return "red" as const;
  return "slate" as const;
}

async function api(path: string, init?: RequestInit) {
  const response = await fetch("/api/admin/" + path, {
    credentials: "same-origin",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    window.location.href = "/nsdtheadmin/login";
    throw new Error("Unauthorized");
  }
  if (!response.ok) throw new Error(data.error || "Admin request failed.");
  return data;
}

function Card({ title, value, sub, icon: Icon }: { title: string; value: string; sub?: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-zinc-500">{title}</span>
        <Icon className="w-4 h-4 text-indigo-400" />
      </div>
      <div className="mt-3 text-2xl font-display font-bold">{value}</div>
      {sub && <div className="mt-1 text-[11px] text-zinc-500">{sub}</div>}
    </div>
  );
}

function Empty({ text = "No data yet" }) {
  return <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">{text}</div>;
}

function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="min-w-full text-sm">{children}</table></div>;
}

export default function AdminShell({ initialPath, admin }: { initialPath: string[]; admin: AdminIdentity }) {
  const initialSection = initialPath[0] || "dashboard";
  const [section, setSection] = useState(initialSection === "bookings" && initialPath[1] ? "bookings" : initialSection);
  const detailId = initialSection === "bookings" ? initialPath[1] : undefined;
  const [mobileNav, setMobileNav] = useState(false);

  const navigate = (target: string) => {
    setSection(target);
    setMobileNav(false);
    window.history.pushState({}, "", "/nsdtheadmin/" + target);
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/nsdtheadmin/login";
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-zinc-100">
      <aside className={"fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#09090d]/95 backdrop-blur-xl transition-transform duration-200 " + (mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="h-full flex flex-col">
          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-mono tracking-[0.26em] text-orange-400 uppercase">NSD Creations</p>
              <h2 className="font-display font-bold text-lg">Command Center</h2>
            </div>
            <button onClick={() => setMobileNav(false)} className="lg:hidden p-2 rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {sections.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={"w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition " + (active ? "bg-indigo-500/10 text-indigo-200 border border-indigo-500/20" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]")}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10">
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 mb-2">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600">Session</div>
              <div className="text-xs mt-1 text-zinc-300 truncate">{admin?.username || "Administrator"}</div>
              <div className="text-[10px] text-zinc-600 mt-1">Expires {dateTime(admin?.expiresAt)}</div>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:text-red-300 hover:bg-red-500/5">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06060a]/85 backdrop-blur-xl">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileNav(true)} className="lg:hidden p-2 rounded-lg border border-white/10"><Menu className="w-4 h-4" /></button>
              <div>
                <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-600">Private administration</p>
                <h1 className="font-display font-semibold text-base md:text-lg">{sections.find((item) => item.id === section)?.label || "Dashboard"}</h1>
              </div>
            </div>
            <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200"><ArrowLeft className="w-3.5 h-3.5" /> Public site</Link>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-[1500px] mx-auto">
          {section === "dashboard" && <DashboardView navigate={navigate} />}
          {section === "bookings" && <BookingsView initialId={detailId} />}
          {section === "payments" && <PaymentsView />}
          {section === "leads" && <LeadsView />}
          {section === "notifications" && <NotificationsView />}
          {section === "notification-subscribers" && <SubscribersView />}
          {section === "tips" && <TipsView />}
          {section === "quotes" && <QuotesView />}
          {(section === "services" || section === "pricing") && <ServicesView />}
          {(section === "content" || section === "seo" || section === "site-settings") && <SettingsView mode={section} />}
          {section === "testimonials" && <TestimonialsView />}
          {section === "portfolio" && <PortfolioView />}
          {section === "security" && <SecurityView />}
          {section === "logs" && <LogsView />}
        </main>
      </div>

      {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNav(false)} />}
    </div>
  );
}

function DashboardView({ navigate }: { navigate: (path: string) => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setData(await api("dashboard")); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading && !data) return <div className="py-20 text-center text-zinc-500">Loading command center…</div>;
  if (!data) return <Empty />;

  const quick = [
    ["New Tip", "tips"],
    ["Send Notification", "notifications"],
    ["Bookings", "bookings"],
    ["Leads", "leads"],
    ["Create Quote", "quotes"],
    ["Services", "services"],
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-mono">Operations overview</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Today at NSD Creations</h2>
          <p className="text-sm text-zinc-500 mt-2">Real database metrics only. Missing data is shown as unavailable rather than estimated.</p>
        </div>
        <button onClick={load} className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-xs text-zinc-400 hover:text-white"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="New leads" value={String(data.today.leads)} sub="Today" icon={Users} />
        <Card title="New bookings" value={String(data.today.bookings)} sub="Today" icon={ClipboardList} />
        <Card title="Pending payments" value={String(data.today.pendingPayments)} sub="Awaiting payment" icon={CircleDollarSign} />
        <Card title="Successful payments" value={String(data.today.successfulPayments)} sub="Today" icon={Check} />
        <Card title="Advance revenue" value={money(data.today.advanceRevenuePaise)} sub="Verified payments • today" icon={CircleDollarSign} />
        <Card title="Balance outstanding" value={money(data.today.outstandingBalancePaise)} sub="Active confirmed work" icon={BarChart3} />
        <Card title="Push registrations" value={String(data.today.activeSubscribers)} sub={String(data.today.notificationRegistrationsNewToday) + " new today • " + String(data.today.notificationRegistrationsInactive) + " inactive"} icon={Bell} />
        <Card title="New reviews" value={String(data.today.newReviews)} sub="Today • pending review" icon={Star} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <div className="flex items-center justify-between"><h3 className="font-display font-semibold">This month</h3><Badge tone="indigo">INR</Badge></div>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <Metric label="Bookings" value={String(data.month.bookings)} />
            <Metric label="Confirmed projects" value={String(data.month.confirmedProjects)} />
            <Metric label="Project value" value={money(data.month.totalProjectValuePaise)} />
            <Metric label="Advance collected" value={money(data.month.advanceCollectedPaise)} />
            <Metric label="Balance outstanding" value={money(data.month.balanceOutstandingPaise)} />
            <Metric label="Leads" value={String(data.month.leads)} />
            <Metric label="Failed payments" value={String(data.month.failedPayments)} />
            <Metric label="Refunded payments" value={String(data.month.refundedPayments)} />
          </div>
          <div className="mt-5 border-t border-white/10 pt-4 text-xs text-zinc-500 flex flex-wrap gap-x-4 gap-y-1">
  <span>Conversion rate: {data.month.conversionRate === null ? "No data yet" : data.month.conversionRate + "%"}</span>
  <span>Push registrations this month: {data.today.notificationRegistrationsNewMonth}</span>
  <span>Active push registrations this month: {data.today.notificationRegistrationsActiveNewMonth}</span>
</div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <h3 className="font-display font-semibold">System health</h3>
          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <Health label="Supabase" ok={data.system.supabase} />
            <Health label="Razorpay" ok={data.system.razorpay} />
            <Health label="Webhook secret" ok={data.system.webhook} />
            <Health label="Push notifications" ok={data.system.push} />
            <Health label="Environment" ok={data.system.environment} />
          </div>
          <div className="mt-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-3">Quick actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quick.map(([label, target]) => <button key={target} onClick={() => navigate(target)} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-xs text-zinc-300 hover:bg-white/[0.05]">{label}</button>)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-black/20 border border-white/5 p-3"><div className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}

function Health({ label, ok }: { label: string; ok: boolean }) {
  return <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5"><span className="text-xs text-zinc-400">{label}</span><Badge tone={ok ? "green" : "red"}>{ok ? "Configured" : "Missing"}</Badge></div>;
}

function Toolbar({ query, setQuery, status, setStatus, placeholder = "Search…" }: any) {
  return <div className="flex flex-col lg:flex-row gap-2 mb-4">
    <div className="flex-1 relative">
      <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
    </div>
    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-2.5 text-sm text-zinc-300 outline-none">
      <option value="">All statuses</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="PENDING">Pending</option>
      <option value="FAILED">Failed</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>;
}

function BookingsView({ initialId }: { initialId?: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (initialId) {
        const result = await api("bookings/" + initialId);
        setDetail(result);
      } else {
        const result = await api("bookings?q=" + encodeURIComponent(query) + "&status=" + encodeURIComponent(status));
        setItems(result.items || []);
      }
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [initialId, status]);

  if (initialId) {
    if (!detail && loading) return <div className="py-20 text-center text-zinc-500">Loading booking…</div>;
    if (!detail) return <Empty text="Booking not found." />;
    const b = detail.booking;
    const paid = (detail.payments || []).filter((p: any) => p.status === "verified").reduce((sum: number, p: any) => sum + Number(p.amount_paise || 0), 0);
    return <BookingDetail booking={b} payments={detail.payments || []} paid={paid} reload={load} />;
  }

  return (
    <div>
      <Toolbar query={query} setQuery={setQuery} status={status} setStatus={setStatus} placeholder="Search booking ID, client or email…" />
      {loading ? <div className="py-16 text-center text-zinc-500">Loading bookings…</div> : items.length === 0 ? <Empty /> :
        <Table><thead><tr className="text-[10px] uppercase tracking-wider text-zinc-600 border-b border-white/10"><th className="text-left px-4 py-3">Booking</th><th className="text-left px-4 py-3">Client</th><th className="text-left px-4 py-3">Service</th><th className="text-right px-4 py-3">Total</th><th className="text-right px-4 py-3">Advance</th><th className="text-left px-4 py-3">Status</th></tr></thead><tbody>
          {items.map((b) => <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]"><td className="px-4 py-3"><Link href={"/nsdtheadmin/bookings/" + b.id} className="font-mono text-indigo-300 text-xs">{b.booking_reference}</Link><div className="text-[10px] text-zinc-600 mt-1">{dateTime(b.created_at)}</div></td><td className="px-4 py-3"><div className="font-medium">{b.customer_name}</div><div className="text-xs text-zinc-600">{b.customer_email}</div></td><td className="px-4 py-3 text-xs text-zinc-400">{b.service_name_snapshot}<div className="text-zinc-600">{b.package_name_snapshot}</div></td><td className="px-4 py-3 text-right">{money(b.total_amount_paise)}</td><td className="px-4 py-3 text-right text-indigo-300">{money(b.advance_amount_paise)}</td><td className="px-4 py-3"><Badge tone={getTone(b.booking_status)}>{b.booking_status}</Badge></td></tr>)}
        </tbody></Table>}
    </div>
  );
}

function BookingDetail({ booking, payments, paid, reload }: { booking: any; payments: any[]; paid: number; reload: () => void }) {
  const [status, setStatus] = useState(booking.booking_status);
  const [manual, setManual] = useState({ amount: "", method: "UPI", reference: "" });

  async function saveStatus() {
    await api("bookings/" + booking.id, { method: "PATCH", body: JSON.stringify({ bookingStatus: status }) });
    reload();
  }

  async function addManual() {
    const amountPaise = Math.round(Number(manual.amount) * 100);
    await api("manual-payment/" + booking.id, { method: "POST", body: JSON.stringify({ amountPaise, method: manual.method, reference: manual.reference }) });
    setManual({ amount: "", method: "UPI", reference: "" });
    reload();
  }

  return <div className="space-y-5">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><Link href="/nsdtheadmin/bookings" className="text-xs text-indigo-300">← All bookings</Link><h2 className="text-2xl md:text-3xl font-display font-bold mt-2">{booking.booking_reference}</h2><p className="text-sm text-zinc-500 mt-1">{booking.customer_name} • {booking.customer_email}</p></div><div className="flex items-center gap-2"><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-2 text-xs">{["AWAITING_PAYMENT","CONFIRMED","IN_PROGRESS","ON_HOLD","COMPLETED","CANCELLED","PAYMENT_FAILED","REFUNDED","EXPIRED"].map((x) => <option key={x}>{x}</option>)}</select><button onClick={saveStatus} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold">Save</button></div></div>
    <div className="grid sm:grid-cols-3 gap-3"><Card title="Project value" value={money(booking.total_amount_paise)} icon={CircleDollarSign} /><Card title="Advance expected" value={money(booking.advance_amount_paise)} icon={CircleDollarSign} /><Card title="Collected" value={money(paid)} sub={"Balance " + money(Math.max(0, Number(booking.balance_amount_paise) - Math.max(0, paid - Number(booking.advance_amount_paise))))} icon={Check} /></div>
    <div className="grid xl:grid-cols-2 gap-4">
      <Panel title="Client & scope"><dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"><InfoRow label="Name" value={booking.customer_name} /><InfoRow label="Email" value={booking.customer_email} /><InfoRow label="Phone" value={booking.customer_phone} /><InfoRow label="Business" value={booking.business_name || "—"} /><InfoRow label="Service" value={booking.service_name_snapshot} /><InfoRow label="Package" value={booking.package_name_snapshot} /><InfoRow label="Created" value={dateTime(booking.created_at)} /><InfoRow label="Confirmed" value={dateTime(booking.confirmed_at)} /></dl><pre className="mt-4 rounded-xl bg-black/20 border border-white/5 p-3 overflow-auto text-[11px] text-zinc-500">{JSON.stringify(booking.selected_options, null, 2)}</pre></Panel>
      <Panel title="Payments"><div className="space-y-2">{payments.length === 0 ? <Empty text="No payment records." /> : payments.map((p) => <div key={p.id} className="rounded-xl border border-white/10 p-3 flex items-center justify-between gap-3"><div><div className="text-sm font-medium">{money(p.amount_paise)} <Badge tone={getTone(p.status)}>{p.status}</Badge></div><div className="text-[10px] text-zinc-600 mt-1">{p.source} • {p.method || "—"} • {p.reference || p.razorpay_payment_id || "—"}</div></div><div className="text-[10px] text-zinc-600">{dateTime(p.paid_at || p.created_at)}</div></div>)}</div></Panel>
    </div>
    <Panel title="Manual/offline payment"><div className="grid md:grid-cols-3 gap-2"><input value={manual.amount} onChange={(e)=>setManual({...manual,amount:e.target.value})} placeholder="Amount ₹" inputMode="decimal" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><select value={manual.method} onChange={(e)=>setManual({...manual,method:e.target.value})} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-2.5 text-sm"><option>UPI</option><option>Bank Transfer</option><option>Cash</option><option>Other</option></select><input value={manual.reference} onChange={(e)=>setManual({...manual,reference:e.target.value})} placeholder="Payment reference" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/></div><button onClick={addManual} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold">Mark as Manual Payment</button><p className="mt-2 text-[10px] text-zinc-600">Manual entries are stored separately from Razorpay records and are audit logged.</p></Panel>
  </div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-display font-semibold">{title}</h3></div>{children}</section>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</div><div className="mt-1 text-sm text-zinc-300 break-words">{value}</div></div>;
}

function PaymentsView() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => { api("payments?q=" + encodeURIComponent(query) + "&status=" + encodeURIComponent(status)).then((d)=>setItems(d.items||[])).catch(()=>setItems([])); }, [status]);
  return <div><Toolbar query={query} setQuery={setQuery} status={status} setStatus={setStatus} placeholder="Search payment/order ID…" />{items.length===0?<Empty/>:<Table><thead><tr className="text-[10px] uppercase tracking-wider text-zinc-600 border-b border-white/10"><th className="text-left px-4 py-3">Payment</th><th className="text-left px-4 py-3">Booking</th><th className="text-left px-4 py-3">Client</th><th className="text-right px-4 py-3">Amount</th><th className="text-left px-4 py-3">Status</th></tr></thead><tbody>{items.map(p=><tr key={p.id} className="border-b border-white/5"><td className="px-4 py-3 text-xs font-mono">{p.razorpay_payment_id || p.reference || p.id}<div className="text-[10px] text-zinc-600">{p.source}</div></td><td className="px-4 py-3 text-xs">{p.service_bookings?.booking_reference || "—"}</td><td className="px-4 py-3 text-xs">{p.service_bookings?.customer_name || "—"}</td><td className="px-4 py-3 text-right">{money(p.amount_paise)}</td><td className="px-4 py-3"><Badge tone={getTone(p.status)}>{p.status}</Badge></td></tr>)}</tbody></Table>}</div>;
}

function LeadsView() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  async function load(){const d=await api("leads?q="+encodeURIComponent(query)+"&status="+encodeURIComponent(status));setItems(d.items||[]);}
  useEffect(()=>{load().catch(()=>setItems([]));},[status]);
  async function setLead(id:string,next:string){await api("leads/"+id,{method:"PATCH",body:JSON.stringify({status:next})});load();}
  return <div><Toolbar query={query} setQuery={setQuery} status={status} setStatus={setStatus} placeholder="Search lead, email or business…"/>{items.length===0?<Empty/>:<div className="space-y-2">{items.map(l=><div key={l.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div className="min-w-0"><div className="font-medium">{l.name}</div><div className="text-xs text-zinc-500">{l.email} {l.phone ? "• "+l.phone : ""}</div><div className="text-xs text-indigo-300 mt-2">{l.service || "General enquiry"}</div><p className="text-sm text-zinc-400 mt-2">{l.message}</p><div className="text-[10px] text-zinc-600 mt-2">{dateTime(l.created_at)}</div></div><div className="flex flex-wrap gap-2">{["contacted","qualified","proposal_sent","won","lost","archived"].map(s=><button key={s} onClick={()=>setLead(l.id,s)} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-zinc-400 hover:text-white">{s}</button>)}</div></div></div>)}</div>}</div>;
}

function NotificationsView() {
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ title:"", message:"", url:"/", notificationType:"announcement", audience:"all", scheduledFor:"" });
  const [status, setStatus] = useState("");
  async function load(){const d=await api("notifications");setHistory(d.items||[]);}
  useEffect(()=>{load();},[]);
  async function send(){setStatus("Working…");try{const d=await api("notifications/send",{method:"POST",body:JSON.stringify(form)});setStatus(d.scheduled ? "Notification scheduled." : "Sent to "+d.recipients+" registrations • "+d.sent+" delivered attempts • "+d.failed+" failed");load();}catch(e:any){setStatus(e.message)}}
  return <div className="grid xl:grid-cols-[1fr_420px] gap-4"><Panel title="Send push notification"><div className="space-y-3"><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"/><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={5} placeholder="Message" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"/><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="URL, e.g. /tips/branding/my-tip" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"/><div className="grid grid-cols-2 gap-2"><select value={form.notificationType} onChange={e=>setForm({...form,notificationType:e.target.value})} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-3 text-sm"><option>announcement</option><option>tip</option><option>new-service</option><option>portfolio</option><option>offer</option><option>system</option></select><select value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-3 text-sm"><option value="all">All active subscribers</option><option value="selected">Selected (API)</option></select></div><input type="datetime-local" value={form.scheduledFor} onChange={e=>setForm({...form,scheduledFor:e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"/><button onClick={send} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold">Send Notification Now</button>{status&&<p className="text-xs text-zinc-500">{status}</p>}</div></Panel><Panel title="Notification history">{history.length===0?<Empty/>:<div className="space-y-2">{history.map(h=><div key={h.id} className="rounded-xl border border-white/10 p-3"><div className="font-medium text-sm">{h.title}</div><div className="text-xs text-zinc-500 mt-1">{h.body}</div><div className="flex gap-2 mt-2"><Badge>{h.audience}</Badge><span className="text-[10px] text-zinc-600">{h.sent_count} sent • {h.failed_count} failed • {dateTime(h.sent_at)}</span></div></div>)}</div>}</Panel></div>;
}

function SubscribersView() {
  const [items,setItems]=useState<any[]>([]);
  const [status,setStatus]=useState("");
  async function load(){const d=await api("notification-subscribers?status="+encodeURIComponent(status));setItems(d.items||[]);}
  useEffect(()=>{load();},[status]);
  async function toggle(id:string,next:string){await api("notification-subscribers/"+id,{method:"PATCH",body:JSON.stringify({status:next})});load();}
  async function remove(id:string){if(!confirm("Remove this notification registration?"))return;await api("notification-subscribers/"+id,{method:"DELETE"});load();}
  const active=items.filter(i=>i.status==="active").length;
  return <div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"><Card title="Listed" value={String(items.length)} icon={Bell}/><Card title="Active" value={String(active)} icon={Check}/><Card title="Inactive" value={String(items.length-active)} icon={X}/><Card title="New today" value="—" sub="Shown from dashboard when available" icon={Plus}/></div><Toolbar query={""} setQuery={()=>{}} status={status} setStatus={setStatus}/>{items.length===0?<Empty/>:<Table><thead><tr className="text-[10px] uppercase tracking-wider text-zinc-600 border-b border-white/10"><th className="text-left px-4 py-3">Registration</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Created</th><th className="text-left px-4 py-3">Last seen</th><th className="text-left px-4 py-3">Device</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody>{items.map(s=><tr key={s.id} className="border-b border-white/5"><td className="px-4 py-3 font-mono text-[10px] text-zinc-500">{s.id}</td><td className="px-4 py-3"><Badge tone={getTone(s.status)}>{s.status}</Badge></td><td className="px-4 py-3 text-xs text-zinc-500">{dateTime(s.created_at)}</td><td className="px-4 py-3 text-xs text-zinc-500">{dateTime(s.last_seen_at)}</td><td className="px-4 py-3 text-xs text-zinc-500 max-w-xs truncate">{s.user_agent||"—"}</td><td className="px-4 py-3 text-right"><button onClick={()=>toggle(s.id,s.status==="active"?"inactive":"active")} className="text-xs text-indigo-300 mr-3">{s.status==="active"?"Deactivate":"Reactivate"}</button><button onClick={()=>remove(s.id)} className="text-xs text-red-300"><Trash2 className="w-3.5 h-3.5 inline"/></button></td></tr>)}</tbody></Table>}</div>;
}

function TipsView() {
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({title:"",slug:"",category:"Branding",excerpt:"",status:"draft",scheduledFor:"",content:""});
  async function load(){const d=await api("tips");setItems(d.items||[]);}
  useEffect(()=>{load();},[]);
  async function create(){let content:any[]=[];if(form.content.trim()){try{const parsed=JSON.parse(form.content);content=Array.isArray(parsed)?parsed:[]}catch{alert("Tip content must be valid JSON array or blank.");return;}}await api("tips",{method:"POST",body:JSON.stringify({...form,content,status:form.scheduledFor?"draft":form.status})});setForm({title:"",slug:"",category:"Branding",excerpt:"",status:"draft",scheduledFor:"",content:""});load();}
  async function publish(id:string,status:string){await api("tips/"+id,{method:"PATCH",body:JSON.stringify({status})});load();}
  return <div className="grid xl:grid-cols-[420px_1fr] gap-4"><Panel title="Create tip"><div className="space-y-2"><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><input value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} placeholder="Slug (optional)" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder='Content JSON array (optional)' rows={5} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-mono"/><input type="datetime-local" value={form.scheduledFor} onChange={e=>setForm({...form,scheduledFor:e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><textarea value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="Summary / excerpt" rows={4} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><button onClick={create} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold">Create Draft</button></div></Panel><div className="space-y-2">{items.length===0?<Empty text="No CMS tips yet. Existing static tips remain intact."/>:items.map(t=><div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-medium">{t.title}</div><div className="text-xs text-zinc-600 mt-1">{t.category} • {t.slug}</div></div><Badge tone={getTone(t.status)}>{t.status}</Badge></div><p className="text-sm text-zinc-500 mt-2">{t.excerpt}</p><div className="mt-3 flex gap-2">{t.status!=="published"&&<button onClick={()=>publish(t.id,"published")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs">Publish</button>} {t.status!=="archived"&&<button onClick={()=>publish(t.id,"archived")} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Archive</button>}</div></div>)}</div></div>;
}

function ServicesView() {
  const [items,setItems]=useState<any[]>([]);
  const [saving,setSaving]=useState<string>("");
  async function load(){const d=await api("services");setItems(d.items||[]);}
  useEffect(()=>{load();},[]);
  function updatePackage(serviceId:string,index:number,price:string){setItems(current=>current.map(s=>s.id!==serviceId?s:{...s,packages:s.packages.map((p:any,i:number)=>i===index?{...p,price}:p)}));}
  async function save(s:any){setSaving(s.id);await api("services/"+s.id,{method:"PATCH",body:JSON.stringify({config:{name:s.name,shortDescription:s.shortDescription,active:s.active,featured:s.featured,startingPrice:s.startingPrice,pricingPrefix:s.pricingPrefix,pricingPeriod:s.pricingPeriod,packages:s.packages}})});setSaving("");}
  return <div className="space-y-3">{items.map(s=><div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
      <div><h3 className="font-display font-semibold">{s.name}</h3><p className="text-xs text-zinc-600 mt-1">{s.id} • {s.categoryGroup}</p></div>
      <div className="flex items-center gap-3 text-xs">
        <label className="flex gap-2 items-center"><input type="checkbox" checked={s.active!==false} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,active:e.target.checked}:x))}/>Active</label>
        <label className="flex gap-2 items-center"><input type="checkbox" checked={Boolean(s.featured)} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,featured:e.target.checked}:x))}/>Featured</label>
        <button onClick={()=>save(s)} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs">{saving===s.id?"Saving…":"Save"}</button>
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-2 mt-4">
      <input value={s.name} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,name:e.target.value}:x))} placeholder="Service name" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm"/>
      <input value={s.startingPrice||""} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,startingPrice:e.target.value}:x))} placeholder="Starting price" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm"/>
      <select value={s.pricingPrefix||"Starting from"} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,pricingPrefix:e.target.value}:x))} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-2.5 text-sm"><option>Starting from</option><option>Fixed Price</option><option>Custom Quote</option></select>
      <select value={s.pricingPeriod||""} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,pricingPeriod:e.target.value}:x))} className="rounded-xl border border-white/10 bg-[#0b0b10] px-3 py-2.5 text-sm"><option value="">One-time</option><option value="/month">Monthly</option></select>
      <textarea value={s.shortDescription||""} onChange={e=>setItems(cur=>cur.map(x=>x.id===s.id?{...x,shortDescription:e.target.value}:x))} placeholder="Short description" rows={3} className="md:col-span-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm"/>
    </div>
    <div className="grid sm:grid-cols-3 gap-2 mt-4">{s.packages.map((p:any,i:number)=><div key={p.name} className="rounded-xl border border-white/10 p-3"><div className="text-xs font-medium">{p.name}</div><input value={p.price} onChange={e=>updatePackage(s.id,i,e.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs"/></div>)}</div>
    <div className="mt-3 text-[10px] text-zinc-600">Use exact fixed prices for payable packages. Keep “+” and price ranges for quotation-only services.</div>
  </div>)}</div>;
}

function TestimonialsView() {
  const [items,setItems]=useState<any[]>([]);
  async function load(){const d=await api("testimonials");setItems(d.items||[]);}
  useEffect(()=>{load();},[]);
  async function setStatus(id:string,status:string){await api("testimonials/"+id,{method:"PATCH",body:JSON.stringify({status})});load();}
  return <div>{items.length===0?<Empty/>:<div className="space-y-2">{items.map(t=><div key={t.id} className="rounded-2xl border border-white/10 p-4"><div className="flex flex-col md:flex-row md:items-start justify-between gap-4"><div><div className="font-medium">{t.name}</div><div className="text-xs text-zinc-600">{t.business_name||"—"} • {t.rating}/5</div><p className="mt-2 text-sm text-zinc-400">{t.review}</p></div><div className="flex flex-wrap gap-2">{["approved","rejected","archived"].map(s=><button key={s} onClick={()=>setStatus(t.id,s)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">{s}</button>)}</div></div></div>)}</div>}</div>;
}

function PortfolioView() {
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({title:"",category:"video",clientName:"",description:"",thumbnailUrl:"",projectUrl:"",status:"draft",featured:false});
  async function load(){const d=await api("portfolio");setItems(d.items||[]);}
  useEffect(()=>{load();},[]);
  async function create(){await api("portfolio",{method:"POST",body:JSON.stringify(form)});setForm({title:"",category:"video",clientName:"",description:"",thumbnailUrl:"",projectUrl:"",status:"draft",featured:false});load();}
  async function status(id:string,next:string){await api("portfolio/"+id,{method:"PATCH",body:JSON.stringify({status:next})});load();}
  return <div className="grid xl:grid-cols-[420px_1fr] gap-4"><Panel title="Add portfolio project"><div className="space-y-2">{Object.entries(form).filter(([k])=>k!=="status"&&k!=="featured").map(([key,value])=><input key={key} value={String(value)} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={key} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/>)}<label className="flex gap-2 text-xs"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured</label><button onClick={create} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold">Create Project</button></div></Panel><div className="space-y-2">{items.length===0?<Empty text="No CMS portfolio items yet. Existing static work remains intact."/>:items.map(p=><div key={p.id} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between gap-3"><div><div className="font-medium">{p.title}</div><div className="text-xs text-zinc-600">{p.category} • {p.client_name||"—"}</div></div><Badge tone={getTone(p.status)}>{p.status}</Badge></div><p className="text-sm text-zinc-500 mt-2">{p.description}</p><div className="mt-3 flex gap-2">{p.status!=="published"&&<button onClick={()=>status(p.id,"published")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs">Publish</button>} {p.status!=="archived"&&<button onClick={()=>status(p.id,"archived")} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Archive</button>}</div></div>)}</div></div>;
}

function SettingsView({ mode }: { mode: string }) {
  const [items,setItems]=useState<any[]>([]);
  const [key,setKey]=useState("");
  const [value,setValue]=useState("{}");
  async function load(){const d=await api(mode);setItems(d.items||[]);}
  useEffect(()=>{load();},[mode]);
  async function save(){let parsed:any;try{parsed=JSON.parse(value)}catch{alert("Value must be valid JSON.");return;}await api(mode+"/"+key,{method:"PATCH",body:JSON.stringify({value:parsed})});setKey("");setValue("{}");load();}
  return <div className="grid xl:grid-cols-[360px_1fr] gap-4"><Panel title="Add / update setting"><input value={key} onChange={e=>setKey(e.target.value)} placeholder="Key, e.g. whatsapp_url" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><textarea value={value} onChange={e=>setValue(e.target.value)} rows={8} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-mono" /><button disabled={!key} onClick={save} className="mt-2 w-full rounded-xl bg-indigo-600 disabled:opacity-40 py-3 font-semibold">Save Setting</button></Panel><Panel title={mode === "seo" ? "SEO configuration" : "Runtime site content"}>{items.length===0?<Empty text="No runtime settings configured yet."/>:<div className="space-y-2">{items.map(item=><button key={item.key} onClick={()=>{setKey(item.key);setValue(JSON.stringify(item.value,null,2))}} className="w-full text-left rounded-xl border border-white/10 p-3 hover:bg-white/[0.03]"><div className="font-mono text-xs text-indigo-300">{item.key}</div><pre className="text-[11px] text-zinc-500 mt-1 whitespace-pre-wrap">{JSON.stringify(item.value)}</pre></button>)}</div>}</Panel></div>;
}

function SecurityView() {
  const [data,setData]=useState<any>(null);
  const [password,setPassword]=useState("");
  async function load(){setData(await api("security"))}
  useEffect(()=>{load()},[]);
  async function rotate(){if(password.length<12){alert("Use at least 12 characters.");return;}await api("security/rotate-password",{method:"PATCH",body:JSON.stringify({newPassword:password})});setPassword("");alert("Password rotated. All sessions were revoked.");window.location.href="/nsdtheadmin/login";}
  async function logoutAll(){await api("security/logout-all",{method:"PATCH",body:"{}"});window.location.href="/nsdtheadmin/login";}
  return <div className="grid lg:grid-cols-2 gap-4"><Panel title="Security status">{!data?<div className="py-10 text-center text-zinc-500">Loading…</div>:<div className="space-y-3"><InfoRow label="Active sessions" value={String(data.activeSessions)}/><InfoRow label="Last login" value={data.lastLogin?dateTime(data.lastLogin.created_at):"No data yet"}/><InfoRow label="Last failed login" value={data.lastFailure?dateTime(data.lastFailure.created_at):"No data yet"}/><Health label="Bootstrap password configured" ok={data.configured.bootstrap}/><Health label="Razorpay" ok={data.configured.razorpay}/><Health label="Webhook" ok={data.configured.webhook}/><Health label="Push" ok={data.configured.push}/></div>}</Panel><Panel title="Credential rotation"><p className="text-xs text-zinc-500 mb-3">Changing the password immediately revokes every administrator session.</p><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="New password (minimum 12 characters)" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm"/><button onClick={rotate} className="mt-2 w-full rounded-xl bg-indigo-600 py-3 font-semibold">Rotate Password</button><button onClick={logoutAll} className="mt-2 w-full rounded-xl border border-red-500/20 text-red-300 py-3 text-sm">Logout All Sessions</button></Panel></div>;
}

function QuotesView() {
  const [items,setItems]=useState<any[]>([]);
  const [form,setForm]=useState({customerName:"",customerEmail:"",serviceId:"",scope:"",totalPaise:"",advancePercentage:"50"});
  async function load(){try{const d=await api("quotes");setItems(d.items||[])}catch{}}
  useEffect(()=>{load()},[]);
  async function create(){await api("quotes",{method:"POST",body:JSON.stringify({...form,totalPaise:Number(form.totalPaise)*100})});setForm({customerName:"",customerEmail:"",serviceId:"",scope:"",totalPaise:"",advancePercentage:"50"});load();}
  async function setStatus(id:string,status:string){await api("quotes/"+id,{method:"PATCH",body:JSON.stringify({status})});load();}
  return <div className="grid xl:grid-cols-[420px_1fr] gap-4"><Panel title="Create quotation"><div className="space-y-2">{["customerName","customerEmail","serviceId","totalPaise"].map(k=><input key={k} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k==="totalPaise"?"Total ₹":k} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/>)}<input value={form.advancePercentage} onChange={e=>setForm({...form,advancePercentage:e.target.value})} placeholder="Advance %" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><textarea value={form.scope} onChange={e=>setForm({...form,scope:e.target.value})} rows={5} placeholder="Scope" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm"/><button onClick={create} className="w-full rounded-xl bg-indigo-600 py-3 font-semibold">Create Draft Quote</button></div></Panel><div className="space-y-2">{items.length===0?<Empty/>:items.map(q=><div key={q.id} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between gap-3"><div><div className="font-medium">{q.quote_reference}</div><div className="text-xs text-zinc-500">{q.customer_name} • {q.customer_email}</div></div><Badge tone={getTone(q.status)}>{q.status}</Badge></div><div className="mt-2 text-sm">{money(q.total_paise)} total • {q.advance_percentage}% advance • {money(q.advance_amount_paise)} today</div><div className="mt-3 flex gap-2">{q.status==="DRAFT"&&<button onClick={()=>setStatus(q.id,"SENT")} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs">Mark Sent</button>}{q.status==="SENT"&&<button onClick={()=>setStatus(q.id,"ACCEPTED")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs">Mark Accepted</button>}</div></div>)}</div></div>;
}

function LogsView() {
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{api("audit-logs").then(d=>setItems(d.items||[])).catch(()=>setItems([]));},[]);
  return items.length===0?<Empty/>:<div className="space-y-2">{items.map(log=><div key={log.id} className="rounded-2xl border border-white/10 p-4"><div className="flex flex-col md:flex-row md:items-start justify-between gap-2"><div><Badge tone={getTone(log.action)}>{log.action}</Badge><p className="mt-2 text-sm text-zinc-300">{log.summary}</p><p className="text-[10px] text-zinc-600 mt-1">Target: {log.target||"—"} • Actor: {log.actor}</p></div><div className="text-[10px] text-zinc-600">{dateTime(log.created_at)}</div></div></div>)}</div>;
}
