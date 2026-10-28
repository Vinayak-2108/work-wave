import { memo } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import ServiceVisual from "./ServiceVisual";

/*
 * Services bento on paper: five white rounded cards, each a link to
 * its section on /services with a drawing, the service name (h3) and one line. Web
 * Development is the tall card (two rows) and adds sample key/value rows
 * (copy to confirm). Hover lifts the card with --shadow-lift; no resting
 * shadow. Three columns from lg, two from md, one on phones.
 */
const web = [
  ["Pages", "Your own website"],
  ["Built for", "Phones and desktops"],
  ["Request", "From your dashboard"],
];

const cards = [
  {
    key: "marketing",
    name: "Digital Marketing",
    line: "Broadcast your business to every inch of the globe.",
    place: "md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1",
  },
  {
    key: "content",
    name: "Content Creation",
    line: "Our experts glide in and take over your write-up.",
    place: "md:col-start-1 md:row-start-2 lg:col-start-1 lg:row-start-2",
  },
  {
    key: "web",
    name: "Web Development",
    line: "Create your own website with skilled coders and creators.",
    place: "md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-2",
    tall: true,
  },
  {
    key: "logo",
    name: "Logo Designing",
    line: "Give a face to your ideas with a personalised design.",
    place: "md:col-start-1 md:row-start-3 lg:col-start-3 lg:row-start-1",
  },
  {
    key: "graphic",
    name: "Graphic Designing",
    line: "Let us animate your imagination into a product.",
    place: "md:col-start-2 md:row-start-3 lg:col-start-3 lg:row-start-2",
  },
];

function ServiceBento() {
  return (
    <section aria-labelledby="home-services" className="bg-paper px-margin py-[calc(var(--section)*0.6)] text-ink">
      <div className="grid grid-cols-1 gap-x-gutter gap-y-4 md:grid-cols-12 md:items-end">
        <Reveal
          as="h2"
          id="home-services"
          className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-8"
        >
          Five services, one request form
        </Reveal>
        <Reveal as="p" delay={90} className="max-w-[34ch] text-lead md:col-span-4">
          Pick a trade, write a short brief and set your own budget.
        </Reveal>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-gutter md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal as="li" key={c.key} delay={i * 60} className={`flex ${c.place}`}>
            <Link
              to={`/services#svc-${c.key}`}
              className="flex w-full flex-col rounded-card bg-card p-5 transition-[box-shadow,transform] duration-base ease-out hover:shadow-lift focus-visible:shadow-lift motion-safe:hover:-translate-y-0.5 md:p-6"
            >
              {c.tall ? (
                <div className="flex flex-1 items-center rounded-[16px] bg-card-tint">
                  <ServiceVisual service={c.key} tone="light" tall />
                </div>
              ) : (
                <ServiceVisual service={c.key} tone="light" />
              )}
              <h3 className="mt-5 text-lead font-semibold">{c.name}</h3>
              <p className="mt-2 max-w-[34ch] text-body">{c.line}</p>
              {c.tall ? (
                <dl className="mt-6 flex flex-col gap-2 text-body">
                  {web.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 rounded-panel bg-card-tint px-4 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

export default memo(ServiceBento);
