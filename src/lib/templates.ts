export interface Template {
  id: string;
  name: string;
  description: string;
  cardStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  pageNumStyle: React.CSSProperties;
  borderClass: string;
  previewBg: string;
  previewAccent: string;
}

// Templates are defined as plain objects; React.CSSProperties is used at
// the component level. We export them as const for direct style spreading.

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  cardBg: string;
  cardStyle: Record<string, string>;
  textStyle: Record<string, string>;
  pageNumStyle: Record<string, string>;
  previewBg: string;
  previewAccent: string;
  borderStyle: "elegant-gold" | "modern-gradient" | "dark-mode" | "vintage-paper" | "bold-statement";
}

export const templates: TemplateConfig[] = [
  {
    id: "elegant-gold",
    name: "Elegant Gold",
    description: "Cream background with ornamental gold border",
    cardBg: "#faf8f0",
    cardStyle: {
      background: "#faf8f0",
      position: "relative",
    },
    textStyle: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#2c1810",
      fontSize: "36px",
      lineHeight: "1.7",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "Georgia, serif",
      color: "#8b6914",
      fontSize: "18px",
    },
    previewBg: "#faf8f0",
    previewAccent: "#c9a227",
    borderStyle: "elegant-gold",
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    description: "Clean white with a colorful gradient border",
    cardBg: "#ffffff",
    cardStyle: {
      background: "#ffffff",
      position: "relative",
    },
    textStyle: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#1a1a2e",
      fontSize: "36px",
      lineHeight: "1.7",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#6366f1",
      fontSize: "18px",
    },
    previewBg: "#ffffff",
    previewAccent: "#6366f1",
    borderStyle: "modern-gradient",
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Charcoal background with neon glow border",
    cardBg: "#1a1a2e",
    cardStyle: {
      background: "#1a1a2e",
      position: "relative",
    },
    textStyle: {
      fontFamily: "'Courier New', Courier, monospace",
      color: "#e2e8f0",
      fontSize: "34px",
      lineHeight: "1.75",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "'Courier New', monospace",
      color: "#7c3aed",
      fontSize: "18px",
    },
    previewBg: "#1a1a2e",
    previewAccent: "#7c3aed",
    borderStyle: "dark-mode",
  },
  {
    id: "vintage-paper",
    name: "Vintage Paper",
    description: "Warm parchment with double-line brown border",
    cardBg: "#f5e6c8",
    cardStyle: {
      background: "#f5e6c8",
      position: "relative",
    },
    textStyle: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontStyle: "italic",
      color: "#3d1c02",
      fontSize: "35px",
      lineHeight: "1.75",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "Georgia, serif",
      fontStyle: "italic",
      color: "#6b3a0f",
      fontSize: "18px",
    },
    previewBg: "#f5e6c8",
    previewAccent: "#8b4513",
    borderStyle: "vintage-paper",
  },
  {
    id: "bold-statement",
    name: "Bold Statement",
    description: "Deep blue background with thick white border",
    cardBg: "#0f172a",
    cardStyle: {
      background: "#0f172a",
      position: "relative",
    },
    textStyle: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontWeight: "700",
      color: "#ffffff",
      fontSize: "38px",
      lineHeight: "1.6",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#94a3b8",
      fontSize: "18px",
      fontWeight: "600",
    },
    previewBg: "#0f172a",
    previewAccent: "#ffffff",
    borderStyle: "bold-statement",
  },
];
