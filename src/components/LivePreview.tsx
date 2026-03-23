"use client";

import React, { useRef, useState, useEffect } from "react";
import { TemplateConfig } from "@/lib/templates";
import { getIllustration, getDivider } from "@/lib/illustrations";
import MarkdownBody from "./MarkdownBody";

interface LivePreviewProps {
  template: TemplateConfig;
  fontSize: number;
  fontFamily: string;
  sampleText: string;
  cardWidth?: number;
  cardHeight?: number;
  showIllustrations?: boolean;
  isMarkdown?: boolean;
}

export default function LivePreview({
  template, fontSize, fontFamily, sampleText,
  cardWidth = 1080, cardHeight = 1440,
  showIllustrations = true,
  isMarkdown = false,
}: LivePreviewProps) {
  const isTwoCol = template.layout === "two-column";
  const margin = 60;
  const lineHeight = fontSize >= 48 ? 1.8 : fontSize >= 40 ? 1.75 : 1.7;

  let col1 = sampleText;
  let col2 = "";
  if (isTwoCol) {
    const mid = Math.ceil(sampleText.length / 2);
    const sentences = sampleText.split(/(?<=[。！？.!?])/);
    let len = 0;
    let splitIdx = 0;
    for (let i = 0; i < sentences.length; i++) {
      len += sentences[i].length;
      if (len >= mid) { splitIdx = i + 1; break; }
    }
    if (splitIdx === 0) splitIdx = Math.ceil(sentences.length / 2);
    col1 = sentences.slice(0, splitIdx).join("");
    col2 = sentences.slice(splitIdx).join("");
  }

  const textStyleOverride = {
    ...template.textStyle,
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: String(lineHeight),
    margin: 0,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "break-word" as const,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 420;
      setScale(w / cardWidth);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [cardWidth]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10"
        style={{
          width: "100%",
          maxWidth: 480,
          aspectRatio: `${cardWidth} / ${cardHeight}`,
        }}
      >
        <div style={{
          width: cardWidth,
          height: cardHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: template.cardBg,
          position: "relative",
          ...template.cardStyle,
        }}>
          {/* Decorative illustration */}
          {showIllustrations && (
            <div style={{
              position: "absolute",
              bottom: 15,
              right: 15,
              zIndex: 0,
              opacity: 0.18,
            }}>
              {getIllustration(template.illustrationStyle, 0, template.illustrationColor)}
            </div>
          )}

          {/* Header */}
          <div style={{
            position: "absolute",
            top: margin,
            left: margin + 10,
            right: margin + 10,
            zIndex: 1,
            ...template.headerStyle,
          }}>
            <span>TextCard</span>
            <span style={{ float: "right", fontSize: "14px", fontWeight: "400", opacity: 0.6 }}>
              Page 1 of 3
            </span>
          </div>

          {/* Body */}
          <div style={{
            position: "absolute",
            top: margin + 50,
            left: margin + 10,
            right: margin + 10,
            bottom: margin + 40,
            overflow: "hidden",
            zIndex: 1,
            display: isTwoCol ? "flex" : "block",
            gap: isTwoCol ? "30px" : undefined,
          }}>
            {isTwoCol ? (
              <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={textStyleOverride}>{col1}</p>
                </div>
                <div style={{
                  width: 1,
                  background: template.textStyle.color || "#333",
                  opacity: 0.15,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={textStyleOverride}>{col2}</p>
                </div>
              </>
            ) : isMarkdown ? (
              <MarkdownBody
                text={sampleText}
                fontSize={fontSize}
                lineHeight={lineHeight}
                fontFamily={fontFamily}
                textColor={template.textStyle.color as string || "#333"}
              />
            ) : (
              (() => {
                if (!showIllustrations) return <p style={textStyleOverride}>{sampleText}</p>;
                const sentences = sampleText.split(/(?<=[。！？…．.!?])/);
                if (sentences.length <= 2) return <p style={textStyleOverride}>{sampleText}</p>;
                const groupSize = Math.ceil(sentences.length / 3);
                const groups: string[] = [];
                for (let i = 0; i < sentences.length; i += groupSize) {
                  const chunk = sentences.slice(i, i + groupSize).join("").trim();
                  if (chunk) groups.push(chunk);
                }
                return (<>
                  {groups.map((chunk, i) => (
                    <React.Fragment key={i}>
                      <p style={textStyleOverride}>{chunk}</p>
                      {i < groups.length - 1 && (
                        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0", opacity: 0.25 }}>
                          {getDivider(i, template.illustrationColor)}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </>);
              })()
            )}
          </div>

          {/* Page number */}
          <div style={{
            position: "absolute",
            bottom: margin - 15,
            left: 0,
            right: 0,
            textAlign: "center",
            ...template.pageNumStyle,
            zIndex: 1,
          }}>
            — 1 —
          </div>
        </div>
      </div>
    </div>
  );
}
