/**
 * Locally-generated placeholder artwork.
 *
 * Instead of depending on a remote image host (which can be blocked, slow, or
 * rate-limited when a page requests dozens of images at once), every title gets
 * its own gradient poster/backdrop as an inline SVG data URI. These render
 * instantly, work offline, and never 404 — and they stay on-theme by using cool
 * blue→green→indigo hues derived from the title id.
 */

type ArtInput = { id: string; name: string; category: string };

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      default: return "&quot;";
    }
  });
}

function initials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Greedy word-wrap into at most `maxLines` lines, adding an ellipsis if cut. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines && lines[maxLines - 1].length > maxChars - 1) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, maxChars - 1)}…`;
  }
  return lines;
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const FONT = "'Segoe UI', system-ui, Arial, sans-serif";

function render(input: ArtInput, width: number, height: number, portrait: boolean): string {
  const seed = hash(input.id);
  const hue = 150 + (seed % 140); // cool range: teal → blue → indigo → violet
  const c1 = `hsl(${hue} 68% 52%)`;
  const c2 = `hsl(${(hue + 38) % 360} 64% 32%)`;

  const titleSize = portrait ? 30 : 54;
  const lineHeight = titleSize * 1.12;
  const lines = wrap(input.name, portrait ? 15 : 24, portrait ? 3 : 2);
  const baseY = height - (portrait ? 34 : 56) - (lines.length - 1) * lineHeight;
  const pad = portrait ? 26 : 56;

  const nameLines = lines
    .map(
      (line, index) =>
        `<text x="${pad}" y="${baseY + index * lineHeight}" font-family="${FONT}" font-size="${titleSize}" font-weight="800" fill="#fff">${escapeXml(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.65"/></linearGradient>
</defs>
<rect width="${width}" height="${height}" fill="#0b0d11"/>
<rect width="${width}" height="${height}" fill="url(#g)" opacity="0.92"/>
<circle cx="${width * 0.8}" cy="${height * 0.18}" r="${width * 0.4}" fill="#fff" opacity="0.08"/>
<circle cx="${width * 0.15}" cy="${height * 0.85}" r="${width * 0.35}" fill="#000" opacity="0.12"/>
<text x="${pad}" y="${height * 0.55}" font-family="${FONT}" font-size="${portrait ? 150 : 200}" font-weight="800" fill="#fff" opacity="0.14">${escapeXml(initials(input.name))}</text>
<rect width="${width}" height="${height}" fill="url(#s)"/>
<text x="${pad}" y="${portrait ? 46 : 60}" font-family="${FONT}" font-size="${portrait ? 16 : 20}" font-weight="700" letter-spacing="2" fill="#fff" opacity="0.85">${escapeXml(input.category.toUpperCase())}</text>
${nameLines}
</svg>`;

  return toDataUri(svg);
}

/** Portrait poster (2:3) for cards. */
export function posterArt(input: ArtInput): string {
  return render(input, 480, 720, true);
}

/** Landscape backdrop (16:9) for the hero, detail page and continue-watching. */
export function backdropArt(input: ArtInput): string {
  return render(input, 1280, 720, false);
}
