"use client";

import { useCallback, useRef, useState } from "react";
import { templates } from "@/lib/templates";
import { splitText, getCharsPerCard } from "@/lib/textSplitter";
import TemplateSelector from "@/components/TemplateSelector";
import CardPreview from "@/components/CardPreview";
import CardRenderer, { CardRendererHandle } from "@/components/CardRenderer";

const SAMPLE_TEXT = `The morning light filtered through the curtains, casting long golden lines across the wooden floor. Sarah sat at her desk, coffee cup steaming beside her keyboard, and stared at the blinking cursor. She had been trying to write this letter for three weeks.

It wasn't that she didn't know what to say. She knew exactly what needed to be said. The problem was that words on a page felt so permanent, so final. Once written, they could never be unwritten. Once read, they could never be unread.

She took a slow breath and began to type. "Dear James," she wrote, and already her hands were trembling. Outside, a pair of sparrows argued over a crust of bread on the windowsill. Life went on, indifferent and beautiful.

The letter was about time. About how time moves differently when you are waiting for something — how it stretches and compresses, how an hour of joy vanishes in a heartbeat while a minute of grief can feel like a century. She wanted him to understand that she had not wasted a single moment. Every choice had been deliberate, even the ones that looked careless from the outside.

By the time she finished, the coffee was cold. The sparrows were gone. But the cursor had finally stopped blinking, replaced by lines and lines of honest, difficult, necessary words. She pressed send before she could think too hard about it.`;

type AppState = "idle" | "generating" | "ready" | "downloading";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("newspaper");

  const [appState, setAppState] = useState<AppState>("idle");
  const [segments, setSegments] = useState<string[]>([]);
  const [cardDataUrls, setCardDataUrls] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rendererRef = useRef<CardRendererHandle>(null);

  const activeTemplate = templates.find((t) => t.id === selectedTemplate) ?? templates[0];

  const charCount = inputText.trim().length;
  const charsPerCard = getCharsPerCard(activeTemplate.layout);
  const estimatedCards = charCount > 0 ? Math.ceil(charCount / charsPerCard) : 0;

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;
    setErrorMsg(null);
    setAppState("generating");
    setCardDataUrls([]);
    setProgress(0);

    const segs = splitText(inputText, charsPerCard);
    setSegments(segs);

    // Wait one tick for CardRenderer to mount its nodes
    await new Promise((r) => setTimeout(r, 100));

    try {
      if (!rendererRef.current) throw new Error("Renderer not ready.");
      const urls: string[] = [];
      const total = segs.length;

      // We capture in batches and update progress per card via a patched loop
      // The CardRendererHandle exposes a single `capture()` call; we call it
      // and poll a progress counter through a wrapper.
      const allUrls = await (async () => {
        const html2canvas = (await import("html2canvas-pro")).default;
        // Access internal refs via the DOM directly on rendered nodes.
        // We replicate the capture loop here to show per-card progress.
        const container = document.getElementById("card-renderer-container");
        if (!container) return await rendererRef.current!.capture();

        const cards = container.children;
        const results: string[] = [];
        for (let i = 0; i < cards.length; i++) {
          const el = cards[i] as HTMLElement;
          const prev = el.style.left;
          el.style.left = "0px";
          el.style.top = "0px";

          const canvas = await html2canvas(el, {
            width: 1080,
            height: 1080,
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: activeTemplate.cardBg,
          });

          el.style.left = prev;
          el.style.top = "-9999px";

          results.push(canvas.toDataURL("image/png"));
          setProgress(Math.round(((i + 1) / total) * 100));
        }
        return results;
      })();

      urls.push(...allUrls);
      setCardDataUrls(urls);
      setAppState("ready");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Generation failed.");
      setAppState("idle");
    }
  }, [inputText, charsPerCard, activeTemplate]);

  const handleDownload = useCallback(async () => {
    if (cardDataUrls.length === 0) return;
    setAppState("downloading");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      cardDataUrls.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(",")[1];
        const num = String(i + 1).padStart(2, "0");
        zip.file(`card-${num}.png`, base64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `text-cards-${activeTemplate.id}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Download failed. Please try again.");
    } finally {
      setAppState("ready");
    }
  }, [cardDataUrls, activeTemplate]);

  const isGenerating = appState === "generating";
  const isDownloading = appState === "downloading";
  const hasCards = cardDataUrls.length > 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-full lg:w-[420px] lg:min-h-screen flex-shrink-0 bg-gray-900 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
        {/* Logo / header */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-none">
                TextCard
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Turn text into shareable card images
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-7">
          {/* Input text */}
          <section>
            <label
              htmlFor="input-text"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Text
              {charCount > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  {charCount.toLocaleString()} chars
                  {estimatedCards > 0 && ` → ~${estimatedCards} cards`}
                </span>
              )}
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setCardDataUrls([]);
                setAppState("idle");
              }}
              rows={10}
              placeholder="Paste or type your text here..."
              className="w-full rounded-xl bg-gray-800 border border-white/10 text-gray-100 placeholder-gray-600 text-sm leading-relaxed px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              aria-describedby="input-text-hint"
            />
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Text will be split into multiple cards automatically.
              </p>
              {charCount > 0 && (
                <button
                  onClick={() => {
                    setInputText("");
                    setCardDataUrls([]);
                    setAppState("idle");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Template */}
          <section>
            <p className="text-sm font-medium text-gray-300 mb-3">
              Template
            </p>
            <TemplateSelector
              selectedId={selectedTemplate}
              onSelect={(id) => {
                setSelectedTemplate(id);
                setCardDataUrls([]);
                setAppState("idle");
              }}
            />
          </section>

          {/* Layout info */}
          <section>
            <p className="text-xs text-gray-500">
              Layout: <strong className="text-gray-400">{activeTemplate.layout === "two-column" ? "Two columns" : "Single column"}</strong>
              {" · ~"}{charsPerCard} chars/card
              {estimatedCards > 0 && <> &rarr; <strong className="text-gray-400">{estimatedCards} cards</strong></>}
            </p>
          </section>

          {/* Error */}
          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3"
            >
              {errorMsg}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 py-5 border-t border-white/10 flex flex-col gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Generating{progress > 0 ? ` ${progress}%` : "..."}
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Generate Cards
              </>
            )}
          </button>

          {hasCards && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Zipping...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download ZIP ({cardDataUrls.length} cards)
                </>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {hasCards ? (
                <>
                  {cardDataUrls.length} cards generated &middot;{" "}
                  <span className="text-indigo-300">{activeTemplate.name}</span>
                </>
              ) : (
                "Preview"
              )}
            </h2>
            {hasCards && (
              <p className="text-xs text-gray-500 mt-0.5">
                Click any card to view full size
              </p>
            )}
          </div>
          {hasCards && (
            <span className="text-xs bg-indigo-900/60 text-indigo-300 rounded-full px-3 py-1 font-medium">
              1080 &times; 1080 px
            </span>
          )}
        </div>

        <div className="px-6 py-6">
          {/* Progress bar */}
          {isGenerating && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Rendering cards...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!hasCards && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-gray-600"
                  aria-hidden="true"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 font-medium">No cards yet</p>
                <p className="text-gray-600 text-sm mt-1">
                  Enter your text, pick a template, then click{" "}
                  <strong className="text-gray-400">Generate Cards</strong>.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2 max-w-xs w-full opacity-40 pointer-events-none" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gray-800"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Card preview grid */}
          <CardPreview
            dataUrls={cardDataUrls}
            templateName={activeTemplate.name}
          />
        </div>
      </main>

      {/* Hidden card renderer — off-screen, but painted */}
      <div id="card-renderer-container" aria-hidden="true" style={{ position: "absolute", left: "-99999px", top: 0, pointerEvents: "none" }}>
        <CardRenderer
          ref={rendererRef}
          segments={segments}
          template={activeTemplate}
        />
      </div>
    </div>
  );
}
