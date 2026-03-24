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

const EXAMPLES = [
  {
    label: "Article",
    desc: "Long content",
    text: "C2Story 是一个可以自动生成漫画绘本的 AI 工具。只需要输入一段故事描述，它就能帮你生成完整的分镜画面和对话框。无论是儿童绘本、品牌故事还是教学内容，都可以在几分钟内完成。不需要任何绘画基础，AI 会根据你的文字自动选择画风和构图。",
  },
  {
    label: "Story",
    desc: "Narrative",
    text: "她已经写这封信三周了。不是不知道说什么，而是太清楚了。纸上的文字一旦写下就无法抹去，一旦读过就无法忘记。窗外的麻雀在为一块面包屑争吵。生活继续着，冷漠而美丽。她深吸一口气，开始打字。",
  },
  {
    label: "Tips",
    desc: "List format",
    text: "5 reasons why most creators fail:\n\n1. No consistency — posting once a week isn't enough\n2. No distribution — great content needs great reach\n3. No feedback loop — you can't improve what you don't measure\n4. No niche — trying to please everyone pleases no one\n5. No patience — growth is exponential, not linear",
  },
];

const FONT_SIZES = [
  { label: "S",   value: 48 },
  { label: "M",   value: 56 },
  { label: "L",   value: 64 },
  { label: "XL",  value: 72 },
];

type AppState = "idle" | "generating" | "ready" | "downloading";

export default function Home() {
  const [inputText, setInputText] = useState(EXAMPLES[0].text);
  const [selectedTemplate, setSelectedTemplate] = useState("notion");
  const [selectedFont, setSelectedFont] = useState("songti");
  const [fontSize, setFontSize] = useState(48);
  const [selectedRatio, setSelectedRatio] = useState("3:4");
  const [showIllustrations, setShowIllustrations] = useState(true);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);

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
  const charsPerCard = getCharsPerCard(
    activeTemplate.layout, fontSize, cardW, cardH, showIllustrations,
    activeTemplate.fillRatio, activeTemplate.cardPadding, activeTemplate.showHeader,
  );
  const estimatedCards = charCount > 0 ? Math.ceil(charCount / charsPerCard) : 0;

  const previewText = inputText.trim()
    ? inputText.trim().substring(0, charsPerCard)
    : EXAMPLES[exampleIdx].text;

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
      a.download = `inkify-cards-${activeTemplate.id}.zip`;
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

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-indigo-600" : "bg-gray-700"}`}
      role="switch"
      aria-checked={on}
    >
      <span className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col lg:flex-row">
      {/* ── Left panel ─────────────────────────────────────── */}
      <aside className="w-full lg:w-[420px] lg:min-h-screen flex-shrink-0 bg-gray-900 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#7C5CFF] to-[#4F7CFF] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
            </div>
            <div className="flex items-baseline gap-1">
              <h1 className="text-base text-white"><span className="font-bold">Ink</span><span className="font-normal">ify</span></h1>
              <span className="text-[10px] text-gray-500 font-medium">AI</span>
            </div>
          </div>
        </div>
        <div className="px-6 pt-4 pb-2">
          <p className="text-[13px] font-medium text-gray-300 leading-snug">Turn text into shareable cards</p>
          <p className="text-[11px] text-gray-600 mt-1">Articles, stories, and ideas — automatically split into beautiful multi-page cards.</p>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* ── 1. Input (hero) ───────────────────────────── */}
          <div className="px-6 pt-4 pb-4">
            {/* Textarea with action buttons */}
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); resetCards(); }}
                rows={hasCards ? 4 : 8}
                placeholder="Paste your text here..."
                className="w-full rounded-xl bg-gray-800/80 border border-white/10 text-gray-100 placeholder-gray-500 text-sm leading-relaxed px-4 py-3.5 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent transition-colors"
              />
              {/* Top-right action buttons */}
              <div className="absolute top-2.5 right-2.5 flex gap-1">
                {charCount > 0 && (
                  <button
                    onClick={() => { setInputText(""); resetCards(); }}
                    className="text-[10px] text-gray-500 hover:text-gray-300 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm rounded px-2 py-0.5 transition-colors"
                  >Clear</button>
                )}
                <button
                  onClick={async () => {
                    try {
                      const t = await navigator.clipboard.readText();
                      if (t) { setInputText(t); resetCards(); }
                    } catch { /* clipboard not available */ }
                  }}
                  className="text-[10px] text-gray-500 hover:text-gray-300 bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm rounded px-2 py-0.5 transition-colors"
                >Paste</button>
              </div>
            </div>
            {/* Info line */}
            {charCount > 0 && !hasCards && (
              <p className="mt-1.5 text-[11px] text-gray-500">
                {charCount.toLocaleString()} chars ~ {estimatedCards} card{estimatedCards !== 1 ? "s" : ""}
              </p>
            )}
            {charCount === 0 && !hasCards && (
              <p className="mt-2 text-[11px] text-gray-600">
                Works with: Articles · Stories · Marketing posts · Notes · Threads
              </p>
            )}
          </div>

          {/* ── 2. Primary action ─────────────────────────── */}
          <div className="px-6 pb-4">
            {!hasCards ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputText.trim()}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#4F7CFF] hover:from-[#8B6FFF] hover:to-[#5E8AFF] disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold text-base transition-all focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-2.5 shadow-lg shadow-[#7C5CFF]/20"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {progress > 0 ? `Generating ${progress}%` : "Generating..."}
                  </>
                ) : (
                  "Turn into Cards"
                )}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                      Zipping...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download All
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-12 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors ring-1 ring-white/10 flex items-center justify-center gap-1.5"
                  title="Regenerate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                </button>
              </div>
            )}
            {!hasCards && !isGenerating && (
              <p className="mt-2 text-center text-[11px] text-gray-600">
                {inputText.trim() ? `Get ${estimatedCards} ready-to-post image${estimatedCards !== 1 ? "s" : ""} in seconds` : "From text to cards in seconds. No design skills needed."}
              </p>
            )}
          </div>

          {/* ── 3. Settings (optional, de-emphasized) ─────── */}
          <div className="px-6 pb-5 border-t border-white/10">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3 text-[13px] font-medium text-gray-500 hover:text-gray-300 transition-colors select-none">
                <span>Customize <span className="text-gray-600 font-normal">optional</span></span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="flex flex-col gap-4 pb-2">
                {/* Template */}
                <section>
                  <p className="text-[13px] font-medium text-gray-400 mb-2">Template</p>
                  <TemplateSelector
                    selectedId={selectedTemplate}
                    onSelect={(id) => {
                      setSelectedTemplate(id);
                      const tpl = templates.find((t) => t.id === id);
                      if (tpl) setSelectedFont(tpl.defaultFontId);
                      resetCards();
                    }}
                  />
                </section>

                {/* Font */}
                <section>
                  <p className="text-[13px] font-medium text-gray-400 mb-2">Font <span className="text-gray-600 font-normal">override</span></p>
                  <FontSelector
                    selectedId={selectedFont}
                    onSelect={(id) => { setSelectedFont(id); resetCards(); }}
                    fontSize={fontSize}
                  />
                </section>

                {/* Size + Ratio */}
                <div className="flex gap-3">
                  <section className="flex-1">
                    <p className="text-[13px] font-medium text-gray-400 mb-1.5">Size</p>
                    <div className="grid grid-cols-4 gap-1">
                      {FONT_SIZES.map((opt) => (
                        <button key={opt.value} onClick={() => { setFontSize(opt.value); resetCards(); }}
                          className={`h-7 rounded text-[11px] font-semibold transition-colors ${fontSize === opt.value ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}
                        >{opt.label}</button>
                      ))}
                    </div>
                  </section>
                  <section className="flex-1">
                    <p className="text-[13px] font-medium text-gray-400 mb-1.5">Ratio</p>
                    <div className="grid grid-cols-4 gap-1">
                      {aspectRatios.map((r) => (
                        <button key={r.id} onClick={() => { setSelectedRatio(r.id); resetCards(); }}
                          className={`h-7 rounded text-[11px] font-semibold transition-colors ${selectedRatio === r.id ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}
                        >{r.label}</button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Toggle on={isMarkdown} onToggle={() => { setIsMarkdown(!isMarkdown); resetCards(); }} />
                    <span className="text-[12px] text-gray-500">Markdown</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Toggle on={showIllustrations} onToggle={() => { setShowIllustrations(!showIllustrations); resetCards(); }} />
                    <span className="text-[12px] text-gray-500">Decorations</span>
                  </label>
                </div>
              </div>
            </details>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="px-6 pb-4">
              <div role="alert" className="rounded-lg bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3">{errorMsg}</div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right panel ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-gray-950">

        {/* ─── Generating ──────────────────────────────────── */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>Rendering cards...</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* ─── Idle: example tabs + preview ─────────────────── */}
        {!hasCards && !isGenerating && (
          <div className="flex flex-col items-center min-h-[85vh] px-6 py-8">
            {/* Example type tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900 rounded-lg p-1">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={ex.label}
                  onClick={() => { setExampleIdx(i); setInputText(ex.text); resetCards(); }}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors flex flex-col items-center gap-0 ${
                    exampleIdx === i
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span>{ex.label}</span>
                  <span className={`text-[9px] font-normal ${exampleIdx === i ? "text-gray-400" : "text-gray-600"}`}>{ex.desc}</span>
                </button>
              ))}
            </div>

            {/* Preview card */}
            <div className="w-full max-w-sm">
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

            {charCount > 0 && (
              <p className="mt-5 text-[12px] text-gray-500 text-center">
                {estimatedCards} card{estimatedCards !== 1 ? "s" : ""} will be generated
              </p>
            )}
          </div>
        )}

        {/* ─── Ready: results ──────────────────────────────── */}
        {hasCards && (
          <>
            {/* Result header */}
            <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {cardDataUrls.length} cards ready
                    <span className="ml-2 text-gray-500 font-normal text-xs">{cardW}&times;{cardH}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Download All
                  </button>
                </div>
              </div>
            </div>

            {/* Card grid */}
            <div className="px-6 py-6">
              <CardPreview dataUrls={cardDataUrls} templateName={activeTemplate.nameZh} />
            </div>
          </>
        )}
      </main>

      {/* Hidden renderer */}
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
