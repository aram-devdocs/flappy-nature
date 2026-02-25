/** Props for {@link CheeseIcon}. */
export interface CheeseIconProps {
  /** Width and height of the SVG in pixels. */
  size?: number;
  /** Fill color for the background circle. Defaults to the --fg-violet CSS variable. */
  color?: string;
}

/** Cheese-wheel-in-circle SVG icon used across game screens. */
export function CheeseIcon({ size = 48, color = 'var(--fg-violet, #5AAFA5)' }: CheeseIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Cheese icon">
      <circle cx="16" cy="16" r="14" fill={color} />
      <path
        d="M8 12 L24 8 L26 22 Q22 28 12 26 Z"
        fill="#F5D45A"
        stroke="#D4A843"
        strokeWidth="0.5"
      />
      <circle cx="14" cy="17" r="2" fill="#D4A843" opacity="0.6" />
      <circle cx="20" cy="14" r="1.5" fill="#D4A843" opacity="0.6" />
      <circle cx="18" cy="21" r="1.8" fill="#D4A843" opacity="0.6" />
      <circle cx="22" cy="18" r="1" fill="#D4A843" opacity="0.5" />
    </svg>
  );
}
