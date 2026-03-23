"use client";

/**
 * CardPreview
 *
 * Displays a grid of card thumbnail images (data URLs from html2canvas-pro).
 * Clicking a thumbnail opens a full-size modal overlay.
 */

import { useState } from "react";

interface CardPreviewProps {
  dataUrls: string[];
  templateName: string;
}

export default function CardPreview({ dataUrls, templateName }: CardPreviewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (dataUrls.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {dataUrls.map((url, i) => (
          <button
            key={i}
            onClick={() => setExpanded(i)}
            className="group relative rounded-xl overflow-hidden bg-gray-800 ring-1 ring-white/10 hover:ring-indigo-400/60 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label={`View card ${i + 1} of ${dataUrls.length} full size`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${templateName} card ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/60 rounded-full px-3 py-1">
                View full size
              </span>
            </div>
            {/* Card number badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium rounded-full px-2 py-0.5 backdrop-blur-sm">
              {i + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {expanded !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setExpanded(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Card full size preview"
        >
          <div
            className="relative max-w-[90vmin] max-h-[90vmin] w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrls[expanded]}
              alt={`${templateName} card ${expanded + 1} full size`}
              className="w-full h-full object-contain"
            />

            {/* Navigation arrows */}
            {expanded > 0 && (
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(expanded - 1);
                }}
                aria-label="Previous card"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            {expanded < dataUrls.length - 1 && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(expanded + 1);
                }}
                aria-label="Next card"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            {/* Close */}
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setExpanded(null)}
              aria-label="Close preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm rounded-full px-3 py-1 backdrop-blur-sm">
              {expanded + 1} / {dataUrls.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
