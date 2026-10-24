"use client";

import { useState } from "react";
import { useAudioRecorder } from "@/lib/useAudioRecorder";
import { Speak } from "@/components/Speak";

export interface DecodedSpeech {
  japanese: string;
  romaji: string;
  english: string;
  hindi: string;
  intent: string;
  replies: Array<{
    label_en: string;
    label_hi: string;
    text_ja: string;
    romaji: string;
  }>;
}

export function DriverListener({ className = "" }: { className?: string }) {
  const { isRecording, error: micError, startRecording, stopRecording } = useAudioRecorder();
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<DecodedSpeech | null>(null);
  const [activeReply, setActiveReply] = useState<string | null>(null);

  async function handleToggleRecord() {
    if (isRecording) {
      setBusy(true);
      const res = await stopRecording();
      if (res && res.base64) {
        await sendAudio(res.base64, res.mediaType);
      }
      setBusy(false);
    } else {
      const ok = await startRecording();
      if (!ok) {
        // Fallback to simulator if mic was denied
        simulateScenario("highway");
      }
    }
  }

  async function sendAudio(base64: string, mediaType: string) {
    try {
      setBusy(true);
      const res = await fetch("/api/taxi/listen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64, mediaType }),
      });
      if (!res.ok) throw new Error("Translation failed");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      // Fallback preset
      simulateScenario("highway");
    } finally {
      setBusy(false);
    }
  }

  async function simulateScenario(key: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/taxi/listen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: key }),
      });
      const json = await res.json();
      setData(json);
    } catch {
      // offline fallback
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`rounded-2xl border-2 border-sumi bg-white p-5 ink shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b-[1.5px] border-sumi/15 pb-3">
        <div>
          <span className="eyebrow text-shu">Live Audio Decoder</span>
          <h2 className="display text-xl font-bold text-sumi flex items-center gap-2">
            <span>🚕</span> Listen to Driver / Staff
          </h2>
          <p className="text-xs text-sumi-soft mt-0.5">
            Hold phone near the driver or staff member when they speak in Japanese.
          </p>
        </div>
      </div>

      {/* Main Listen Button */}
      <div className="mt-4 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleToggleRecord}
          disabled={busy}
          className={`press relative flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-base font-bold shadow-md transition-all ${
            isRecording
              ? "bg-[#b8452c] text-white animate-pulse"
              : busy
                ? "bg-washi-deep text-sumi-soft cursor-wait"
                : "bg-sumi text-washi hover:bg-[#3d3430]"
          }`}
        >
          <span className="text-xl">{isRecording ? "⏹️" : "🎙️"}</span>
          <span>
            {isRecording
              ? "Listening to Japanese... (Tap to translate)"
              : busy
                ? "Decoding speech with AI..."
                : "Tap to Listen to Driver (運転手さんの声を聞く)"}
          </span>
        </button>

        {micError && (
          <p className="mt-2 text-xs text-bad font-semibold text-center">
            {micError} (Try quick test buttons below)
          </p>
        )}
      </div>

      {/* Quick Test / Demo Simulator Buttons */}
      <div className="mt-4 rounded-xl bg-washi p-3 border border-sumi/10">
        <p className="text-[11px] font-bold uppercase tracking-wider text-sumi-soft mb-2">
          Demo Test Scenarios (Simulate what cab drivers ask):
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => simulateScenario("highway")}
            className="press rounded-full bg-white px-3 py-1.5 text-xs font-semibold border border-sumi/20 hover:border-shu"
          >
            🛣️ Highway toll? (高速)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("payment")}
            className="press rounded-full bg-white px-3 py-1.5 text-xs font-semibold border border-sumi/20 hover:border-shu"
          >
            💳 Cash or Card? (現金・カード)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("destination")}
            className="press rounded-full bg-white px-3 py-1.5 text-xs font-semibold border border-sumi/20 hover:border-shu"
          >
            📍 Where to? (どちらまで)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("trunk")}
            className="press rounded-full bg-white px-3 py-1.5 text-xs font-semibold border border-sumi/20 hover:border-shu"
          >
            🧳 Open trunk? (トランク)
          </button>
        </div>
      </div>

      {/* Decoded Output */}
      {data && (
        <div className="mt-5 space-y-4 rounded-xl bg-[#fffaf5] p-4 border-2 border-shu/30 animate-in fade-in duration-300">
          {/* Driver's Words */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-shu">
                What Driver Said (運転手さんの言葉)
              </span>
              <Speak text={data.japanese} label="Replay" className="text-xs" />
            </div>
            <p className="font-mincho text-2xl font-black text-sumi mt-1 leading-snug">
              {data.japanese}
            </p>
            <p className="text-xs text-sumi-soft font-mono mt-0.5">{data.romaji}</p>
          </div>

          {/* English & Hindi Meanings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-sumi/10">
            <div className="rounded-lg bg-white p-3 border border-sumi/10">
              <span className="text-[11px] font-bold uppercase text-sumi-soft">English Meaning</span>
              <p className="text-sm font-semibold text-sumi mt-1">{data.english}</p>
            </div>
            <div className="rounded-lg bg-[#fbf5ea] p-3 border border-amber-300">
              <span className="text-[11px] font-bold uppercase text-amber-900 flex items-center gap-1">
                <span>🇮🇳</span> बुजुर्गों के लिए (Hindi for Elders)
              </span>
              <p className="text-sm font-semibold text-sumi mt-1">{data.hindi}</p>
            </div>
          </div>

          {/* 1-Tap Responses */}
          <div className="pt-2 border-t border-sumi/10">
            <p className="text-xs font-bold uppercase tracking-wider text-sumi mb-2">
              Tap to Reply to Driver (運転手さんに答える):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.replies.map((reply, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 transition-all ${
                    activeReply === reply.text_ja
                      ? "border-shu bg-sakura/20 shadow-sm"
                      : "border-sumi/20 bg-white hover:border-sumi"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-sumi">{reply.label_en}</p>
                      <p className="text-[11px] text-sumi-soft">{reply.label_hi}</p>
                    </div>
                    <Speak text={reply.text_ja} label="Say it" />
                  </div>
                  <p className="font-mincho text-base font-extrabold text-shu mt-2">
                    {reply.text_ja}
                  </p>
                  <p className="text-[11px] font-mono text-sumi-soft mt-0.5">{reply.romaji}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
