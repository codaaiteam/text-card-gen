"use client";

import { useState, useRef, useEffect } from "react";
import { fonts } from "@/lib/fonts";

interface FontSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  fontSize: number;
}

export default function FontSelector({ selectedId, onSelect, fontSize }: FontSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = fonts.find((f) => f.id === selectedId) ?? fonts[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/80 ring-1 ring-white/10 hover:ring-white/20 transition-colors text-left"
      >
        <span className="text-xs font-medium text-gray-400 w-10 flex-shrink-0">{active.nameZh}</span>
        <span
          className="flex-1 truncate text-gray-200"
          style={{ fontFamily: active.fontFamily, fontSize: `${Math.min(fontSize, 18)}px`, lineHeight: 1.4 }}
        >
          {active.sampleText}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-lg bg-gray-800 ring-1 ring-white/10 shadow-xl shadow-black/40 overflow-hidden">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => { onSelect(font.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                selectedId === font.id
                  ? "bg-indigo-600/20 text-white"
                  : "hover:bg-gray-700/80 text-gray-300"
              }`}
            >
              <span className={`text-xs font-medium w-10 flex-shrink-0 ${selectedId === font.id ? "text-indigo-300" : "text-gray-500"}`}>
                {font.nameZh}
              </span>
              <span
                className="flex-1 truncate"
                style={{ fontFamily: font.fontFamily, fontSize: `${Math.min(fontSize, 18)}px`, lineHeight: 1.4 }}
              >
                {font.sampleText}
              </span>
              {selectedId === font.id && (
                <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
