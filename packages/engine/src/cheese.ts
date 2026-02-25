const CHEESE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" fill="FILL"/>
  <path d="M8 12 L24 8 L26 22 Q22 28 12 26 Z" fill="#F5D45A" stroke="#D4A843" stroke-width="0.5"/>
  <circle cx="14" cy="17" r="2" fill="#D4A843" opacity="0.6"/>
  <circle cx="20" cy="14" r="1.5" fill="#D4A843" opacity="0.6"/>
  <circle cx="18" cy="21" r="1.8" fill="#D4A843" opacity="0.6"/>
  <circle cx="22" cy="18" r="1" fill="#D4A843" opacity="0.5"/>
</svg>`;

/** Create an HTMLImageElement from the cheese SVG template filled with the given color. */
export function loadCheeseImage(color: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const svg = CHEESE_SVG.replace('FILL', color);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
