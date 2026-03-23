export interface AspectRatioConfig {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const aspectRatios: AspectRatioConfig[] = [
  { id: "3:4",  label: "3:4",  width: 1080, height: 1440 },
  { id: "1:1",  label: "1:1",  width: 1080, height: 1080 },
  { id: "4:3",  label: "4:3",  width: 1080, height: 810 },
  { id: "16:9", label: "16:9", width: 1080, height: 608 },
];

export const MARGIN = 60;
export const HEADER_OFFSET = 50;
export const BOTTOM_OFFSET = 40;

/** Content area dimensions for a given card size */
export function getContentArea(w: number, h: number) {
  const contentW = w - 2 * (MARGIN + 10);
  const contentH = h - (MARGIN + HEADER_OFFSET) - (MARGIN + BOTTOM_OFFSET);
  return { contentW, contentH };
}
