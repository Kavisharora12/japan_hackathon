"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SERVICES, KNOWLEDGE_BASE, ServiceCategory, TravelService } from "@/data/services";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { Reveal } from "@/components/Reveal";

const CATEGORIES: Array<{ key: "all" | ServiceCategory; label: string; ja: string; stamp: string }> = [
  { key: "all", label: "All Services", ja: "全般", stamp: "便" },
  { key: "taxi", label: "Taxi Booking", ja: "配車", stamp: "車" },
  { key: "food", label: "Food & Dining", ja: "飲食", stamp: "食" },
  { key: "connectivity", label: "eSIM & Wi-Fi", ja: "通信", stamp: "電" },
  { key: "payments", label: "Payments & IC", ja: "決済", stamp: "円" },
];

export default function ServicesPage() {
  const [selectedCat, setSelectedCat] = useState<"all" | ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCat = selectedCat === "all" || s.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchText =
        s.name.toLowerCase().includes(q) ||
        s.japaneseName.includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.indiaTip.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [selectedCat, searchQuery]);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-[max(env(safe-area-inset-top),16px)] pb-24">
      {/* Masthead */}
      <header className="flex items-end justify-between border-b-[1.5px] border-sumi pb-2.5">
        <div>
          <span className="eyebrow text-shu">Tourist Bureau Directory · 観光案内</span>
          <h1 className="display text-4xl font-semibold text-sumi mt-0.5">
            Essential Services in Japan
          </h1>
        </div>
        <span
          lang="ja"
          className="font-mincho text-sm font-extrabold text-sumi-soft hidden sm:block"
        >
          推奨サービス案内
        </span>
      </header>

      <p className="mt-3 max-w-[50ch] text-[1.05rem] leading-relaxed text-sumi-soft">
        Curated travel apps, transport IC card setup, high-speed tourist data, and India-specific payment rules for traveling across Japan.
      </p>

      {/* Category Navigation Pills */}
      <nav aria-label="Categories" className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCat(cat.key)}
              className={`press flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-sumi text-washi shadow-sm"
                  : "bg-washi border border-sumi/30 text-sumi hover:border-sumi on-pastel"
              }`}
            >
              <span className="font-mincho font-extrabold opacity-70" aria-hidden>
                [{cat.stamp}]
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Search Input */}
      <div className="mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by app, service, or keyword (e.g. 'eSIM', 'Suica', 'Indian curry', 'ATM')..."
          className="w-full rounded-xl border-[1.5px] border-sumi bg-washi px-4 py-3 text-sm text-sumi placeholder:text-sumi-soft/50 outline-none on-pastel"
        />
      </div>

      {/* ── Currency Converter (Shows when 'all' or 'payments' is active) ── */}
      {(selectedCat === "all" || selectedCat === "payments") && !searchQuery && (
        <section className="mt-8">
          <CurrencyConverter />
        </section>
      )}

      {/* ── Services Cards Grid ── */}
      <section className="mt-8 space-y-4">
        <div className="flex items-baseline justify-between border-b-[1.5px] border-sumi/15 pb-2">
          <h2 className="display text-2xl font-semibold text-sumi">
            Recommended Directory
          </h2>
          <span className="text-xs font-mono text-sumi-soft">
            {filteredServices.length} verified services
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="rounded-xl border border-sumi/20 bg-washi p-8 text-center text-sumi-soft">
            <p className="font-mincho text-lg">該当するサービスが見つかりません</p>
            <p className="mt-1 text-sm">No services found matching your search. Try another keyword or clear filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => {
              const isExpanded = expandedCard === service.id;
              return (
                <div
                  key={service.id}
                  className="on-pastel rounded-xl border-[1.5px] border-sumi bg-washi-deep p-5 ink ink-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Name, Japanese, Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="display text-xl font-bold text-sumi">
                            {service.name}
                          </h3>
                          <span className="text-xs font-mono text-sumi-soft">
                            ({service.platform})
                          </span>
                        </div>
                        <p lang="ja" className="font-mincho text-xs font-extrabold text-sumi-soft mt-0.5">
                          {service.japaneseName} · {service.categoryLabel}
                        </p>
                      </div>
                      {service.badge && (
                        <span className="rounded-md bg-sakura/50 border border-sumi/20 px-2 py-0.5 text-[10.5px] font-bold text-sumi tracking-tight shrink-0">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Tagline & Use Case */}
                    <p className="mt-2.5 text-sm font-semibold text-sumi leading-snug">
                      {service.tagline}
                    </p>
                    <p className="mt-1 text-xs text-sumi-soft">
                      <strong className="text-sumi">When to use:</strong> {service.useCase}
                    </p>

                    {/* India Travel Tip */}
                    <div className="mt-3 rounded-lg bg-washi p-3 border border-sumi/20 text-xs text-sumi leading-relaxed">
                      <span className="eyebrow block text-shu mb-0.5">Advice for Indian Travellers</span>
                      {service.indiaTip}
                    </div>

                    {/* Expandable Setup Instructions */}
                    {isExpanded && (
                      <div className="mt-3 rounded-lg bg-washi p-3 border border-sumi/20 text-xs text-sumi-soft space-y-1.5 animate-in fade-in duration-200">
                        <span className="eyebrow block text-sumi mb-1">Setup Instructions</span>
                        {service.setupSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-sumi">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-sumi/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedCard(isExpanded ? null : service.id)}
                      className="text-xs font-bold text-sumi-soft hover:text-sumi underline underline-offset-2"
                    >
                      {isExpanded ? "Hide setup instructions" : "Show setup instructions"}
                    </button>
                    <a
                      href={service.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press rounded-lg bg-sumi px-3 py-1.5 text-xs font-bold text-washi shadow-sm hover:opacity-90 shrink-0"
                    >
                      Official Site ➔
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Knowledge & Cultural Rules for Indian Travelers ── */}
      <section className="mt-12">
        <Reveal>
          <div className="border-b-[1.5px] border-sumi pb-2">
            <span className="eyebrow text-shu">Essential Knowledge · 旅の心得</span>
            <h2 className="display text-3xl font-semibold text-sumi mt-0.5">
              Rules of Thumb for Indian Visitors
            </h2>
          </div>
        </Reveal>

        <div className="mt-6 space-y-4">
          {KNOWLEDGE_BASE.map((item) => (
            <div
              key={item.id}
              className="on-pastel rounded-xl border-[1.5px] border-sumi bg-washi-deep p-5 ink ink-shadow"
            >
              <h3 className="display text-lg font-bold text-sumi">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-shu">
                {item.summary}
              </p>
              <ul className="mt-3 space-y-1.5 border-t border-sumi/15 pt-3 text-xs text-sumi-soft leading-relaxed">
                {item.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sumi font-bold">・</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {item.actionHref && item.actionLabel && (
                <div className="mt-3 pt-2">
                  <Link
                    href={item.actionHref}
                    className="inline-block rounded-lg bg-sumi px-3.5 py-1.5 text-xs font-bold text-washi shadow-sm hover:opacity-90"
                  >
                    {item.actionLabel} ➔
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
