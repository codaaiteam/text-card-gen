"use client";

import { fonts, FontConfig } from "@/lib/fonts";

interface FontSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  fontSize: number;
}

export default function FontSelector({ selectedId, onSelect, fontSize }: FontSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {fonts.map((font) => (
        <button
          key={font.id}
          onClick={() => onSelect(font.id)}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
            selectedId === font.id
              ? "bg-indigo-600/20 ring-1 ring-indigo-500/50"
              : "bg-gray-800/50 hover:bg-gray-800 ring-1 ring-transparent hover:ring-white/10"
          }`}
        >
          {/* Font name label */}
          <div className="w-14 flex-shrink-0">
            <span className={`text-xs font-medium ${selectedId === font.id ? "text-indigo-300" : "text-gray-500"}`}>
              {font.nameZh}
            </span>
          </div>
          {/* Sample text rendered in the actual font */}
          <span
            className={`flex-1 truncate transition-colors ${
              selectedId === font.id ? "text-gray-100" : "text-gray-400 group-hover:text-gray-300"
            }`}
            style={{
              fontFamily: font.fontFamily,
              fontSize: `${Math.min(fontSize, 20)}px`,
              lineHeight: 1.4,
            }}
          >
            {font.sampleText}
          </span>
          {/* Check indicator */}
          {selectedId === font.id && (
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
