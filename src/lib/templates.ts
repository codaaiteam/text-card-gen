export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  cardBg: string;
  cardStyle: Record<string, string>;
  // Title bar at top of each card
  headerStyle: Record<string, string>;
  // Body text — newspaper-readable
  textStyle: Record<string, string>;
  // Page number
  pageNumStyle: Record<string, string>;
  // Layout
  layout: "single-column" | "two-column";
  // Border / decoration
  borderStyle: "newspaper" | "magazine" | "broadsheet" | "gazette" | "minimal-serif";
  previewBg: string;
  previewAccent: string;
}

export const templates: TemplateConfig[] = [
  {
    id: "newspaper",
    name: "Newspaper",
    description: "Classic newspaper with serif font and column rules",
    cardBg: "#f5f0e6",
    cardStyle: { background: "#f5f0e6", position: "relative" },
    headerStyle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: "20px",
      fontWeight: "700",
      color: "#1a1a1a",
      textTransform: "uppercase",
      letterSpacing: "3px",
      borderBottom: "3px double #1a1a1a",
      paddingBottom: "8px",
    },
    textStyle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#1a1a1a",
      fontSize: "24px",
      lineHeight: "1.55",
      textAlign: "justify",
    },
    pageNumStyle: {
      fontFamily: "'Georgia', serif",
      color: "#666",
      fontSize: "16px",
      fontStyle: "italic",
    },
    layout: "two-column",
    borderStyle: "newspaper",
    previewBg: "#f5f0e6",
    previewAccent: "#1a1a1a",
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "Modern magazine with sans-serif and color accents",
    cardBg: "#ffffff",
    cardStyle: { background: "#ffffff", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
      fontSize: "18px",
      fontWeight: "600",
      color: "#e63946",
      textTransform: "uppercase",
      letterSpacing: "4px",
      borderBottom: "2px solid #e63946",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
      color: "#2b2d42",
      fontSize: "23px",
      lineHeight: "1.6",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#e63946",
      fontSize: "16px",
      fontWeight: "600",
    },
    layout: "single-column",
    borderStyle: "magazine",
    previewBg: "#ffffff",
    previewAccent: "#e63946",
  },
  {
    id: "broadsheet",
    name: "Broadsheet",
    description: "Formal broadsheet with two columns and thin rules",
    cardBg: "#faf8f2",
    cardStyle: { background: "#faf8f2", position: "relative" },
    headerStyle: {
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      fontSize: "22px",
      fontWeight: "700",
      color: "#1a1a1a",
      textAlign: "center",
      borderTop: "2px solid #1a1a1a",
      borderBottom: "1px solid #1a1a1a",
      paddingTop: "6px",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      color: "#222",
      fontSize: "23px",
      lineHeight: "1.55",
      textAlign: "justify",
    },
    pageNumStyle: {
      fontFamily: "'Palatino Linotype', Palatino, serif",
      color: "#555",
      fontSize: "15px",
    },
    layout: "two-column",
    borderStyle: "broadsheet",
    previewBg: "#faf8f2",
    previewAccent: "#333",
  },
  {
    id: "gazette",
    name: "Dark Gazette",
    description: "Dark background with light text for digital reading",
    cardBg: "#1a1a2e",
    cardStyle: { background: "#1a1a2e", position: "relative" },
    headerStyle: {
      fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
      fontSize: "18px",
      fontWeight: "600",
      color: "#ffd700",
      textTransform: "uppercase",
      letterSpacing: "3px",
      borderBottom: "1px solid #ffd70066",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e8e8",
      fontSize: "24px",
      lineHeight: "1.6",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "-apple-system, sans-serif",
      color: "#ffd700",
      fontSize: "15px",
    },
    layout: "single-column",
    borderStyle: "gazette",
    previewBg: "#1a1a2e",
    previewAccent: "#ffd700",
  },
  {
    id: "minimal-serif",
    name: "Minimal Serif",
    description: "Clean white with elegant serif typography",
    cardBg: "#ffffff",
    cardStyle: { background: "#ffffff", position: "relative" },
    headerStyle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: "16px",
      fontWeight: "400",
      color: "#999",
      letterSpacing: "2px",
      textTransform: "uppercase",
      borderBottom: "1px solid #ddd",
      paddingBottom: "6px",
    },
    textStyle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#333",
      fontSize: "25px",
      lineHeight: "1.65",
      textAlign: "left",
    },
    pageNumStyle: {
      fontFamily: "'Georgia', serif",
      color: "#bbb",
      fontSize: "15px",
    },
    layout: "single-column",
    borderStyle: "minimal-serif",
    previewBg: "#ffffff",
    previewAccent: "#333",
  },
];
