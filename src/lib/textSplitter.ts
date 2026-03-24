/**
 * Splits input text into segments for newspaper-style card display.
 *
 * No artificial character/word limit — each card holds as much text as
 * will visually fit at the given font size. The caller specifies an
 * approximate character capacity per card (based on layout + font size).
 */

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitIntoSentences(text: string): string[] {
  const abbrevs = [
    "Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Sr.", "Jr.", "vs.",
    "etc.", "e.g.", "i.e.", "Inc.", "Ltd.", "Corp.", "Fig.", "St.",
    "No.", "Vol.", "pp.", "al.",
  ];
  let processed = text;
  const placeholders: string[] = [];
  abbrevs.forEach((abbr, i) => {
    const placeholder = `__ABBR${i}__`;
    placeholders.push(abbr);
    processed = processed.split(abbr).join(placeholder);
  });

  // Split on Latin sentence boundaries OR CJK sentence-ending punctuation
  // CJK: split after 。！？…）」』】 (no space/uppercase required)
  const rawSentences = processed.split(
    /(?<=[.!?…])\s+(?=[A-Z"'(\[])|(?<=[。！？…）」』】])/
  );

  return rawSentences.map((s) => {
    let restored = s;
    placeholders.forEach((abbr, i) => {
      restored = restored.split(`__ABBR${i}__`).join(abbr);
    });
    return restored.trim();
  }).filter(Boolean);
}

/**
 * Split text into card segments.
 * `charsPerCard` is the approximate visual capacity of one card.
 * For two-column layout at 23px font, ~800 chars fit.
 * For single-column at 23px font, ~600 chars fit.
 */
export function splitText(text: string, charsPerCard: number): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!cleaned) return [];

  // If text fits in one card, return it as-is
  if (cleaned.length <= charsPerCard) return [cleaned];

  const sentences = splitIntoSentences(cleaned);
  if (sentences.length === 0) return [cleaned];

  const cards: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const sentence of sentences) {
    const sentLen = sentence.length;

    if (sentLen >= charsPerCard) {
      if (current.length > 0) {
        cards.push(current.join(" "));
        current = [];
        currentLen = 0;
      }
      // Break oversized sentences into card-sized chunks at word/clause boundaries
      let remaining = sentence;
      while (remaining.length > charsPerCard) {
        let breakAt = remaining.lastIndexOf("，", charsPerCard);
        if (breakAt < charsPerCard * 0.3) breakAt = remaining.lastIndexOf("、", charsPerCard);
        if (breakAt < charsPerCard * 0.3) breakAt = remaining.lastIndexOf(" ", charsPerCard);
        if (breakAt < charsPerCard * 0.3) breakAt = charsPerCard;
        cards.push(remaining.substring(0, breakAt + 1).trim());
        remaining = remaining.substring(breakAt + 1).trim();
      }
      if (remaining) {
        current = [remaining];
        currentLen = remaining.length;
      }
      continue;
    }

    if (currentLen + sentLen + 1 > charsPerCard && current.length > 0) {
      cards.push(current.join(" "));
      current = [sentence];
      currentLen = sentLen;
    } else {
      current.push(sentence);
      currentLen += sentLen + 1;
    }
  }

  if (current.length > 0) {
    cards.push(current.join(" "));
  }

  return cards;
}

/**
 * Returns estimated character capacity per card based on layout, font size,
 * and card dimensions.
 */
export function getCharsPerCard(
  layout: "single-column" | "two-column",
  fontSize: number,
  cardWidth: number,
  cardHeight: number,
  hasIllustrations: boolean = true,
  fillRatio: number = 0.70,
  cardPadding?: [number, number, number],
  showHeader?: boolean,
): number {
  const pad = cardPadding ?? [48, 50, 48];
  const headerH = showHeader !== false ? 50 : 10;
  const contentW = cardWidth - 2 * pad[1];
  const dividerSpace = (hasIllustrations && layout === "single-column") ? 160 : 0;
  const contentH = cardHeight - pad[0] - headerH - pad[2] - 30 - dividerSpace;
  const colW = layout === "two-column" ? Math.floor((contentW - 31) / 2) : contentW;

  const lineHeight = fontSize >= 48 ? 1.8 : fontSize >= 40 ? 1.75 : 1.7;
  const lines = Math.floor(contentH / (fontSize * lineHeight));

  const charsPerLine = Math.floor(colW / (fontSize * 0.9));
  const cols = layout === "two-column" ? 2 : 1;

  return Math.round(charsPerLine * lines * cols * fillRatio);
}

/**
 * Split Markdown text into card segments.
 * Uses `---` (horizontal rule) as explicit page breaks.
 * If no `---`, splits by paragraph groups to fill each card.
 */
export function splitMarkdown(text: string, charsPerCard: number): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  // Check for explicit page breaks (--- on its own line)
  const explicitPages = cleaned.split(/\n---\n/).map(s => s.trim()).filter(Boolean);
  if (explicitPages.length > 1) return explicitPages;

  // No explicit breaks — split by paragraph groups
  const paragraphs = cleaned.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
  if (paragraphs.length === 0) return [cleaned];
  if (paragraphs.length === 1) return [cleaned];

  const cards: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const para of paragraphs) {
    // Estimate rendered length: strip markdown syntax for counting
    const rendered = para.replace(/[#*_~`>\[\]()!]/g, "").replace(/\!\[.*?\]\(.*?\)/g, "[img]");
    const paraLen = rendered.length;

    if (currentLen + paraLen > charsPerCard && current.length > 0) {
      cards.push(current.join("\n\n"));
      current = [para];
      currentLen = paraLen;
    } else {
      current.push(para);
      currentLen += paraLen;
    }
  }

  if (current.length > 0) {
    cards.push(current.join("\n\n"));
  }

  return cards;
}

export function suggestWordsPerCard(text: string): number {
  const total = countWords(text);
  if (total <= 0) return 120;
  const suggested = Math.ceil(total / 8);
  return Math.max(80, Math.min(250, suggested));
}
