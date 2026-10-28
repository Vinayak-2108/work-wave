import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import TeamCard from "../components/TeamCard";
import Reveal from "../components/site/Reveal";

export default function Team() {
  useEffect(() => {
    document.title = "Our Team · WorkWave";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
      <div className="bg-paper px-margin pb-section pt-14 text-ink md:pt-20">
        <Reveal as="h1" className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]">Our Team</Reveal>
        <Reveal as="p" delay={90} className="mt-6 max-w-[60ch] text-lead">
          All of our services hinge around our promise of delivering brand
          awareness, traffic and leads by bringing content, marketing and sales
          together. Each of our Business Hubs feed into whichever digital
          marketing service that you require. Our innovative approach ensures
          that your business – whether small or large – receives perfectly
          tailored strategic insight and added value. They are the axis around
          which everything else revolves.
        </Reveal>
      </div>
      <div className="flex flex-wrap w-full justify-center items-center bg-paper px-margin pb-section">
        <TeamCard delay={0} name="John Doe" role="Backend" />
        <TeamCard delay={75} name="John Doe" role="Backend" />
        <TeamCard delay={150} name="John Doe" role="Backend" />
        <TeamCard delay={225} name="John Doe" role="Backend" />
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
