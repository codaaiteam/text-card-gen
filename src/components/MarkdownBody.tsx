"use client";

import { useMemo } from "react";
import { marked } from "marked";

interface MarkdownBodyProps {
  text: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  textColor: string;
}

/**
 * Inject inline styles into rendered HTML so they survive
 * Tailwind's CSS reset and render correctly in html2canvas.
 */
function injectInlineStyles(html: string, fontSize: number, textColor: string): string {
  const f = fontSize;
  return html
    // Headings
    .replace(/<h1([ >])/g, `<h1 style="font-size:${f * 1.6}px;font-weight:700;line-height:1.3;margin:0 0 0.4em 0;color:${textColor}"$1`)
    .replace(/<h2([ >])/g, `<h2 style="font-size:${f * 1.35}px;font-weight:700;line-height:1.3;margin:0 0 0.4em 0;color:${textColor}"$1`)
    .replace(/<h3([ >])/g, `<h3 style="font-size:${f * 1.15}px;font-weight:600;line-height:1.3;margin:0 0 0.35em 0;color:${textColor}"$1`)
    .replace(/<h4([ >])/g, `<h4 style="font-size:${f * 1.05}px;font-weight:600;line-height:1.3;margin:0 0 0.3em 0;color:${textColor}"$1`)
    // Paragraphs
    .replace(/<p>/g, `<p style="margin:0 0 0.6em 0">`)
    // Bold / italic
    .replace(/<strong>/g, `<strong style="font-weight:700">`)
    .replace(/<em>/g, `<em style="font-style:italic">`)
    // Blockquote
    .replace(/<blockquote>/g, `<blockquote style="margin:0.5em 0;padding-left:0.8em;border-left:3px solid ${textColor};opacity:0.75">`)
    // Lists
    .replace(/<ul>/g, `<ul style="margin:0.4em 0;padding-left:1.2em;list-style-type:disc">`)
    .replace(/<ol>/g, `<ol style="margin:0.4em 0;padding-left:1.2em;list-style-type:decimal">`)
    .replace(/<li>/g, `<li style="margin:0.15em 0;display:list-item">`)
    // Images
    .replace(/<img /g, `<img style="max-width:100%;border-radius:8px;margin:0.5em auto;display:block" `)
    // Horizontal rule
    .replace(/<hr>/g, `<hr style="border:none;border-top:1px solid ${textColor};opacity:0.2;margin:0.8em 0">`)
    .replace(/<hr \/>/g, `<hr style="border:none;border-top:1px solid ${textColor};opacity:0.2;margin:0.8em 0">`)
    // Code
    .replace(/<code>/g, `<code style="font-size:0.85em;background:rgba(128,128,128,0.15);padding:0.1em 0.3em;border-radius:3px">`)
    .replace(/<pre>/g, `<pre style="margin:0.5em 0;padding:0.6em;background:rgba(128,128,128,0.1);border-radius:6px;overflow-x:auto">`);
}

export default function MarkdownBody({ text, fontSize, lineHeight, fontFamily, textColor }: MarkdownBodyProps) {
  const html = useMemo(() => {
    marked.setOptions({ breaks: true, gfm: true });
    const raw = marked.parse(text) as string;
    return injectInlineStyles(raw, fontSize, textColor);
  }, [text, fontSize, textColor]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: String(lineHeight),
        color: textColor,
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    />
  );
}
