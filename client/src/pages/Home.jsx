import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { Button, StatusPill } from "../components/ui";
import PosterList from "../components/site/PosterList";
import JobSlip from "../components/site/JobSlip";
import CtaBand from "../components/site/CtaBand";
import AboutStatement from "../components/site/AboutStatement";
import TradeStrip from "../components/site/TradeStrip";
import Reveal from "../components/site/Reveal";
import { archive, creditsFor } from "../components/site/archive";
import workspace from "../assets/bg-1600.jpg";

const services = [
  { name: "Digital Marketing", fact: "Campaigns that travel" },
  { name: "Content Creation", fact: "Writers who glide in" },
  { name: "Logo Designing", fact: "A face for ideas" },
  { name: "Web Development", fact: "Your own website" },
  { name: "Graphic Designing", fact: "Ideas, animated" },
];

const sampleRequests = [
  { title: "Logo for a bakery", budget: "250", brief: "Two logo options in navy and cream.", status: "accepted" },
  { title: "Landing page", budget: "600", brief: "One page with a contact form.", status: "pending" },
  { title: "Instagram posts", budget: "120", brief: "Ten posts for the first month.", status: "rejected" },
];

const credits = creditsFor("presses", "billboard", "signPainter", "drafting");

/* A real piece of the product: the client's request list (data-ui). */
function RequestListFragment() {
  return (
    <div data-ui className="app rounded-panel bg-surface text-base text-text">
      <p className="px-5 pt-4 text-base font-semibold">Your requests</p>
      <ul className="mt-2 pb-2">
        {sampleRequests.map((r) => (
          <li key={r.title} className="flex items-start justify-between gap-4 border-t border-rule px-5 py-3">
            <div className="min-w-0">
              <p className="font-semibold">{r.title}</p>
              <p className="truncate text-muted">{r.brief}</p>
            </div>
            <div className="flex flex-none flex-col items-end gap-1">
              <span className="font-semibold tabular-nums">{r.budget}</span>
              <StatusPill status={r.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "WorkWave · Tech work on request";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <section
          id="hero"
          className="flex min-h-[calc(100svh-56px)] flex-col justify-between bg-navy px-margin pb-10 pt-8 md:min-h-[calc(100svh-64px)] md:pb-10 md:pt-10"
        >
          <Reveal
            as="h1"
            className="font-display text-[18.5vw] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] md:text-[min(17vw,260px)]"
          >
            <span className="block text-teal">Tech work,</span>
            <span className="block text-on-navy">on request.</span>
          </Reveal>
          <Reveal
            delay={150}
            className="mt-16 flex max-w-[80%] flex-col items-start gap-6 md:ml-auto md:mt-10 md:w-[40%] md:max-w-none lg:w-[28%] lg:min-w-[260px]"
          >
            <p className="text-lead text-on-navy-muted">
              Post a web, logo, content or marketing job with your budget. WorkWave reviews it, stamps it accepted and
              keeps you posted until you pay.
            </p>
            <Button to="/signup" onDark arrow>
              Request a service
            </Button>
          </Reveal>
        </section>

        <PosterList items={services} headingId="home-services" heading="Our five services" />

        <figure>
          <Reveal scale>
          <img
            src={archive.presses.src}
            width={archive.presses.width}
            height={archive.presses.height}
            alt={archive.presses.alt}
            loading="lazy"
            decoding="async"
            className="h-[56svh] w-full object-cover object-[50%_60%]"
          />
          </Reveal>
          <figcaption className="bg-paper px-margin py-3 text-small text-muted">{archive.presses.caption}</figcaption>
        </figure>

        <section aria-labelledby="home-how" className="bg-navy px-margin py-section text-on-navy [--focus:var(--teal)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-12 md:grid-cols-12 md:grid-rows-[auto_1fr]">
            <Reveal className="md:col-span-6 lg:col-span-5">
              <h2
                id="home-how"
                className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]"
              >
                One slip, one job
              </h2>
              <p className="mt-6 max-w-[30ch] text-lead text-on-navy-muted">
                Each request is one slip: a service, a brief, your budget and a status. A person reads it before
                anything is paid.
              </p>
            </Reveal>
            <Reveal delay={120} className="md:col-span-6 md:col-start-7 md:row-span-2 lg:col-span-5">
              <JobSlip />
            </Reveal>
            <Reveal delay={200} className="max-w-[440px] md:col-span-6 md:max-w-none md:self-start lg:col-span-5">
              <RequestListFragment />
            </Reveal>
          </div>
        </section>

        <AboutStatement headingId="home-about" />

        <TradeStrip keys={["billboard", "signPainter", "drafting"]} label="The trades before software" />

        <section aria-label="The WorkWave workspace" className="bg-paper px-margin pb-section">
          <img
            src={workspace}
            width={1600}
            height={900}
            alt="An isometric workspace: a laptop with charts and documents beside a person looking at the screen."
            loading="lazy"
            decoding="async"
            className="w-full"
          />
        </section>

        <CtaBand />
      </main>
      <SiteFooter credits={credits} />
    </div>
  );
}
