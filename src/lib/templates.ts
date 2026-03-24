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
  borderColor: string;
  previewBg: string;
  previewAccent: string;
  illustrationStyle: IllustrationStyle;
  illustrationColor: string;
  defaultFontId: string;
  // ─── Content structure options ───
  /** Indent first line of each paragraph */
  textIndent?: string;
  /** Highlight first paragraph (left accent bar + bold) */
  highlightFirst?: boolean;
  /** Accent color for highlight bar, blockquotes, etc. */
  accentColor?: string;
  /** Show header bar at top of card */
  showHeader?: boolean;
  /**
   * Content fill ratio — controls how much text per card.
   * 1.0 = fill available space. Lower = more white space, fewer chars/card.
   * Social uses ~0.5 (punchy), Reading uses ~0.75 (comfortable), etc.
   */
  fillRatio: number;
  /** Card inner padding [top, horizontal, bottom] in px at 1080 card width */
  cardPadding?: [number, number, number];
  /** Auto-detect short first paragraph as title */
  autoTitle?: boolean;
}

export const templates: TemplateConfig[] = [
  // ─── 0. Notion ⭐ Default ────────────────────────────────
  // Pure white, big text, top rule, zero decoration — like a Notion screenshot
  {
    id: "notion",
    name: "Notion",
    nameZh: "笔记",
    description: "Clean Notion-style — white, big text, no decoration",
    cardBg: "#ffffff",
    cardStyle: { background: "#ffffff", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      fontSize: "0px",
      fontWeight: "400",
      color: "transparent",
      borderBottom: "none",
      paddingBottom: "0",
    },
    textStyle: {
      fontFamily: "-apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif",
      color: "#1a1a1a",
      fontSize: "32px",
      lineHeight: "1.75",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#ccc",
      fontSize: "12px",
    },
    layout: "single-column",
    borderColor: "#e5e5e5",
    previewBg: "#ffffff",
    previewAccent: "#999",
    illustrationStyle: "geometric",
    illustrationColor: "#00000000",
    defaultFontId: "pingfang",
    showHeader: false,
    fillRatio: 0.82,
    cardPadding: [40, 36, 36],
    autoTitle: true,
  },

  // ─── 1. Reading ────────────────────────────────────────
  // For: long articles, essays, fiction, notes
  // Structure: indented paragraphs, generous line-height, minimal chrome
  {
    id: "reading",
    name: "Reading",
    nameZh: "阅读",
    description: "Clean long-form reading, natural paragraph flow",
    cardBg: "#f8f4eb",
    cardStyle: { background: "#f8f4eb", position: "relative" },
    headerStyle: {
      fontFamily: "'Songti SC', 'STSong', Georgia, serif",
      fontSize: "13px",
      fontWeight: "400",
      color: "#a09480",
      letterSpacing: "3px",
      borderBottom: "none",
      paddingBottom: "0",
    },
    textStyle: {
      fontFamily: "'Songti SC', 'STSong', Georgia, serif",
      color: "#2c2416",
      fontSize: "32px",
      lineHeight: "1.9",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "'Songti SC', Georgia, serif",
      color: "#b0a490",
      fontSize: "13px",
    },
    layout: "single-column",
    borderColor: "#d4c9b4",
    previewBg: "#f8f4eb",
    previewAccent: "#8a7e6b",
    illustrationStyle: "botanical",
    illustrationColor: "#8a7e6b",
    defaultFontId: "songti",
    textIndent: "2em",
    showHeader: true,
    fillRatio: 0.70,
    cardPadding: [48, 50, 48],
    autoTitle: true,
  },

  // ─── 2. Social ────────────────────────────────────────────
  // For: Xiaohongshu, Twitter, LinkedIn — "screenshot-worthy"
  // Structure: bold header, tight paragraphs, high contrast, punchy
  {
    id: "social",
    name: "Social",
    nameZh: "社媒",
    description: "Bold and punchy for social media sharing",
    cardBg: "#ffffff",
    cardStyle: { background: "#ffffff", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif",
      fontSize: "15px",
      fontWeight: "700",
      color: "#6d28d9",
      textTransform: "uppercase",
      letterSpacing: "4px",
      borderBottom: "3px solid #6d28d9",
      paddingBottom: "8px",
    },
    textStyle: {
      fontFamily: "-apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif",
      color: "#1a1a1a",
      fontSize: "32px",
      lineHeight: "1.65",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#6d28d9",
      fontSize: "13px",
      fontWeight: "600",
    },
    layout: "single-column",
    borderColor: "#6d28d922",
    previewBg: "#ffffff",
    previewAccent: "#6d28d9",
    illustrationStyle: "geometric",
    illustrationColor: "#6d28d933",
    defaultFontId: "pingfang",
    showHeader: true,
    fillRatio: 0.50,
    cardPadding: [40, 44, 40],
    autoTitle: true,
  },

  // ─── 3. Highlight ─────────────────────────────────────────
  // For: opinion pieces, key takeaways, marketing, tips
  // Structure: first paragraph highlighted with accent bar + bold
  {
    id: "highlight",
    name: "Highlight",
    nameZh: "重点",
    description: "First paragraph emphasized with accent bar",
    cardBg: "#fafafa",
    cardStyle: { background: "#fafafa", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      fontSize: "13px",
      fontWeight: "500",
      color: "#999",
      letterSpacing: "3px",
      borderBottom: "none",
      paddingBottom: "0",
    },
    textStyle: {
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      color: "#2a2a2a",
      fontSize: "32px",
      lineHeight: "1.7",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#bbb",
      fontSize: "13px",
    },
    layout: "single-column",
    borderColor: "#e5e5e5",
    previewBg: "#fafafa",
    previewAccent: "#e63946",
    illustrationStyle: "lineart",
    illustrationColor: "#ddd",
    defaultFontId: "pingfang",
    highlightFirst: true,
    accentColor: "#e63946",
    showHeader: true,
    fillRatio: 0.65,
    cardPadding: [48, 46, 48],
    autoTitle: true,
  },

  // ─── 4. Dark ──────────────────────────────────────────────
  // For: night reading, premium/luxury feel
  // Structure: soft contrast, slightly looser spacing, warm tint
  {
    id: "dark",
    name: "Dark",
    nameZh: "夜间",
    description: "Dark mode with warm, easy-on-the-eyes text",
    cardBg: "#1a1a1e",
    cardStyle: { background: "#1a1a1e", position: "relative" },
    headerStyle: {
      fontFamily: "'PingFang SC', -apple-system, sans-serif",
      fontSize: "13px",
      fontWeight: "400",
      color: "#555",
      letterSpacing: "3px",
      borderBottom: "1px solid #2a2a2e",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'PingFang SC', -apple-system, sans-serif",
      color: "#d8d4cf",
      fontSize: "32px",
      lineHeight: "1.8",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#4a4a4e",
      fontSize: "13px",
    },
    layout: "single-column",
    borderColor: "#2a2a2e",
    previewBg: "#1a1a1e",
    previewAccent: "#666",
    illustrationStyle: "lineart",
    illustrationColor: "#333",
    defaultFontId: "pingfang",
    showHeader: true,
    fillRatio: 0.70,
    cardPadding: [48, 50, 48],
    autoTitle: false,
  },

  // ─── 5. Creative ──────────────────────────────────────────
  // For: poetry, quotes, artistic/emotional content
  // Structure: centered, extra-large line height, decorative feel
  {
    id: "creative",
    name: "Creative",
    nameZh: "文艺",
    description: "Centered text with poetic spacing and decoration",
    cardBg: "#f3ede2",
    cardStyle: { background: "#f3ede2", position: "relative" },
    headerStyle: {
      fontFamily: "'Kaiti SC', 'STKaiti', Georgia, serif",
      fontSize: "14px",
      fontWeight: "400",
      color: "#a09080",
      textAlign: "center",
      letterSpacing: "6px",
      borderBottom: "none",
      paddingBottom: "0",
    },
    textStyle: {
      fontFamily: "'Kaiti SC', 'STKaiti', Georgia, serif",
      color: "#3a3025",
      fontSize: "32px",
      lineHeight: "2.2",
      textAlign: "center",
    },
    pageNumStyle: {
      fontFamily: "'Kaiti SC', serif",
      color: "#baa898",
      fontSize: "13px",
    },
    layout: "single-column",
    borderColor: "#d0c4b000",
    previewBg: "#f3ede2",
    previewAccent: "#a09080",
    illustrationStyle: "botanical",
    illustrationColor: "#b8a898",
    defaultFontId: "kaiti",
    showHeader: false,
    fillRatio: 0.55,
    cardPadding: [60, 60, 60],
    autoTitle: false,
  },
];
