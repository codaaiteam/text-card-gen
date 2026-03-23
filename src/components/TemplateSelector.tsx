"use client";

import { templates, TemplateConfig } from "@/lib/templates";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

function LayoutPreview({ tpl }: { tpl: TemplateConfig }) {
  const isTwoCol = tpl.layout === "two-column";
  const accent = tpl.previewAccent;

  return (
    <div className="absolute inset-0 flex flex-col px-3 py-2.5 gap-1.5">
      {/* Header line */}
      <div className="flex items-center justify-between">
        <div className="h-[2px] flex-1 rounded-full" style={{ background: accent, opacity: 0.5 }} />
      </div>
      {/* Body lines */}
      <div className={`flex-1 flex ${isTwoCol ? "gap-1.5" : "flex-col gap-[3px]"}`}>
        {isTwoCol ? (
          <>
            <div className="flex-1 flex flex-col gap-[3px]">
              {[95, 90, 85, 95, 80, 90, 85].map((w, i) => (
                <div key={i} className="h-[2px] rounded-full" style={{ width: `${w}%`, background: accent, opacity: 0.2 }} />
              ))}
            </div>
            <div className="w-[1px]" style={{ background: accent, opacity: 0.1 }} />
            <div className="flex-1 flex flex-col gap-[3px]">
              {[90, 95, 85, 90, 95, 80, 85].map((w, i) => (
                <div key={i} className="h-[2px] rounded-full" style={{ width: `${w}%`, background: accent, opacity: 0.2 }} />
              ))}
            </div>
          </>
        ) : (
          [95, 100, 90, 85, 95, 80, 100, 90, 85, 95].map((w, i) => (
            <div key={i} className="h-[2px] rounded-full" style={{ width: `${w}%`, background: accent, opacity: 0.2 }} />
          ))
        )}
      </div>
    </div>
  );
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl.id)}
          className="group flex flex-col items-center gap-1.5 focus:outline-none"
          title={tpl.description}
          aria-label={`Select ${tpl.name} template`}
          aria-pressed={selectedId === tpl.id}
        >
          <div
            className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
              selectedId === tpl.id
                ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-400 scale-105"
                : "ring-1 ring-white/10 group-hover:ring-white/30 group-hover:scale-[1.03]"
            }`}
            style={{ background: tpl.previewBg }}
          >
            <LayoutPreview tpl={tpl} />
          </div>
          <span
            className={`text-[10px] font-medium text-center leading-tight transition-colors ${
              selectedId === tpl.id ? "text-indigo-300" : "text-gray-500 group-hover:text-gray-300"
            }`}
          >
            {tpl.nameZh}
          </span>
        </button>
      ))}
    </div>
  );
}
