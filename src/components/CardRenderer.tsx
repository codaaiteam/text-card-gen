"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { TemplateConfig } from "@/lib/templates";

export interface CardRendererHandle {
  capture: () => Promise<string[]>;
}

interface CardRendererProps {
  segments: string[];
  template: TemplateConfig;
}

const CARD_SIZE = 1080;

// ─── Border decorations ──────────────────────────────────────

function NewspaperBorder() {
  return (
    <>
      <div style={{ position: "absolute", top: 30, left: 30, right: 30, height: 3, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", top: 35, left: 30, right: 30, height: 1, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, height: 1, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", top: 30, left: 30, width: 1, bottom: 30, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", top: 30, right: 30, width: 1, bottom: 30, background: "#1a1a1a" }} />
    </>
  );
}

function MagazineBorder() {
  return (
    <>
      <div style={{ position: "absolute", top: 30, left: 50, right: 50, height: 3, background: "#e63946" }} />
      <div style={{ position: "absolute", bottom: 30, left: 50, right: 50, height: 1, background: "#e6394633" }} />
    </>
  );
}

function BroadsheetBorder() {
  return (
    <>
      <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 2, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", top: 33, left: 40, right: 40, height: 1, background: "#999" }} />
      <div style={{ position: "absolute", bottom: 28, left: 40, right: 40, height: 2, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", bottom: 33, left: 40, right: 40, height: 1, background: "#999" }} />
    </>
  );
}

function GazetteBorder() {
  return (
    <>
      <div style={{ position: "absolute", top: 30, left: 40, right: 40, height: 1, background: "#ffd70044" }} />
      <div style={{ position: "absolute", bottom: 30, left: 40, right: 40, height: 1, background: "#ffd70044" }} />
      <div style={{ position: "absolute", top: 30, left: 40, width: 1, bottom: 30, background: "#ffd70022" }} />
      <div style={{ position: "absolute", top: 30, right: 40, width: 1, bottom: 30, background: "#ffd70022" }} />
    </>
  );
}

function MinimalSerifBorder() {
  return (
    <>
      <div style={{ position: "absolute", top: 40, left: 60, right: 60, height: 1, background: "#ddd" }} />
      <div style={{ position: "absolute", bottom: 40, left: 60, right: 60, height: 1, background: "#ddd" }} />
    </>
  );
}

function BorderForTemplate({ style }: { style: TemplateConfig["borderStyle"] }) {
  switch (style) {
    case "newspaper": return <NewspaperBorder />;
    case "magazine": return <MagazineBorder />;
    case "broadsheet": return <BroadsheetBorder />;
    case "gazette": return <GazetteBorder />;
    case "minimal-serif": return <MinimalSerifBorder />;
  }
}

// ─── Column divider for two-column layout ────────────────────

function ColumnDivider({ color }: { color: string }) {
  return (
    <div style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "50%",
      width: 1,
      background: color,
      opacity: 0.3,
    }} />
  );
}

// ─── Card node ───────────────────────────────────────────────

function CardNode({
  text,
  index,
  total,
  template,
  nodeRef,
}: {
  text: string;
  index: number;
  total: number;
  template: TemplateConfig;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isTwoCol = template.layout === "two-column";
  const margin = template.borderStyle === "newspaper" || template.borderStyle === "broadsheet" ? 55 : 60;

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
        position: "fixed",
        left: "-9999px",
        top: "0px",
        width: `${CARD_SIZE}px`,
        height: `${CARD_SIZE}px`,
        overflow: "hidden",
        boxSizing: "border-box",
        background: template.cardBg,
        ...template.cardStyle,
      }}
    >
      <BorderForTemplate style={template.borderStyle} />

      {/* Header bar */}
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
          Page {index + 1} of {total}
        </span>
      </div>

      {/* Body content */}
      <div style={{
        position: "absolute",
        top: margin + 50,
        left: margin + 10,
        right: margin + 10,
        bottom: margin + 10,
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
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}>
                {col2Text}
              </p>
            </div>
          </>
        ) : (
          <p style={{
            ...template.textStyle,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}>
            {text}
          </p>
        )}
      </div>

      {/* Page number bottom */}
      <div style={{
        position: "absolute",
        bottom: margin - 15,
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
  function CardRenderer({ segments, template }, ref) {
    const nodeRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([]);

    if (nodeRefs.current.length !== segments.length) {
      nodeRefs.current = segments.map(() => ({ current: null }));
    }

    useImperativeHandle(ref, () => ({
      async capture(): Promise<string[]> {
        const html2canvas = (await import("html2canvas-pro")).default;
        const results: string[] = [];

        for (let i = 0; i < segments.length; i++) {
          const el = nodeRefs.current[i]?.current;
          if (!el) continue;

          const prev = el.style.left;
          el.style.left = "0px";
          el.style.top = "0px";

          const canvas = await html2canvas(el, {
            width: CARD_SIZE,
            height: CARD_SIZE,
            scale: 1,
            useCORS: true,
            logging: false,
            backgroundColor: template.cardBg,
          });

          el.style.left = prev;
          el.style.top = "-9999px";

          results.push(canvas.toDataURL("image/png"));
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
            nodeRef={nodeRefs.current[i] as React.RefObject<HTMLDivElement | null>}
          />
        ))}
      </>
    );
  }
);

export default CardRenderer;
