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

  const rawSentences = processed.split(/(?<=[.!?…])\s+(?=[A-Z"'(\[])/);

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
      cards.push(sentence);
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
 * Returns estimated character capacity per card based on layout.
 * Two-column layouts can fit more text than single-column.
 */
export function getCharsPerCard(layout: "single-column" | "two-column"): number {
  return layout === "two-column" ? 900 : 650;
}

export function suggestWordsPerCard(text: string): number {
  const total = countWords(text);
  if (total <= 0) return 120;
  const suggested = Math.ceil(total / 8);
  return Math.max(80, Math.min(250, suggested));
}
