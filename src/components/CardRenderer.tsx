"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { TemplateConfig } from "@/lib/templates";
import { getIllustration, getDivider } from "@/lib/illustrations";
import MarkdownBody from "./MarkdownBody";

export interface CardRendererHandle {
  capture: (onProgress?: (done: number, total: number) => void) => Promise<string[]>;
}

interface CardRendererProps {
  segments: string[];
  template: TemplateConfig;
  fontSize?: number;
  fontFamily?: string;
  cardWidth?: number;
  cardHeight?: number;
  showIllustrations?: boolean;
  isMarkdown?: boolean;
}

// ─── Border decoration (data-driven) ─────────────────────────

function CardBorder({ color }: { color: string }) {
  if (!color || color.endsWith("00")) return null; // transparent = no border
  return (
    <>
      <div style={{ position: "absolute", top: 48, left: 55, right: 55, height: 1, background: color }} />
      <div style={{ position: "absolute", bottom: 48, left: 55, right: 55, height: 1, background: color }} />
    </>
  );
}

// ─── Text with inline dividers ───────────────────────────────

function splitIntoParagraphs(text: string): string[] {
  // Split at sentence boundaries into ~2-3 groups
  const sentences = text.split(/(?<=[。！？…．.!?])/);
  if (sentences.length <= 2) return [text];

  const groups: string[] = [];
  const groupSize = Math.ceil(sentences.length / 3);
  for (let i = 0; i < sentences.length; i += groupSize) {
    const chunk = sentences.slice(i, i + groupSize).join("").trim();
    if (chunk) groups.push(chunk);
  }
  return groups;
}

function TextWithDividers({
  text,
  textStyle,
  showIllustrations,
  illustrationColor,
  cardIndex,
  highlightFirst,
  accentColor,
  autoTitle,
}: {
  text: string;
  textStyle: Record<string, unknown>;
  showIllustrations: boolean;
  illustrationColor: string;
  cardIndex: number;
  highlightFirst?: boolean;
  accentColor?: string;
  autoTitle?: boolean;
}) {
  const groups = splitIntoParagraphs(text);

  // Simple single paragraph
  if (groups.length <= 1 && !highlightFirst) {
    return <p style={textStyle as React.CSSProperties}>{text}</p>;
  }

  const chunks = groups.length > 1 ? groups : [text];

  return (
    <>
      {chunks.map((chunk, i) => {
        const isFirst = i === 0 && highlightFirst && cardIndex === 0;
        const isAutoTitle = i === 0 && autoTitle && chunk.length < 40 && chunks.length > 1;
        return (
          <React.Fragment key={i}>
            {isAutoTitle ? (
              <p style={{
                ...textStyle,
                fontSize: `${parseFloat(String(textStyle.fontSize)) * 1.3}px`,
                fontWeight: "700",
                textIndent: "0",
                marginBottom: "0.4em",
              } as React.CSSProperties}>{chunk}</p>
            ) : isFirst ? (
              <div style={{
                borderLeft: `4px solid ${accentColor || "#e63946"}`,
                paddingLeft: "16px",
                marginBottom: "0.5em",
              }}>
                <p style={{ ...textStyle, fontWeight: "600" } as React.CSSProperties}>{chunk}</p>
              </div>
            ) : (
              <p style={textStyle as React.CSSProperties}>{chunk}</p>
            )}
            {showIllustrations && i < chunks.length - 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
                opacity: 0.25,
              }}>
                {getDivider(cardIndex * 3 + i, illustrationColor)}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

// ─── Card node ───────────────────────────────────────────────

function CardNode({
  text,
  index,
  total,
  template,
  nodeRef,
  fontSize,
  fontFamily,
  cardWidth = 1080,
  cardHeight = 1440,
  showIllustrations = true,
  isMarkdown = false,
}: {
  text: string;
  index: number;
  total: number;
  template: TemplateConfig;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  fontSize?: number;
  fontFamily?: string;
  cardWidth?: number;
  cardHeight?: number;
  showIllustrations?: boolean;
  isMarkdown?: boolean;
}) {
  const isTwoCol = template.layout === "two-column";
  const pad = template.cardPadding ?? [48, 50, 48];
  const padTop = pad[0];
  const padH = pad[1];
  const padBottom = pad[2];
  const actualFontSize = fontSize ?? parseInt(template.textStyle.fontSize as string) ?? 48;
  const actualLineHeight = actualFontSize >= 48 ? 1.8 : actualFontSize >= 40 ? 1.75 : 1.7;
  const actualFontFamily = fontFamily ?? template.textStyle.fontFamily;

  // Split text into two columns for two-column layout
  let col1Text = text;
  let col2Text = "";
  if (isTwoCol) {
    const mid = Math.ceil(text.length / 2);
    // Find a good break point near the middle
    let breakAt = text.lastIndexOf(". ", mid + 50);
    if (breakAt < mid - 100) breakAt = text.lastIndexOf(" ", mid);
    if (breakAt < 10) breakAt = mid;
    col1Text = text.substring(0, breakAt + 1).trim();
    col2Text = text.substring(breakAt + 1).trim();
  }

  return (
    <div
      ref={nodeRef}
      style={{
        position: "absolute",
        left: "0px",
        top: `${index * cardHeight}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        overflow: "hidden",
        boxSizing: "border-box",
        background: template.cardBg,
        ...template.cardStyle,
      }}
    >
      <CardBorder color={template.borderColor} />

      {/* Decorative illustration */}
      {showIllustrations && (
        <div style={{
          position: "absolute",
          zIndex: 0,
          opacity: 0.18,
          ...(index % 2 === 0
            ? { bottom: 15, right: 15 }
            : { top: 15, left: 15, transform: "scaleX(-1) scaleY(-1)" }),
        }}>
          {getIllustration(template.illustrationStyle, index, template.illustrationColor)}
        </div>
      )}

      {/* Header bar */}
      {template.showHeader !== false && (
        <div style={{
          position: "absolute",
          top: padTop,
          left: padH,
          right: padH,
          zIndex: 1,
          ...template.headerStyle,
        }}>
          <span>TextCard</span>
          <span style={{ float: "right", fontSize: "14px", fontWeight: "400", opacity: 0.6 }}>
            Page {index + 1} of {total}
          </span>
        </div>
      )}

      {/* Body content */}
      <div style={{
        position: "absolute",
        top: template.showHeader !== false ? padTop + 50 : padTop,
        left: padH,
        right: padH,
        bottom: padBottom + 30,
        overflow: "hidden",
        zIndex: 1,
        display: isTwoCol ? "flex" : "block",
        gap: isTwoCol ? "30px" : undefined,
      }}>
        {isTwoCol ? (
          <>
            {/* Column 1 */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <p style={{
                ...template.textStyle,
                fontFamily: actualFontFamily,
                fontSize: `${actualFontSize}px`,
                lineHeight: String(actualLineHeight),
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}>
                {col1Text}
              </p>
            </div>
            {/* Column divider */}
            <div style={{
              width: 1,
              background: template.textStyle.color || "#333",
              opacity: 0.15,
              flexShrink: 0,
            }} />
            {/* Column 2 */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p style={{
                ...template.textStyle,
                fontFamily: actualFontFamily,
                fontSize: `${actualFontSize}px`,
                lineHeight: String(actualLineHeight),
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}>
                {col2Text}
              </p>
            </div>
          </>
        ) : isMarkdown ? (
          <MarkdownBody
            text={text}
            fontSize={actualFontSize}
            lineHeight={actualLineHeight}
            fontFamily={actualFontFamily as string}
            textColor={template.textStyle.color as string || "#333"}
          />
        ) : (
          <TextWithDividers
            text={text}
            textStyle={{
              ...template.textStyle,
              fontFamily: actualFontFamily,
              fontSize: `${actualFontSize}px`,
              lineHeight: String(actualLineHeight),
              textIndent: template.textIndent ?? undefined,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
            showIllustrations={showIllustrations}
            illustrationColor={template.illustrationColor}
            cardIndex={index}
            highlightFirst={template.highlightFirst}
            accentColor={template.accentColor}
            autoTitle={template.autoTitle}
          />
        )}
      </div>

      {/* Page number bottom */}
      <div style={{
        position: "absolute",
        bottom: padBottom - 10,
        left: 0,
        right: 0,
        textAlign: "center",
        ...template.pageNumStyle,
        zIndex: 1,
      }}>
        — {index + 1} —
      </div>
    </div>
  );
}

// ─── Renderer ────────────────────────────────────────────────

const CardRenderer = forwardRef<CardRendererHandle, CardRendererProps>(
  function CardRenderer({ segments, template, fontSize, fontFamily, cardWidth = 1080, cardHeight = 1440, showIllustrations = true, isMarkdown = false }, ref) {
    const nodeRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([]);

    if (nodeRefs.current.length !== segments.length) {
      nodeRefs.current = segments.map(() => ({ current: null }));
    }

    useImperativeHandle(ref, () => ({
      async capture(onProgress?: (done: number, total: number) => void): Promise<string[]> {
        const total = segments.length;
        if (total === 0) return [];

        // Wait until all card DOM nodes are mounted (mobile can be slow)
        const maxWait = 10000; // 10 seconds max
        const start = Date.now();
        while (Date.now() - start < maxWait) {
          const mounted = nodeRefs.current.filter(r => r?.current !== null).length;
          if (mounted >= total) break;
          await new Promise(r => setTimeout(r, 100));
        }

        const html2canvas = (await import("html2canvas-pro")).default;
        const results: string[] = [];

        for (let i = 0; i < total; i++) {
          const el = nodeRefs.current[i]?.current;
          if (!el) {
            console.warn(`Card ${i} ref not mounted, skipping`);
            continue;
          }

          const canvas = await html2canvas(el, {
            width: cardWidth,
            height: cardHeight,
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: template.cardBg,
          });

          results.push(canvas.toDataURL("image/png"));
          onProgress?.(i + 1, total);
        }

        return results;
      },
    }));

    return (
      <>
        {segments.map((text, i) => (
          <CardNode
            key={`${template.id}-${i}`}
            text={text}
            index={i}
            total={segments.length}
            template={template}
            fontSize={fontSize}
            fontFamily={fontFamily}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            showIllustrations={showIllustrations}
            isMarkdown={isMarkdown}
            nodeRef={nodeRefs.current[i] as React.RefObject<HTMLDivElement | null>}
          />
        ))}
      </>
    );
  }
);

export default CardRenderer;
