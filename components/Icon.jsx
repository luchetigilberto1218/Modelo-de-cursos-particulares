/**
 * Icon — minimal inline SVG set.
 * Usage: <Icon name="target" size={18} color="#B7791F" />
 *
 * All icons are 24x24, stroke-based (currentColor), 1.6px stroke.
 * Designed to feel editorial / Apple-class — not emoji.
 */
const PATHS = {
  flag:        'M5 21V5h11l-2 4 2 4H5',
  target:      'M12 3v3M12 18v3M3 12h3M18 12h3M16.95 7.05l-2.12 2.12M9.17 14.83l-2.12 2.12M16.95 16.95l-2.12-2.12M9.17 9.17 7.05 7.05',
  edit:        'M4 21v-4l11-11 4 4-11 11H4zM14 6l4 4',
  refresh:     'M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 14-3M20 14a8 8 0 0 1-14 3',
  help:        'M9.5 9.5a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.2-1.5 2.5M12 18h.01',
  trophy:      'M8 4h8v5a4 4 0 0 1-8 0V4zM5 4h3v3a3 3 0 0 1-3 0V4zM16 4h3v3a3 3 0 0 1-3 0V4zM12 13v4M9 21h6M10 17h4',
  bicep:       'M5 12a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H10c-2 0-2.5-1-2.5-2.5S6 12 5 12z',
  seedling:    'M12 22V11M12 11c0-3 2-5 5-5h2c0 4-3 6-7 6zM12 11C12 8 10 6 7 6H5c0 4 3 5 7 5z',
  phone:       'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  list:        'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  pin:         'M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  eye:         'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  check:       'M5 13l4 4L19 7',
  film:        'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zM7 4v16M17 4v16M3 10h4M3 14h4M17 10h4M17 14h4',
  pen:         'M16 4l4 4-12 12H4v-4L16 4z',
  mic:         'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v4M8 22h8',
};

export default function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.6, style }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
