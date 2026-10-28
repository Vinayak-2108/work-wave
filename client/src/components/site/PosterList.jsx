import { memo } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

/*
 * Poster list: one service per line in the display face, flush left, with
 * one short fact on the same baseline at the right margin (under the name on
 * phones). Every line links to /services. Hover and focus swap the ink for
 * teal on navy, or for the action navy on paper. The heading is visually
 * hidden; the section takes aria-labelledby.
 * Size: 10.4vw on phones so the longest name ("DIGITAL MARKETING") never
 * breaks or overflows; capped at 136px on wide screens.
 */
const tones = {
  paper: {
    section: "bg-paper text-ink",
    line: "hover:text-action",
    fact: "text-muted",
  },
  navy: {
    section: "bg-navy text-on-navy [--focus:var(--teal)]",
    line: "hover:text-teal",
    fact: "text-on-navy-muted",
  },
};

function PosterList({ items, tone = "paper", headingId = "poster-heading", heading = "Services" }) {
  const t = tones[tone];
  return (
    <section aria-labelledby={headingId} className={`${t.section} px-margin py-section`}>
      <h2 id={headingId} className="sr-only">
        {heading}
      </h2>
      <ul>
        {items.map((item, i) => (
          <Reveal as="li" key={item.name} delay={i * 75}>
            <Link
              to="/services"
              className={`group flex flex-col gap-1.5 py-2 transition-colors duration-fast ease-out active:translate-y-px md:flex-row md:items-baseline md:justify-between md:gap-gutter ${t.line}`}
            >
              <span className="font-display text-[10.4vw] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] md:text-[min(8.6vw,136px)]">
                {item.name}
              </span>
              <span className={`text-body tabular-nums ${t.fact}`}>{item.fact}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export default memo(PosterList);
