/* Ícones SVG line (profissionais) — substituem emojis. Herdam currentColor. */
export default function RacionalIcon({ name, size = 18, stroke = 2, style }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', style, 'aria-hidden': true };
  switch (name) {
    case 'book':
      return (<svg {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" /></svg>);
    case 'target':
      return (<svg {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></svg>);
    case 'spark':
      return (<svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>);
    case 'pin':
      return (<svg {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);
    case 'mic':
      return (<svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>);
    case 'check':
      return (<svg {...p}><path d="M20 6 9 17l-5-5" /></svg>);
    case 'chevron':
      return (<svg {...p}><path d="m9 6 6 6-6 6" /></svg>);
    case 'arrow-left':
      return (<svg {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>);
    case 'image':
      return (<svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>);
    case 'cards':
      return (<svg {...p}><rect x="3" y="5" width="13" height="15" rx="2" /><path d="M8 5V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-1" /></svg>);
    case 'printer':
      return (<svg {...p}><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="7" rx="1" /></svg>);
    default:
      return null;
  }
}
