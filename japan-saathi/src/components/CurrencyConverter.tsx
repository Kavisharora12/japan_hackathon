"use client";

import { useState } from "react";
import { CALIBRATED_JPY_INR_RATE } from "@/data/services";

export function CurrencyConverter() {
  const [jpy, setJpy] = useState<string>("1000");
  const [inr, setInr] = useState<string>(Math.round(1000 * CALIBRATED_JPY_INR_RATE).toString());
  const [rate] = useState<number>(CALIBRATED_JPY_INR_RATE);

  function handleJpyChange(val: string) {
    setJpy(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setInr(Math.round(num * rate).toString());
    } else {
      setInr("");
    }
  }

  function handleInrChange(val: string) {
    setInr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setJpy(Math.round(num / rate).toString());
    } else {
      setJpy("");
    }
  }

  const QUICK_RATES = [
    { jpy: 150, label: "Snack / Water (¥150)", inr: Math.round(150 * rate) },
    { jpy: 500, label: "Subway ride (¥500)", inr: Math.round(500 * rate) },
    { jpy: 1200, label: "Lunch meal (¥1,200)", inr: Math.round(1200 * rate) },
    { jpy: 5000, label: "Tax-free limit (¥5,000)", inr: Math.round(5000 * rate) },
    { jpy: 14000, label: "Shinkansen ticket (¥14,000)", inr: Math.round(14000 * rate) },
  ];

  return (
    <div className="on-pastel rounded-xl border-[1.5px] border-sumi bg-washi-deep p-5 ink ink-shadow">
      <div className="flex items-start justify-between border-b-[1.5px] border-sumi/20 pb-3">
        <div>
          <span className="eyebrow text-shu">Live Forex Calculator · 為替計算</span>
          <h3 className="display text-2xl font-semibold text-sumi mt-0.5">
            Japanese Yen (JPY) ⇄ Indian Rupee (INR)
          </h3>
          <p className="text-xs text-sumi-soft mt-1">
            Official benchmark rate: 100 JPY ≈ ₹{(100 * rate).toFixed(2)} INR
          </p>
        </div>
        <span
          lang="ja"
          className="grid h-11 w-11 place-items-center rounded-md border-[2px] border-sumi bg-washi font-mincho text-xl font-extrabold text-sumi shrink-0"
          aria-hidden
        >
          円
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Japanese Yen Input */}
        <div className="rounded-lg bg-washi p-3.5 border border-sumi/30 ink">
          <label htmlFor="jpy-input" className="eyebrow block text-sumi-soft mb-1">
            Japanese Yen (¥ JPY)
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mincho text-2xl font-bold text-sumi">¥</span>
            <input
              id="jpy-input"
              type="number"
              inputMode="numeric"
              value={jpy}
              onChange={(e) => handleJpyChange(e.target.value)}
              placeholder="1000"
              className="w-full bg-transparent font-mincho text-2xl font-bold text-sumi outline-none placeholder:text-sumi-soft/40"
            />
          </div>
        </div>

        {/* Indian Rupee Input */}
        <div className="rounded-lg bg-washi p-3.5 border border-sumi/30 ink">
          <label htmlFor="inr-input" className="eyebrow block text-sumi-soft mb-1">
            Indian Rupee (₹ INR)
          </label>
          <div className="flex items-center gap-2">
            <span className="font-sans text-2xl font-bold text-shu">₹</span>
            <input
              id="inr-input"
              type="number"
              inputMode="numeric"
              value={inr}
              onChange={(e) => handleInrChange(e.target.value)}
              placeholder="555"
              className="w-full bg-transparent font-sans text-2xl font-bold text-sumi outline-none placeholder:text-sumi-soft/40"
            />
          </div>
        </div>
      </div>

      {/* Quick Reference Chips */}
      <div className="mt-4 pt-3 border-t border-sumi/15">
        <span className="eyebrow block text-sumi-soft mb-2">Everyday Tourist Benchmarks:</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_RATES.map((q) => (
            <button
              key={q.jpy}
              type="button"
              onClick={() => handleJpyChange(q.jpy.toString())}
              className="press rounded-full bg-washi px-3 py-1 text-xs font-semibold text-sumi border border-sumi/20 hover:border-sumi transition-all on-pastel"
            >
              {q.label} ➔ <strong className="text-shu">₹{q.inr.toLocaleString("en-IN")}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
