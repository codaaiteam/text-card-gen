import React from "react";

export type IllustrationStyle = "botanical" | "geometric" | "lineart" | "ornamental";

const SIZE = 240;

// ─── Botanical ──────────────────────────────────────────────

const LeafBranch = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M130 140 C110 100, 80 80, 40 30" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M85 75 C70 65, 55 70, 50 55" stroke={color} strokeWidth="1" fill="none" />
    <path d="M100 95 C115 85, 125 75, 120 60" stroke={color} strokeWidth="1" fill="none" />
    <path d="M75 85 C60 90, 45 85, 35 75" stroke={color} strokeWidth="1" fill="none" />
    <ellipse cx="42" cy="32" rx="8" ry="12" transform="rotate(-30 42 32)" stroke={color} strokeWidth="0.8" fill="none" />
    <ellipse cx="52" cy="57" rx="6" ry="10" transform="rotate(-50 52 57)" stroke={color} strokeWidth="0.8" fill="none" />
    <ellipse cx="118" cy="62" rx="7" ry="11" transform="rotate(20 118 62)" stroke={color} strokeWidth="0.8" fill="none" />
  </svg>
);

const FlowerSprig = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 145 C80 110, 75 80, 60 50" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M80 145 C85 120, 95 90, 110 65" stroke={color} strokeWidth="1" fill="none" />
    <circle cx="60" cy="45" r="10" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="60" cy="45" r="4" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="110" cy="60" r="8" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="110" cy="60" r="3" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M72 80 C60 75, 48 80, 42 72" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M90 100 C100 95, 108 100, 115 92" stroke={color} strokeWidth="0.8" fill="none" />
  </svg>
);

const VineTendril = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 150 C30 120, 50 100, 70 80 S110 50, 140 20" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M50 110 C40 100, 35 85, 25 80" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M90 65 C100 55, 110 55, 120 45" stroke={color} strokeWidth="0.8" fill="none" />
    <ellipse cx="27" cy="78" rx="5" ry="8" transform="rotate(-20 27 78)" stroke={color} strokeWidth="0.7" fill="none" />
    <ellipse cx="118" cy="43" rx="5" ry="8" transform="rotate(30 118 43)" stroke={color} strokeWidth="0.7" fill="none" />
    <path d="M65 90 C55 95, 45 92, 38 98" stroke={color} strokeWidth="0.7" fill="none" />
  </svg>
);

const FernFrond = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 150 C78 120, 75 90, 72 40" stroke={color} strokeWidth="1.5" fill="none" />
    {[30, 50, 70, 90, 110, 125].map((y, i) => (
      <React.Fragment key={i}>
        <path d={`M${75 - i * 0.5} ${y} C${60 - i * 2} ${y - 10}, ${50 - i * 2} ${y - 15}, ${40 - i} ${y - 12}`} stroke={color} strokeWidth="0.7" fill="none" />
        <path d={`M${78 + i * 0.5} ${y} C${93 + i * 2} ${y - 10}, ${103 + i * 2} ${y - 15}, ${113 + i} ${y - 12}`} stroke={color} strokeWidth="0.7" fill="none" />
      </React.Fragment>
    ))}
  </svg>
);

// ─── Geometric ──────────────────────────────────────────────

const ConcentricCircles = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[15, 30, 45, 60].map((r, i) => (
      <circle key={i} cx="80" cy="80" r={r} stroke={color} strokeWidth="0.6" fill="none" />
    ))}
    <circle cx="80" cy="80" r="3" fill={color} opacity="0.3" />
  </svg>
);

const DiamondLattice = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[40, 60, 80, 100, 120].map((y, i) => (
      <React.Fragment key={i}>
        {[40, 60, 80, 100, 120].map((x, j) => (
          <rect key={j} x={x - 6} y={y - 6} width="12" height="12" transform={`rotate(45 ${x} ${y})`} stroke={color} strokeWidth="0.5" fill="none" />
        ))}
      </React.Fragment>
    ))}
  </svg>
);

const DotGrid = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 7 }, (_, i) => 25 + i * 18).map((y) =>
      Array.from({ length: 7 }, (_, j) => 25 + j * 18).map((x) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={color} opacity="0.4" />
      ))
    )}
  </svg>
);

const HexCluster = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[[80, 50], [55, 65], [105, 65], [55, 95], [105, 95], [80, 110]].map(([cx, cy], i) => (
      <polygon key={i} points={hexPoints(cx!, cy!, 18)} stroke={color} strokeWidth="0.6" fill="none" />
    ))}
  </svg>
);

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

// ─── Line Art ───────────────────────────────────────────────

const QuillPen = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 145 L65 55 C70 35, 85 20, 120 15" stroke={color} strokeWidth="1.2" fill="none" />
    <path d="M65 55 C60 50, 55 52, 50 58" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M65 55 L62 75" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M120 15 C105 25, 95 35, 90 50" stroke={color} strokeWidth="0.6" fill="none" opacity="0.5" />
  </svg>
);

const OpenBook = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 60 C60 55, 30 55, 20 65 L20 120 C30 112, 60 112, 80 118" stroke={color} strokeWidth="1" fill="none" />
    <path d="M80 60 C100 55, 130 55, 140 65 L140 120 C130 112, 100 112, 80 118" stroke={color} strokeWidth="1" fill="none" />
    <path d="M80 60 L80 118" stroke={color} strokeWidth="0.6" fill="none" />
    {[75, 85, 95, 105].map((y, i) => (
      <React.Fragment key={i}>
        <line x1="30" y1={y} x2="70" y2={y - 2} stroke={color} strokeWidth="0.4" opacity="0.4" />
        <line x1="90" y1={y - 2} x2="130" y2={y} stroke={color} strokeWidth="0.4" opacity="0.4" />
      </React.Fragment>
    ))}
  </svg>
);

const ScrollIcon = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 30 C35 30, 30 40, 30 50 L30 120 C30 130, 40 135, 50 130 L120 130 C130 130, 135 120, 130 115 L130 50 C130 40, 120 30, 110 35 L50 35" stroke={color} strokeWidth="1" fill="none" />
    <path d="M45 30 C45 40, 50 45, 55 40" stroke={color} strokeWidth="0.8" fill="none" />
    {[55, 70, 85, 100].map((y, i) => (
      <line key={i} x1="50" y1={y} x2="110" y2={y} stroke={color} strokeWidth="0.4" opacity="0.3" />
    ))}
  </svg>
);

const InkDrop = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 30 C80 30, 50 75, 50 100 C50 118, 63 130, 80 130 C97 130, 110 118, 110 100 C110 75, 80 30, 80 30Z" stroke={color} strokeWidth="1" fill="none" />
    <ellipse cx="80" cy="105" rx="15" ry="8" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
    <circle cx="72" cy="95" r="3" fill={color} opacity="0.15" />
  </svg>
);

// ─── Ornamental ─────────────────────────────────────────────

const CornerFiligree = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 150 C10 100, 20 60, 50 40" stroke={color} strokeWidth="1" fill="none" />
    <path d="M10 150 C50 145, 90 130, 120 100" stroke={color} strokeWidth="1" fill="none" />
    <path d="M10 150 C30 120, 40 90, 40 60" stroke={color} strokeWidth="0.6" fill="none" />
    <path d="M10 150 C50 135, 80 115, 100 90" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="50" cy="40" r="4" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="120" cy="100" r="4" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="10" cy="150" r="3" fill={color} opacity="0.3" />
  </svg>
);

const Flourish = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80 C40 60, 60 50, 80 50 C100 50, 120 60, 140 80" stroke={color} strokeWidth="1" fill="none" />
    <path d="M20 80 C40 100, 60 110, 80 110 C100 110, 120 100, 140 80" stroke={color} strokeWidth="1" fill="none" />
    <path d="M60 65 C65 55, 75 50, 80 50" stroke={color} strokeWidth="0.6" fill="none" />
    <path d="M100 65 C95 55, 85 50, 80 50" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="80" cy="80" r="5" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="80" cy="80" r="2" fill={color} opacity="0.3" />
  </svg>
);

const Arabesque = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 20 C95 40, 130 50, 140 80 C130 110, 95 120, 80 140 C65 120, 30 110, 20 80 C30 50, 65 40, 80 20Z" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M80 40 C90 55, 115 60, 125 80 C115 100, 90 105, 80 120 C70 105, 45 100, 35 80 C45 60, 70 55, 80 40Z" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="80" cy="80" r="8" stroke={color} strokeWidth="0.5" fill="none" />
  </svg>
);

const FleurDeLis = ({ color }: { color: string }) => (
  <svg width={SIZE} height={SIZE} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80 25 C85 45, 95 55, 105 50 C100 65, 90 70, 80 70 C70 70, 60 65, 55 50 C65 55, 75 45, 80 25Z" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M55 70 C40 75, 30 90, 40 100 C50 95, 60 85, 65 80" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M105 70 C120 75, 130 90, 120 100 C110 95, 100 85, 95 80" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M80 70 L80 135" stroke={color} strokeWidth="1" fill="none" />
    <line x1="65" y1="110" x2="95" y2="110" stroke={color} strokeWidth="0.8" />
  </svg>
);

// ─── Catalog ────────────────────────────────────────────────

type IllustrationComponent = React.FC<{ color: string }>;

const catalog: Record<IllustrationStyle, IllustrationComponent[]> = {
  botanical: [LeafBranch, FlowerSprig, VineTendril, FernFrond],
  geometric: [ConcentricCircles, DiamondLattice, DotGrid, HexCluster],
  lineart: [QuillPen, OpenBook, ScrollIcon, InkDrop],
  ornamental: [CornerFiligree, Flourish, Arabesque, FleurDeLis],
};

export function getIllustration(
  style: IllustrationStyle,
  index: number,
  color: string,
): React.ReactNode {
  const set = catalog[style];
  const Comp = set[index % set.length];
  return <Comp color={color} />;
}

// ─── Inline divider vignettes ───────────────────────────────
// Small scene illustrations used as paragraph separators

const DIVIDER_W = 200;
const DIVIDER_H = 56;

const MountainDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 44 L55 16 L68 28 L85 8 L110 36 L125 24 L145 44" stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="160" cy="14" r="8" stroke={color} strokeWidth="0.8" fill="none" />
    <line x1="10" y1="44" x2="190" y2="44" stroke={color} strokeWidth="0.5" opacity="0.3" />
  </svg>
);

const CloudDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 36 C50 28, 58 22, 66 24 C68 18, 76 14, 84 18 C88 12, 100 10, 106 16 C110 12, 120 12, 124 18 C132 14, 142 18, 142 26 C148 26, 152 32, 148 36" stroke={color} strokeWidth="1" fill="none" />
    <line x1="20" y1="44" x2="180" y2="44" stroke={color} strokeWidth="0.5" opacity="0.3" />
  </svg>
);

const BirdsDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 28 C63 22, 68 22, 72 28" stroke={color} strokeWidth="1" fill="none" />
    <path d="M80 20 C84 14, 90 14, 94 20" stroke={color} strokeWidth="1" fill="none" />
    <path d="M105 24 C108 18, 113 18, 116 24" stroke={color} strokeWidth="1" fill="none" />
    <path d="M125 30 C127 26, 131 26, 133 30" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M90 34 C92 30, 95 30, 97 34" stroke={color} strokeWidth="0.8" fill="none" />
    <line x1="30" y1="44" x2="170" y2="44" stroke={color} strokeWidth="0.5" opacity="0.3" />
  </svg>
);

const WaveDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 28 C40 18, 50 18, 60 28 S80 38, 100 28 S120 18, 140 28 S160 38, 180 28" stroke={color} strokeWidth="1" fill="none" />
    <path d="M30 34 C45 26, 55 26, 65 34 S85 42, 100 34 S115 26, 135 34 S155 42, 170 34" stroke={color} strokeWidth="0.6" fill="none" opacity="0.4" />
  </svg>
);

const TreeDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="100" y1="48" x2="100" y2="20" stroke={color} strokeWidth="1" />
    <circle cx="100" cy="14" r="10" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="92" cy="18" r="7" stroke={color} strokeWidth="0.6" fill="none" />
    <circle cx="108" cy="18" r="7" stroke={color} strokeWidth="0.6" fill="none" />
    <line x1="30" y1="48" x2="70" y2="48" stroke={color} strokeWidth="0.5" opacity="0.3" />
    <line x1="130" y1="48" x2="170" y2="48" stroke={color} strokeWidth="0.5" opacity="0.3" />
  </svg>
);

const StarDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="28" x2="80" y2="28" stroke={color} strokeWidth="0.5" opacity="0.3" />
    <line x1="120" y1="28" x2="180" y2="28" stroke={color} strokeWidth="0.5" opacity="0.3" />
    <path d="M100 14 L103 22 L112 22 L105 28 L108 36 L100 31 L92 36 L95 28 L88 22 L97 22Z" stroke={color} strokeWidth="0.8" fill="none" />
    <circle cx="72" cy="28" r="2" fill={color} opacity="0.3" />
    <circle cx="128" cy="28" r="2" fill={color} opacity="0.3" />
  </svg>
);

const LanternDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="100" y1="6" x2="100" y2="12" stroke={color} strokeWidth="0.8" />
    <ellipse cx="100" cy="28" rx="12" ry="16" stroke={color} strokeWidth="1" fill="none" />
    <line x1="92" y1="28" x2="108" y2="28" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="100" y1="44" x2="100" y2="50" stroke={color} strokeWidth="0.6" />
    <path d="M96 50 L100 54 L104 50" stroke={color} strokeWidth="0.5" fill="none" />
    <line x1="25" y1="28" x2="78" y2="28" stroke={color} strokeWidth="0.5" opacity="0.2" />
    <line x1="122" y1="28" x2="175" y2="28" stroke={color} strokeWidth="0.5" opacity="0.2" />
  </svg>
);

const BoatDivider = ({ color }: { color: string }) => (
  <svg width={DIVIDER_W} height={DIVIDER_H} viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 34 L85 20 L87 34" stroke={color} strokeWidth="0.8" fill="none" />
    <path d="M70 36 C75 40, 95 42, 115 36" stroke={color} strokeWidth="1" fill="none" />
    <path d="M85 36 L87 34" stroke={color} strokeWidth="0.8" />
    <path d="M30 40 C50 36, 70 38, 90 36 S130 34, 170 40" stroke={color} strokeWidth="0.5" fill="none" opacity="0.3" />
    <path d="M25 44 C55 40, 85 42, 105 40 S145 38, 175 44" stroke={color} strokeWidth="0.4" fill="none" opacity="0.2" />
  </svg>
);

const dividerCatalog: IllustrationComponent[] = [
  MountainDivider, CloudDivider, BirdsDivider, WaveDivider,
  TreeDivider, StarDivider, LanternDivider, BoatDivider,
];

export function getDivider(index: number, color: string): React.ReactNode {
  const Comp = dividerCatalog[index % dividerCatalog.length];
  return <Comp color={color} />;
}

export const DIVIDER_HEIGHT = DIVIDER_H;
