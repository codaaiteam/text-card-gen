"use client";

import { useCallback, useRef, useState } from "react";
import { templates } from "@/lib/templates";
import { fonts } from "@/lib/fonts";
import { aspectRatios } from "@/lib/cardSize";
import { splitText, splitMarkdown, getCharsPerCard } from "@/lib/textSplitter";
import TemplateSelector from "@/components/TemplateSelector";
import FontSelector from "@/components/FontSelector";
import LivePreview from "@/components/LivePreview";
import CardPreview from "@/components/CardPreview";
import CardRenderer, { CardRendererHandle } from "@/components/CardRenderer";

const PREVIEW_SAMPLE_ZH = "清晨的阳光透过窗帘洒进来，在木地板上投下长长的金色光线。莎拉坐在书桌前，咖啡杯在键盘旁冒着热气，她盯着闪烁的光标。她已经尝试写这封信三个星期了。不是她不知道该说什么，她清楚地知道需要说什么。问题在于纸上的文字感觉如此永恒。";
const PREVIEW_SAMPLE_EN = "The morning light filtered through the curtains, casting long golden lines across the wooden floor. Sarah sat at her desk, coffee cup steaming beside her keyboard, and stared at the blinking cursor. She had been trying to write this letter for three weeks.";

const FONT_SIZES = [
  { label: "S",   value: 48 },
  { label: "M",   value: 56 },
  { label: "L",   value: 64 },
  { label: "XL",  value: 72 },
];

type AppState = "idle" | "generating" | "ready" | "downloading";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("book-classic");
  const [selectedFont, setSelectedFont] = useState("songti");
  const [fontSize, setFontSize] = useState(48);
  const [selectedRatio, setSelectedRatio] = useState("3:4");
  const [showIllustrations, setShowIllustrations] = useState(true);
  const [isMarkdown, setIsMarkdown] = useState(false);

  const [appState, setAppState] = useState<AppState>("idle");
  const [segments, setSegments] = useState<string[]>([]);
  const [cardDataUrls, setCardDataUrls] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rendererRef = useRef<CardRendererHandle>(null);

  const activeTemplate = templates.find((t) => t.id === selectedTemplate) ?? templates[0];
  const activeFont = fonts.find((f) => f.id === selectedFont) ?? fonts[0];
  const activeRatio = aspectRatios.find((r) => r.id === selectedRatio) ?? aspectRatios[0];
  const cardW = activeRatio.width;
  const cardH = activeRatio.height;

  const charCount = inputText.trim().length;
  const charsPerCard = getCharsPerCard(activeTemplate.layout, fontSize, cardW, cardH, showIllustrations);
  const estimatedCards = charCount > 0 ? Math.ceil(charCount / charsPerCard) : 0;

  const previewText = inputText.trim()
    ? inputText.trim().substring(0, charsPerCard)
    : (selectedFont === "georgia" || selectedFont === "palatino" ? PREVIEW_SAMPLE_EN : PREVIEW_SAMPLE_ZH);

  const resetCards = () => {
    setCardDataUrls([]);
    setAppState("idle");
  };

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) return;
    setErrorMsg(null);
    setAppState("generating");
    setCardDataUrls([]);
    setProgress(0);

    const segs = isMarkdown
      ? splitMarkdown(inputText, charsPerCard)
      : splitText(inputText, charsPerCard);
    setSegments(segs);

    await new Promise((r) => setTimeout(r, 300));

    try {
      if (!rendererRef.current) throw new Error("Renderer not ready.");

      const allUrls = await rendererRef.current.capture((done, total) => {
        setProgress(Math.round((done / total) * 100));
      });

      setCardDataUrls(allUrls);
      setAppState("ready");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Generation failed.");
      setAppState("idle");
    }
  }, [inputText, charsPerCard, activeTemplate, fontSize, activeFont, cardW, cardH, isMarkdown]);

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
      <aside className="w-full lg:w-[400px] lg:min-h-screen flex-shrink-0 bg-gray-900 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-none">TextCard</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">Turn text into shareable card images</p>
            </div>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* Input text */}
          <section>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-300 mb-2">
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
              onChange={(e) => { setInputText(e.target.value); resetCards(); }}
              rows={7}
              placeholder="粘贴或输入你的文字..."
              className="w-full rounded-xl bg-gray-800 border border-white/10 text-gray-100 placeholder-gray-600 text-sm leading-relaxed px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[11px] text-gray-600">Text will be split into multiple cards.</p>
              {charCount > 0 && (
                <button onClick={() => { setInputText(""); resetCards(); }} className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Template */}
          <section>
            <p className="text-sm font-medium text-gray-300 mb-2">Template</p>
            <TemplateSelector
              selectedId={selectedTemplate}
              onSelect={(id) => { setSelectedTemplate(id); resetCards(); }}
            />
          </section>

          {/* Font */}
          <section>
            <p className="text-sm font-medium text-gray-300 mb-2">Font</p>
            <FontSelector
              selectedId={selectedFont}
              onSelect={(id) => { setSelectedFont(id); resetCards(); }}
              fontSize={fontSize}
            />
          </section>

          {/* Font size + Aspect ratio — side by side */}
          <div className="flex gap-4">
            {/* Font size */}
            <section className="flex-1">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Size <span className="text-xs font-normal text-gray-500">{fontSize}px</span>
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {FONT_SIZES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFontSize(opt.value); resetCards(); }}
                    className={`h-8 rounded-md text-[11px] font-semibold transition-colors ${
                      fontSize === opt.value
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Aspect ratio */}
            <section className="flex-1">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Ratio <span className="text-xs font-normal text-gray-500">{cardW}×{cardH}</span>
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {aspectRatios.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedRatio(r.id); resetCards(); }}
                    className={`h-8 rounded-md text-[11px] font-semibold transition-colors ${
                      selectedRatio === r.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Toggles row */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Markdown</p>
                <p className="text-[10px] text-gray-600">Supports headings, bold, images, lists</p>
              </div>
              <button
                onClick={() => { setIsMarkdown(!isMarkdown); resetCards(); }}
                className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
                  isMarkdown ? "bg-indigo-600" : "bg-gray-700"
                }`}
                role="switch"
                aria-checked={isMarkdown}
              >
                <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  isMarkdown ? "translate-x-[18px]" : "translate-x-0"
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">Decorations</p>
              <button
                onClick={() => { setShowIllustrations(!showIllustrations); resetCards(); }}
                className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
                  showIllustrations ? "bg-indigo-600" : "bg-gray-700"
                }`}
                role="switch"
                aria-checked={showIllustrations}
              >
                <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  showIllustrations ? "translate-x-[18px]" : "translate-x-0"
                }`} />
              </button>
            </div>
          </section>

          {/* Info */}
          <section>
            <p className="text-[11px] text-gray-600">
              {activeTemplate.layout === "two-column" ? "Two columns" : "Single column"}
              {" · ~"}{charsPerCard} chars/card
              {estimatedCards > 0 && <> → <strong className="text-gray-500">{estimatedCards} cards</strong></>}
            </p>
          </section>

          {/* Error */}
          {errorMsg && (
            <div role="alert" className="rounded-lg bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 border-t border-white/10 flex flex-col gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating{progress > 0 ? ` ${progress}%` : "..."}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Zipping...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
                  <span className="text-indigo-300">{activeTemplate.nameZh}</span>
                </>
              ) : (
                "Preview"
              )}
            </h2>
            {hasCards && (
              <p className="text-xs text-gray-500 mt-0.5">Click any card to view full size</p>
            )}
          </div>
          {hasCards && (
            <span className="text-xs bg-indigo-900/60 text-indigo-300 rounded-full px-3 py-1 font-medium">
              {cardW} &times; {cardH} px
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

          {/* Live preview when no generated cards */}
          {!hasCards && !isGenerating && (
            <div className="max-w-lg mx-auto">
              <p className="text-xs text-gray-600 mb-4 text-center">
                Live preview &middot; Change template, font, or size to see updates
              </p>
              <LivePreview
                template={activeTemplate}
                fontSize={fontSize}
                fontFamily={activeFont.fontFamily}
                sampleText={previewText}
                cardWidth={cardW}
                cardHeight={cardH}
                showIllustrations={showIllustrations}
                isMarkdown={isMarkdown}
              />
            </div>
          )}

          {/* Card preview grid */}
          <CardPreview
            dataUrls={cardDataUrls}
            templateName={activeTemplate.nameZh}
          />
        </div>
      </main>

      {/* Hidden card renderer */}
      <div id="card-renderer-container" aria-hidden="true" style={{ position: "absolute", left: "-20000px", top: 0, width: `${cardW}px`, pointerEvents: "none" }}>
        <CardRenderer
          ref={rendererRef}
          segments={segments}
          template={activeTemplate}
          fontSize={fontSize}
          fontFamily={activeFont.fontFamily}
          cardWidth={cardW}
          cardHeight={cardH}
          showIllustrations={showIllustrations}
          isMarkdown={isMarkdown}
        />
      </div>
    </div>
  );
}
