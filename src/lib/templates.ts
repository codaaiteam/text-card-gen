import type { IllustrationStyle } from "./illustrations";

export interface TemplateConfig {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  cardBg: string;
  cardStyle: Record<string, string>;
  headerStyle: Record<string, string>;
  textStyle: Record<string, string>;
  pageNumStyle: Record<string, string>;
  layout: "single-column" | "two-column";
  borderStyle: "book-classic" | "book-minimal" | "book-dark" | "book-warm" | "book-elegant";
  previewBg: string;
  previewAccent: string;
  illustrationStyle: IllustrationStyle;
  illustrationColor: string;
}

export const templates: TemplateConfig[] = [
  {
    id: "book-classic",
    name: "Classic",
    nameZh: "经典书页",
    description: "Classic book page with warm paper tone",
    cardBg: "#f8f4eb",
    cardStyle: { background: "#f8f4eb", position: "relative" },
    headerStyle: {
      fontFamily: "'Songti SC', 'STSong', Georgia, serif",
      fontSize: "16px",
      fontWeight: "400",
      color: "#8a7e6b",
      letterSpacing: "4px",
      borderBottom: "1px solid #d4c9b4",
      paddingBottom: "8px",
    },
    textStyle: {
      fontFamily: "'Songti SC', 'STSong', Georgia, serif",
      color: "#2c2416",
      fontSize: "32px",
      lineHeight: "1.7",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "'Songti SC', Georgia, serif",
      color: "#a09480",
      fontSize: "14px",
    },
    layout: "single-column",
    borderStyle: "book-classic",
    previewBg: "#f8f4eb",
    previewAccent: "#8a7e6b",
    illustrationStyle: "botanical",
    illustrationColor: "#8a7e6b",
  },
  {
    id: "book-minimal",
    name: "Minimal",
    nameZh: "素雅",
    description: "Clean white page, minimal decoration",
    cardBg: "#ffffff",
    cardStyle: { background: "#ffffff", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      fontSize: "14px",
      fontWeight: "400",
      color: "#bbb",
      letterSpacing: "3px",
      textTransform: "uppercase",
      borderBottom: "1px solid #eee",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'PingFang SC', -apple-system, sans-serif",
      color: "#333",
      fontSize: "32px",
      lineHeight: "1.7",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#ccc",
      fontSize: "13px",
    },
    layout: "single-column",
    borderStyle: "book-minimal",
    previewBg: "#ffffff",
    previewAccent: "#999",
    illustrationStyle: "geometric",
    illustrationColor: "#ccc",
  },
  {
    id: "book-dark",
    name: "Dark",
    nameZh: "夜读",
    description: "Dark background for night reading",
    cardBg: "#1c1c1e",
    cardStyle: { background: "#1c1c1e", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      fontSize: "14px",
      fontWeight: "400",
      color: "#666",
      letterSpacing: "3px",
      borderBottom: "1px solid #333",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'PingFang SC', -apple-system, sans-serif",
      color: "#e8e4df",
      fontSize: "32px",
      lineHeight: "1.7",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#555",
      fontSize: "13px",
    },
    layout: "single-column",
    borderStyle: "book-dark",
    previewBg: "#1c1c1e",
    previewAccent: "#666",
    illustrationStyle: "lineart",
    illustrationColor: "#444",
  },
  {
    id: "book-warm",
    name: "Warm",
    nameZh: "暖黄",
    description: "Warm yellowish tone like aged paper",
    cardBg: "#f5edd4",
    cardStyle: { background: "#f5edd4", position: "relative" },
    headerStyle: {
      fontFamily: "'Kaiti SC', 'STKaiti', Georgia, serif",
      fontSize: "16px",
      fontWeight: "400",
      color: "#9a8c6e",
      letterSpacing: "3px",
      borderBottom: "1px solid #d8ccac",
      paddingBottom: "8px",
    },
    textStyle: {
      fontFamily: "'Kaiti SC', 'STKaiti', Georgia, serif",
      color: "#3a3020",
      fontSize: "32px",
      lineHeight: "1.75",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "'Kaiti SC', Georgia, serif",
      color: "#b0a080",
      fontSize: "14px",
    },
    layout: "single-column",
    borderStyle: "book-warm",
    previewBg: "#f5edd4",
    previewAccent: "#9a8c6e",
    illustrationStyle: "botanical",
    illustrationColor: "#b0a080",
  },
  {
    id: "book-elegant",
    name: "Elegant",
    nameZh: "雅致",
    description: "Two-column layout like a fine book spread",
    cardBg: "#faf7f0",
    cardStyle: { background: "#faf7f0", position: "relative" },
    headerStyle: {
      fontFamily: "'Palatino Linotype', 'Songti SC', serif",
      fontSize: "16px",
      fontWeight: "400",
      color: "#7a7060",
      textAlign: "center",
      letterSpacing: "5px",
      borderTop: "1px solid #c8bda8",
      borderBottom: "1px solid #c8bda8",
      paddingTop: "6px",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'Palatino Linotype', 'Songti SC', serif",
      color: "#2a2418",
      fontSize: "32px",
      lineHeight: "1.65",
      textAlign: "justify",
    },
    pageNumStyle: {
      fontFamily: "'Palatino Linotype', serif",
      color: "#a09480",
      fontSize: "14px",
    },
    layout: "two-column",
    borderStyle: "book-elegant",
    previewBg: "#faf7f0",
    previewAccent: "#7a7060",
    illustrationStyle: "ornamental",
    illustrationColor: "#a09480",
  },
];
