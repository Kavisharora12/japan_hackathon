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
        // Fallback to scenario if mic is unavailable
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
    <div className={`rounded-xl border-[1.5px] border-sumi/30 bg-washi-deep p-5 ink ink-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b-[1.5px] border-sumi/20 pb-3">
        <div>
          <span className="eyebrow text-shu">Audio Interpreter · 音声通訳</span>
          <h2 className="display text-2xl font-semibold text-sumi mt-0.5">
            Listen to Driver &amp; Staff
          </h2>
          <p className="text-sm text-sumi-soft mt-1">
            Hold your phone toward the driver or train attendant when they speak in Japanese.
          </p>
        </div>
        <span
          lang="ja"
          className="grid h-12 w-12 place-items-center rounded-md border-[2px] border-sumi bg-washi font-mincho text-xl font-extrabold text-sumi shrink-0"
          aria-hidden
        >
          聴
        </span>
      </div>

      {/* Main Listen Button */}
      <div className="mt-5 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleToggleRecord}
          disabled={busy}
          className={`press relative flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold shadow-sm transition-all ${
            isRecording
              ? "bg-shu text-white animate-pulse"
              : busy
                ? "bg-washi text-sumi-soft cursor-wait"
                : "bg-sumi text-washi hover:opacity-90"
          }`}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-current" />
          <span>
            {isRecording
              ? "Listening to Japanese... Tap to translate"
              : busy
                ? "Translating speech..."
                : "Listen to Japanese (運転手さんの声を聞く)"}
          </span>
        </button>

        {micError && (
          <p className="mt-2 text-xs font-semibold text-bad text-center">
            {micError} (Tap scenario buttons below to test)
          </p>
        )}
      </div>

      {/* Test Scenarios (Without Emojis, Matching Theme) */}
      <div className="mt-5 rounded-lg bg-washi p-3.5 border border-sumi/20">
        <p className="eyebrow text-sumi-soft mb-2">
          Test Scenarios (Common driver questions):
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => simulateScenario("highway")}
            className="press rounded-full bg-washi-deep px-3.5 py-1.5 text-xs font-bold text-sumi border border-sumi/30 hover:border-sumi"
          >
            Highway toll? (高速)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("payment")}
            className="press rounded-full bg-washi-deep px-3.5 py-1.5 text-xs font-bold text-sumi border border-sumi/30 hover:border-sumi"
          >
            Cash or Card? (現金・カード)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("destination")}
            className="press rounded-full bg-washi-deep px-3.5 py-1.5 text-xs font-bold text-sumi border border-sumi/30 hover:border-sumi"
          >
            Where to? (どちらまで)
          </button>
          <button
            type="button"
            onClick={() => simulateScenario("trunk")}
            className="press rounded-full bg-washi-deep px-3.5 py-1.5 text-xs font-bold text-sumi border border-sumi/30 hover:border-sumi"
          >
            Open trunk? (トランク)
          </button>
        </div>
      </div>

      {/* Decoded Speech Output */}
      {data && (
        <div className="mt-5 space-y-4 rounded-xl bg-washi p-4 border-[1.5px] border-sumi ink ink-shadow animate-in fade-in duration-200">
          {/* What Was Said */}
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow text-shu">
                What was said · 日本語
              </span>
              <Speak text={data.japanese} label="Replay" />
            </div>
            <p className="font-mincho text-2xl font-extrabold text-sumi mt-1.5 leading-snug">
              {data.japanese}
            </p>
            <p className="text-xs font-mono text-sumi-soft mt-1">{data.romaji}</p>
          </div>

          {/* Meanings: English & Hindi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-sumi/20">
            <div className="rounded-lg bg-washi-deep p-3 border border-sumi/20">
              <span className="eyebrow text-sumi-soft block mb-1">English Meaning</span>
              <p className="text-sm font-bold text-sumi leading-snug">{data.english}</p>
            </div>
            <div className="rounded-lg bg-washi-deep p-3 border border-sumi/20">
              <span className="eyebrow text-sumi-soft block mb-1">Hindi (बुजुर्गों के लिए)</span>
              <p className="text-sm font-bold text-sumi leading-snug">{data.hindi}</p>
            </div>
          </div>

          {/* Quick Replies */}
          <div className="pt-3 border-t border-sumi/20">
            <p className="eyebrow text-sumi-soft mb-2.5">
              Tap to reply to driver · 運転手への返答:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.replies.map((reply, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-washi-deep border border-sumi/30 p-3 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-sumi">{reply.label_en}</p>
                      <p className="text-[11px] text-sumi-soft">{reply.label_hi}</p>
                    </div>
                    <Speak text={reply.text_ja} label="Say it" />
                  </div>
                  <div>
                    <p className="font-mincho text-base font-extrabold text-shu">
                      {reply.text_ja}
                    </p>
                    <p className="text-[11px] font-mono text-sumi-soft">{reply.romaji}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
