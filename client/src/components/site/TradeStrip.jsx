import { memo } from "react";
import { archive } from "./archive";
import Reveal from "./Reveal";

/*
 * Three archival pictures in one row, one crop (4:5) and one treatment, each
 * with a caption that says what it is. They show the history of the trades,
 * never WorkWave's own team or work. Stacks on phones.
 */
function TradeStrip({ keys, label }) {
  return (
    <section aria-label={label} className="bg-paper px-margin pb-section">
      <ul className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-3">
        {keys.map((k, i) => {
          const pic = archive[k];
          return (
            <Reveal as="li" key={k} delay={i * 75}>
              <figure>
                <img
                  src={pic.src}
                  width={pic.width}
                  height={pic.height}
                  alt={pic.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="mt-3 text-small text-muted">{pic.caption}</figcaption>
              </figure>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

export default memo(TradeStrip);
