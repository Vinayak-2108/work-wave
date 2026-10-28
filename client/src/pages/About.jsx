import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import AboutStatement from "../components/site/AboutStatement";
import CtaBand from "../components/site/CtaBand";
import Reveal from "../components/site/Reveal";
import ServiceVisual from "../components/site/ServiceVisual";
import aboutus from "../assets/aboutimg.png";
import workspace from "../assets/bg-1600.jpg";

const statement = "text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-[1.2]";

const trades = [
  { key: "web", wide: true },
  { key: "marketing" },
  { key: "content" },
  { key: "logo" },
  { key: "graphic" },
];

export default function About() {
  useEffect(() => {
    document.title = "About · WorkWave";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <section className="bg-paper px-margin pt-14 md:pt-20">
          <div className="grid grid-cols-1 items-end gap-x-gutter gap-y-8 md:grid-cols-12">
            <Reveal
              as="h1"
              className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-7"
            >
              About us
            </Reveal>
            <img
              src={aboutus}
              width={435}
              height={405}
              alt="Three colleagues standing together: one holds a laptop, one a coffee."
              decoding="async"
              className="w-full max-w-[435px] mix-blend-multiply md:col-span-4 md:col-start-9 md:justify-self-end"
            />
          </div>
        </section>

        <AboutStatement headingId="about-story" />

        <section aria-label="The WorkWave workspace" className="bg-paper px-margin pb-[calc(var(--section)*0.6)]">
          <Reveal scale className="overflow-hidden rounded-card">
            <img
              src={workspace}
              width={1600}
              height={900}
              alt="An isometric workspace: a laptop with charts and documents beside a person looking at the screen."
              loading="lazy"
              decoding="async"
              className="w-full"
            />
          </Reveal>
        </section>

        <section aria-labelledby="about-promise" className="bg-navy px-margin py-[calc(var(--section)*0.6)] text-on-navy">
          <div className="grid grid-cols-1 items-center gap-x-gutter gap-y-10 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <h2 id="about-promise" className="sr-only">
                What we promise
              </h2>
              <p className={statement}>Five trades.</p>
              <p className={statement}>One request form.</p>
              <p className={statement}>A person who reads every brief.</p>
            </Reveal>
            <Reveal delay={120} className="md:col-span-5 md:col-start-8">
              <div className="grid grid-cols-2 gap-3 rounded-card bg-navy-raised p-4 md:p-6">
                {trades.map((t) => (
                  <ServiceVisual
                    key={t.key}
                    service={t.key}
                    tone="dark"
                    className={t.wide ? "col-span-2" : ""}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
