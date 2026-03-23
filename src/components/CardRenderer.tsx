"use client";

/**
 * CardRenderer
 *
 * Renders a set of 1080x1080 cards as hidden DOM nodes.
 * html2canvas-pro captures each one as a PNG data URL.
 *
 * The component is rendered off-screen (not display:none — html2canvas
 * needs the element to be painted) using position:fixed + left:-9999px.
 */

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
const PADDING = 80;

// ---- Border overlay components (full 1080px scale) ----

function ElegantGoldBorder() {
  return (
    <>
      {/* Outer border */}
      <div
        style={{
          position: "absolute",
          inset: "40px",
          border: "2.5px solid #c9a227",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
      {/* Inner border */}
      <div
        style={{
          position: "absolute",
          inset: "55px",
          border: "1px solid #c9a227",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
      {/* Corner ornaments */}
      {(
        [
          { top: "28px", left: "28px" },
          { top: "28px", right: "28px" },
          { bottom: "28px", left: "28px" },
          { bottom: "28px", right: "28px" },
        ] as React.CSSProperties[]
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            color: "#c9a227",
            fontSize: "24px",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          ✦
        </div>
      ))}
    </>
  );
}

function ModernGradientBorder() {
  // Renders only the 3px gradient border ring; interior is transparent so
  // the card background and text show through.
  return (
    <>
      {/* Top edge */}
      <div style={{ position: "absolute", top: "40px", left: "40px", right: "40px", height: "3px", background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)", pointerEvents: "none", zIndex: 0 }} />
      {/* Bottom edge */}
      <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px", height: "3px", background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #6366f1)", pointerEvents: "none", zIndex: 0 }} />
      {/* Left edge */}
      <div style={{ position: "absolute", top: "40px", left: "40px", width: "3px", bottom: "40px", background: "linear-gradient(180deg, #6366f1, #8b5cf6, #06b6d4)", pointerEvents: "none", zIndex: 0 }} />
      {/* Right edge */}
      <div style={{ position: "absolute", top: "40px", right: "40px", width: "3px", bottom: "40px", background: "linear-gradient(180deg, #06b6d4, #8b5cf6, #6366f1)", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

function DarkModeBorder() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "40px",
        border: "2px solid #7c3aed",
        boxShadow: "0 0 20px #7c3aed66, inset 0 0 20px #7c3aed11",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function VintagePaperBorder() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: "40px",
          border: "3px solid #8b4513",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "56px",
          border: "1px solid #8b4513",
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
      {(
        [
          { top: "28px", left: "28px" },
          { top: "28px", right: "28px" },
          { bottom: "28px", left: "28px" },
          { bottom: "28px", right: "28px" },
        ] as React.CSSProperties[]
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            color: "#8b4513",
            fontSize: "22px",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          ❧
        </div>
      ))}
    </>
  );
}

function BoldStatementBorder() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "40px",
        border: "4px solid #ffffff",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
    />
  );
}

function BorderForTemplate({ style }: { style: TemplateConfig["borderStyle"] }) {
  switch (style) {
    case "elegant-gold":
      return <ElegantGoldBorder />;
    case "modern-gradient":
      return <ModernGradientBorder />;
    case "dark-mode":
      return <DarkModeBorder />;
    case "vintage-paper":
      return <VintagePaperBorder />;
    case "bold-statement":
      return <BoldStatementBorder />;
  }
}

// Single card DOM node
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
  return (
    <div
      ref={nodeRef}
      style={{
        position: "fixed",
        left: "-9999px",
        top: "0px",
        width: `${CARD_SIZE}px`,
        height: `${CARD_SIZE}px`,
        background: template.cardBg,
        overflow: "hidden",
        boxSizing: "border-box",
        ...template.cardStyle,
      }}
    >
      {/* Background fill for modern-gradient (covers the white inner div of the border trick) */}
      {template.borderStyle === "modern-gradient" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#ffffff",
            zIndex: 0,
          }}
        />
      )}

      <BorderForTemplate style={template.borderStyle} />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          inset: `${PADDING + 30}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <p
          data-card-text="true"
          style={{
            ...template.textStyle,
            margin: 0,
            padding: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%",
          }}
        >
          {text}
        </p>
      </div>

      {/* Page number */}
      <div
        style={{
          position: "absolute",
          bottom: "56px",
          left: 0,
          right: 0,
          textAlign: "center",
          ...template.pageNumStyle,
          zIndex: 1,
        }}
      >
        {index + 1} / {total}
      </div>
    </div>
  );
}

const CardRenderer = forwardRef<CardRendererHandle, CardRendererProps>(
  function CardRenderer({ segments, template }, ref) {
    const nodeRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([]);

    // Keep refs array in sync with segments length
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

          // Temporarily nudge into viewport for reliable capture
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
