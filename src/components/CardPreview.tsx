"use client";

import { useState, useCallback } from "react";

interface CardPreviewProps {
  dataUrls: string[];
  templateName: string;
}

function downloadSingle(dataUrl: string, index: number) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `card-${String(index + 1).padStart(2, "0")}.png`;
  a.click();
}

async function copyToClipboard(dataUrl: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

export default function CardPreview({ dataUrls, templateName }: CardPreviewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = useCallback(async (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(dataUrls[idx]);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* clipboard may not be available */ }
  }, [dataUrls]);

  if (dataUrls.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dataUrls.map((url, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden bg-gray-800 ring-1 ring-white/10 hover:ring-indigo-400/50 transition-all duration-200">
            {/* Card image — click to expand */}
            <button
              onClick={() => setExpanded(i)}
              className="w-full focus:outline-none"
              aria-label={`View card ${i + 1} full size`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${templateName} card ${i + 1}`}
                className="w-full h-auto object-cover"
              />
            </button>

            {/* Card number badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[11px] font-medium rounded-full px-2 py-0.5 backdrop-blur-sm">
              {i + 1}
            </div>

            {/* Hover action buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); downloadSingle(url, i); }}
                className="flex items-center gap-1 text-[11px] text-white font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 transition-colors"
                title="Download this card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save
              </button>
              <button
                onClick={(e) => handleCopy(i, e)}
                className="flex items-center gap-1 text-[11px] text-white font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md px-2.5 py-1.5 transition-colors"
                title="Copy to clipboard"
              >
                {copiedIdx === i ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-300">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setExpanded(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[85vmin] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrls[expanded]}
              alt={`${templateName} card ${expanded + 1} full size`}
              className="w-full h-full object-contain"
            />

            {/* Nav arrows */}
            {expanded > 0 && (
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(expanded - 1); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
            )}
            {expanded < dataUrls.length - 1 && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(expanded + 1); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            )}

            {/* Close */}
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              onClick={() => setExpanded(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Bottom bar: counter + actions */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
              <span className="text-white text-sm font-medium">{expanded + 1} / {dataUrls.length}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadSingle(dataUrls[expanded], expanded); }}
                  className="flex items-center gap-1.5 text-xs text-white font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={(e) => handleCopy(expanded, e)}
                  className="flex items-center gap-1.5 text-xs text-white font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1.5 transition-colors"
                >
                  {copiedIdx === expanded ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
