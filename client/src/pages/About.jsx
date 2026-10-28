import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import AboutStatement from "../components/site/AboutStatement";
import CtaBand from "../components/site/CtaBand";
import TradeStrip from "../components/site/TradeStrip";
import Reveal from "../components/site/Reveal";
import { archive, creditsFor } from "../components/site/archive";
import aboutus from "../assets/aboutimg.png";

const credits = creditsFor("signPainter", "billboard", "lithograph", "drafting");

const statement = "text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] leading-[1.2]";

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
            <h1 className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-7">
              About us
            </h1>
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

        <TradeStrip keys={["signPainter", "billboard", "lithograph"]} label="The trades before software" />

        <section aria-labelledby="about-promise" className="bg-navy px-margin py-section text-on-navy">
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
              <img
                src={archive.drafting.src}
                width={archive.drafting.width}
                height={archive.drafting.height}
                alt={archive.drafting.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </Reveal>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter credits={credits} />
    </div>
  );
}
