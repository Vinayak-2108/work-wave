import { memo } from "react";

/*
 * One flat inline-SVG drawing per service, in theme colours only (navy, teal,
 * paper, white). No gradients, glows, text or icons. Decorative: the service
 * name beside it carries the meaning, so the SVG is aria-hidden.
 * `tone="light"` is for white cards on paper; `tone="dark"` for navy-raised
 * panels. Only the backdrop and the card surface change between the tones.
 * All drawings share one 320 x 220 box, so they scale to any column.
 */
const tones = {
  light: { panel: "fill-card-tint", surface: "fill-card" },
  dark: { panel: "fill-navy-raised-2", surface: "fill-paper" },
};

const INK = "fill-navy";
const ACCENT = "fill-teal";

/* Campaign rows: a title bar and a reach bar on a navy track. */
function Marketing({ s }) {
  const rows = [
    { y: 20, title: 96, reach: 190 },
    { y: 82, title: 72, reach: 130 },
    { y: 144, title: 110, reach: 84 },
  ];
  return (
    <>
      {rows.map((r) => (
        <g key={r.y}>
          <rect x="24" y={r.y} width="272" height="56" rx="12" className={s} />
          <rect x="40" y={r.y + 14} width={r.title} height="8" rx="4" className={INK} />
          <rect x="40" y={r.y + 32} width="240" height="10" rx="5" className={INK} />
          <rect x="40" y={r.y + 32} width={r.reach} height="10" rx="5" className={ACCENT} />
        </g>
      ))}
    </>
  );
}

/* A document: headline, lines of text and a pull-quote block. */
function Content({ s }) {
  return (
    <>
      <rect x="84" y="14" width="152" height="192" rx="10" className={s} />
      <rect x="100" y="30" width="104" height="12" rx="3" className={INK} />
      <rect x="100" y="48" width="72" height="12" rx="3" className={INK} />
      {[72, 84, 96].map((y, i) => (
        <rect key={y} x="100" y={y} width={i === 2 ? 76 : 120} height="6" rx="3" className={INK} opacity="0.2" />
      ))}
      <rect x="100" y="114" width="120" height="30" rx="6" className={ACCENT} />
      <rect x="110" y="124" width="84" height="5" rx="2.5" className={INK} />
      <rect x="110" y="133" width="56" height="5" rx="2.5" className={INK} />
      {[156, 168, 180].map((y, i) => (
        <rect key={y} x="100" y={y} width={i === 2 ? 60 : 120} height="6" rx="3" className={INK} opacity="0.2" />
      ))}
    </>
  );
}

/* Two logo options, the second one picked. */
function Logo({ s }) {
  return (
    <>
      <rect x="24" y="26" width="128" height="128" rx="16" className={s} />
      <circle cx="88" cy="90" r="34" className={INK} />
      <path d="M62 90q8-14 16 0t16 0t16 0" fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-teal" />
      <rect x="24" y="166" width="128" height="28" rx="14" className={INK} opacity="0.2" />
      <rect x="168" y="26" width="128" height="128" rx="16" className={s} />
      <rect x="200" y="58" width="64" height="64" rx="20" className={INK} />
      <path d="M214 90q6-10 12 0t12 0t12 0" fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-teal" />
      <rect x="168" y="166" width="128" height="28" rx="14" className={ACCENT} />
      <rect x="196" y="176" width="72" height="8" rx="4" className={INK} />
    </>
  );
}

/* A small browser window with a page outline. */
function Web({ s, e = 0 }) {
  return (
    <>
      <rect x="20" y="16" width="280" height={188 + e} rx="14" className={s} />
      <circle cx="38" cy="33" r="4.5" className={INK} />
      <circle cx="53" cy="33" r="4.5" className={ACCENT} />
      <circle cx="68" cy="33" r="4.5" className={INK} opacity="0.2" />
      <rect x="86" y="26" width="196" height="14" rx="7" className={INK} opacity="0.2" />
      <rect x="36" y="54" width="248" height="62" rx="8" className={INK} />
      <rect x="50" y="68" width="116" height="10" rx="5" className={ACCENT} />
      <rect x="50" y="86" width="76" height="6" rx="3" className="fill-paper" />
      <rect x="50" y="98" width="44" height="10" rx="5" className={ACCENT} />
      {[36, 122, 208].map((x) => (
        <g key={x}>
          <rect x={x} y="128" width="76" height={62 + e} rx="8" className={INK} opacity="0.12" />
          <rect x={x + 10} y="140" width="40" height="8" rx="4" className={INK} />
          <rect x={x + 10} y="156" width="56" height="5" rx="2.5" className={INK} opacity="0.35" />
          <rect x={x + 10} y="166" width="44" height="5" rx="2.5" className={INK} opacity="0.35" />
          {e ? (
            <>
              <rect x={x + 10} y="180" width="56" height="5" rx="2.5" className={INK} opacity="0.35" />
              <rect x={x + 10} y="190" width="36" height="5" rx="2.5" className={INK} opacity="0.35" />
              <rect x={x + 10} y="212" width="40" height="12" rx="6" className={ACCENT} />
              <rect x={x + 10} y="236" width="56" height="5" rx="2.5" className={INK} opacity="0.35" />
              <rect x={x + 10} y="246" width="44" height="5" rx="2.5" className={INK} opacity="0.35" />
            </>
          ) : null}
        </g>
      ))}
    </>
  );
}

/* A canvas of simple shapes above a colour palette strip. */
function Graphic({ s }) {
  const swatches = ["fill-navy", "fill-teal", "fill-navy-raised", "fill-navy-raised-2", "fill-card-tint"];
  return (
    <>
      <rect x="20" y="16" width="280" height="188" rx="14" className={s} />
      <rect x="36" y="30" width="248" height="106" rx="10" className={INK} />
      <circle cx="94" cy="83" r="30" className={ACCENT} />
      <rect x="140" y="52" width="62" height="62" rx="10" className="fill-paper" />
      <path d="M214 118L240 50L266 118Z" className={ACCENT} />
      {swatches.map((c, i) => (
        <rect key={c} x={36 + i * 51} y="150" width="46" height="40" rx="8" className={c} />
      ))}
    </>
  );
}

const drawings = {
  marketing: Marketing,
  content: Content,
  logo: Logo,
  web: Web,
  graphic: Graphic,
};

/* `tall` gives the Web drawing 100 extra units of page, for the tall bento card. */
function ServiceVisual({ service, tone = "light", tall = false, className = "" }) {
  const Drawing = drawings[service];
  const t = tones[tone] || tones.light;
  if (!Drawing) return null;
  const e = tall && service === "web" ? 100 : 0;
  return (
    <svg
      viewBox={`0 0 320 ${220 + e}`}
      aria-hidden="true"
      focusable="false"
      className={`block h-auto w-full ${className}`.trim()}
    >
      <rect width="320" height={220 + e} rx="16" className={t.panel} />
      <Drawing s={t.surface} e={e} />
    </svg>
  );
}

export default memo(ServiceVisual);
