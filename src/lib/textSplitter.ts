/**
 * Splits input text into segments suitable for card display.
 *
 * Strategy:
 * 1. Tokenize into sentences using a regex that handles common abbreviations.
 * 2. Greedily accumulate sentences until the running word count reaches
 *    the target. Never break mid-sentence.
 * 3. If a single sentence exceeds the target it occupies its own card.
 */

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Splits `text` into an array of sentence strings.
 * Handles "e.g.", "i.e.", "Mr.", "Dr.", "vs." etc. by not splitting on
 * abbreviation-period patterns.
 */
function splitIntoSentences(text: string): string[] {
  // Replace known abbreviations temporarily to avoid false splits
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

  // Split on sentence-ending punctuation followed by whitespace/end
  const rawSentences = processed.split(/(?<=[.!?…])\s+(?=[A-Z"'(\[])/);

  return rawSentences.map((s) => {
    let restored = s;
    placeholders.forEach((abbr, i) => {
      restored = restored.split(`__ABBR${i}__`).join(abbr);
    });
    return restored.trim();
  }).filter(Boolean);
}

export function splitText(text: string, wordsPerCard: number): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!cleaned) return [];

  const sentences = splitIntoSentences(cleaned);
  if (sentences.length === 0) return [cleaned];

  const cards: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  for (const sentence of sentences) {
    const sentWords = countWords(sentence);

    if (sentWords >= wordsPerCard) {
      // Flush current buffer first
      if (current.length > 0) {
        cards.push(current.join(" "));
        current = [];
        currentWords = 0;
      }
      // Sentence gets its own card
      cards.push(sentence);
      continue;
    }

    if (currentWords + sentWords > wordsPerCard && current.length > 0) {
      // Flush and start new card
      cards.push(current.join(" "));
      current = [sentence];
      currentWords = sentWords;
    } else {
      current.push(sentence);
      currentWords += sentWords;
    }
  }

  if (current.length > 0) {
    cards.push(current.join(" "));
  }

  return cards;
}

/**
 * Returns a suggested words-per-card value based on text length
 * targeting roughly 6-10 cards total.
 */
export function suggestWordsPerCard(text: string): number {
  const total = countWords(text);
  if (total <= 0) return 120;
  // Target ~8 cards
  const suggested = Math.ceil(total / 8);
  // Clamp between 80 and 200
  return Math.max(80, Math.min(200, suggested));
}
