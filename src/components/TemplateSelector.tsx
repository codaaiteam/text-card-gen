"use client";

import { templates, TemplateConfig } from "@/lib/templates";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

function BorderPreview({ style }: { style: TemplateConfig["borderStyle"] }) {
  const base =
    "absolute inset-[10px] pointer-events-none";

  if (style === "elegant-gold") {
    return (
      <>
        <div className={`${base} border-2 border-[#c9a227]`} />
        <div className="absolute inset-[15px] border border-[#c9a227] pointer-events-none" />
        {/* Corner ornaments */}
        {(["top-[7px] left-[7px]", "top-[7px] right-[7px]", "bottom-[7px] left-[7px]", "bottom-[7px] right-[7px]"] as const).map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4 pointer-events-none`}
              style={{ color: "#c9a227", fontSize: "14px", lineHeight: 1 }}
            >
              ✦
            </div>
          )
        )}
      </>
    );
  }

  if (style === "modern-gradient") {
    return (
      <div
        className={`${base} rounded-sm`}
        style={{
          background:
            "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4) border-box",
          border: "3px solid transparent",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
    );
  }

  if (style === "dark-mode") {
    return (
      <div
        className={`${base}`}
        style={{
          border: "2px solid #7c3aed",
          boxShadow: "0 0 6px #7c3aed88, inset 0 0 6px #7c3aed22",
        }}
      />
    );
  }

  if (style === "vintage-paper") {
    return (
      <>
        <div
          className={`${base}`}
          style={{ border: "2.5px solid #8b4513" }}
        />
        <div
          className="absolute inset-[15px] pointer-events-none"
          style={{ border: "1px solid #8b4513" }}
        />
        {(["top-[8px] left-[8px]", "top-[8px] right-[8px]", "bottom-[8px] left-[8px]", "bottom-[8px] right-[8px]"] as const).map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-4 h-4 pointer-events-none`}
              style={{ color: "#8b4513", fontSize: "12px", lineHeight: 1 }}
            >
              ❧
            </div>
          )
        )}
      </>
    );
  }

  // bold-statement
  return (
    <div
      className={`${base}`}
      style={{ border: "3px solid #ffffff" }}
    />
  );
}

export default function TemplateSelector({
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl.id)}
          className="group flex flex-col items-center gap-2 focus:outline-none"
          title={tpl.description}
          aria-label={`Select ${tpl.name} template`}
          aria-pressed={selectedId === tpl.id}
        >
          {/* Thumbnail */}
          <div
            className={`relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
              selectedId === tpl.id
                ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-400 scale-105"
                : "ring-1 ring-white/10 group-hover:ring-white/30 group-hover:scale-[1.03]"
            }`}
            style={{ background: tpl.previewBg }}
          >
            <BorderPreview style={tpl.borderStyle} />
            {/* Mini text lines */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6">
              {[70, 100, 85, 55].map((w, i) => (
                <div
                  key={i}
                  className="rounded-full h-[3px]"
                  style={{
                    width: `${w}%`,
                    background: tpl.previewAccent,
                    opacity: 0.5 + i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Label */}
          <span
            className={`text-xs font-medium text-center leading-tight transition-colors ${
              selectedId === tpl.id ? "text-indigo-300" : "text-gray-400 group-hover:text-gray-200"
            }`}
          >
            {tpl.name}
          </span>
        </button>
      ))}
    </div>
  );
}
