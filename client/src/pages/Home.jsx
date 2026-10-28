import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { Button, CheckIcon } from "../components/ui";
import ProductCards from "../components/site/ProductCards";
import ServiceBento from "../components/site/ServiceBento";
import JobSlip from "../components/site/JobSlip";
import DashboardShowcase from "../components/site/DashboardShowcase";
import Faq from "../components/site/Faq";
import CtaBand from "../components/site/CtaBand";
import Reveal from "../components/site/Reveal";
import { useRequestTarget } from "../utils/useRequestTarget";

const steps = [
  "Choose the service",
  "Write the brief",
  "Set your budget",
  "Pay when it's accepted",
];

export default function Home() {
  const requestTo = useRequestTarget();
  useEffect(() => {
    document.title = "WorkWave · Tech work on request";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <section
          id="hero"
          className="bg-navy px-margin py-12 text-on-navy [--focus:var(--teal)] md:py-16 lg:py-20"
        >
          <div className="grid grid-cols-1 items-center gap-x-gutter gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal
                as="h1"
                className="font-display text-[clamp(56px,7vw,112px)] font-extrabold uppercase leading-[0.92] tracking-[-0.005em]"
              >
                <span className="block text-teal">Tech work,</span>
                <span className="block text-on-navy">on request.</span>
              </Reveal>
              <Reveal as="p" delay={90} className="mt-6 max-w-[34ch] text-lead text-on-navy-muted">
                Post a web, logo, content or marketing job with your own budget. A person reviews it, you track it,
                then you pay.
              </Reveal>
              <Reveal delay={150} className="mt-8 flex flex-wrap items-center gap-3">
                <Button to={requestTo} onDark arrow>
                  Request a service
                </Button>
                <Button to="/services" variant="secondary" onDark>
                  Explore services
                </Button>
              </Reveal>
              <Reveal as="p" delay={210} className="mt-6 text-small text-on-navy-faint">
                Five services · One reviewer per request · Pay with PayPal
              </Reveal>
            </div>
            <Reveal delay={150} className="lg:col-span-5 lg:col-start-8">
              <ProductCards />
            </Reveal>
          </div>
        </section>

        <ServiceBento />

        <section aria-labelledby="home-how" className="bg-navy px-margin py-[calc(var(--section)*0.6)] text-on-navy [--focus:var(--teal)]">
          <div className="grid grid-cols-1 items-start gap-x-gutter gap-y-12 lg:grid-cols-12">
            <div className="self-start lg:sticky lg:top-8 lg:col-span-5">
              <Reveal>
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
              <Reveal as="ol" delay={90} className="mt-8 flex flex-col gap-3">
                {steps.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-body">
                    <CheckIcon size={28} className="flex-none text-teal" />
                    {s}
                  </li>
                ))}
              </Reveal>
              <Reveal delay={150} className="mt-8">
                <Button to={requestTo} onDark arrow>
                  Request a service
                </Button>
              </Reveal>
            </div>
            <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
              <JobSlip />
            </Reveal>
          </div>
        </section>

        <DashboardShowcase />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
