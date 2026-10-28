import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { Button } from "../components/ui";
import CtaBand from "../components/site/CtaBand";
import Reveal from "../components/site/Reveal";
import ServiceVisual from "../components/site/ServiceVisual";

const h2 = "font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]";

/* Heading, description and the one link; `onDark` for navy fields. */
function Text({ id, title, children, onDark = false, className = "" }) {
  return (
    <Reveal className={className}>
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <p className={`mt-6 max-w-[34ch] text-lead ${onDark ? "text-on-navy-muted" : ""}`}>{children}</p>
      <div className="mt-6">
        <Button to="/signup" variant="text" onDark={onDark} arrow className="max-md:-ml-2">
          Request this service
        </Button>
      </div>
    </Reveal>
  );
}

/* A large drawing on a white card (paper fields) or a navy-raised card (navy fields). */
function Visual({ service, dark = false, className = "" }) {
  return (
    <Reveal className={className}>
      <div className={`rounded-card p-4 md:p-6 ${dark ? "bg-navy-raised" : "bg-card"}`}>
        <ServiceVisual service={service} tone={dark ? "dark" : "light"} />
      </div>
    </Reveal>
  );
}

export default function Services() {
  useEffect(() => {
    document.title = "Services · WorkWave";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <section className="bg-paper px-margin pb-[calc(var(--section)*0.6)] pt-14 md:pt-20">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-end">
            <Reveal
              as="h1"
              className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-6"
            >
              Our services
            </Reveal>
            <Reveal as="p" delay={90} className="max-w-[40ch] text-lead md:col-span-5 md:col-start-8">
              All of our services hinge around one promise: brand awareness, traffic and leads, with content,
              marketing and sales working together. Small or large, your business gets strategic insight tailored
              to it and added value on top.
            </Reveal>
          </div>
        </section>

        {/* Marketing: drawing left, text right, on paper */}
        <section aria-labelledby="svc-marketing" className="bg-paper px-margin pb-[calc(var(--section)*0.6)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text
              id="svc-marketing"
              title="Digital Marketing"
              className="md:col-span-5 md:col-start-8 md:row-start-1"
            >
              Want your business to be acclaimed? Broadcast your business to every inch of the globe with our
              digital marketing team.
            </Text>
            <Visual service="marketing" className="md:col-span-6 md:row-start-1" />
          </div>
        </section>

        {/* Content: navy field, text left, drawing right */}
        <section aria-labelledby="svc-content" className="bg-navy px-margin py-[calc(var(--section)*0.6)] text-on-navy [--focus:var(--teal)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text id="svc-content" title="Content Creation" onDark className="md:col-span-5">
              Confused about how to start your write-up? Let our experts glide in and take over with creativity.
            </Text>
            <Visual service="content" dark className="md:col-span-6 md:col-start-7" />
          </div>
        </section>

        {/* Logo: paper, drawing left, text right */}
        <section aria-labelledby="svc-logo" className="bg-paper px-margin py-[calc(var(--section)*0.6)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text id="svc-logo" title="Logo Designing" className="md:col-span-5 md:col-start-8 md:row-start-1">
              Don't have an identity for your idea? Give a face to your ideas with a whole new personalised
              designing experience.
            </Text>
            <Visual service="logo" className="md:col-span-6 md:row-start-1" />
          </div>
        </section>

        {/* Web: navy field, text left, drawing right */}
        <section aria-labelledby="svc-web" className="bg-navy px-margin py-[calc(var(--section)*0.6)] text-on-navy [--focus:var(--teal)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text id="svc-web" title="Web Development" onDark className="md:col-span-5">
              Want a personal space for your business? Create your own website with the extremely skilled coders
              and creators.
            </Text>
            <Visual service="web" dark className="md:col-span-6 md:col-start-7" />
          </div>
        </section>

        {/* Graphics: paper, the drawing large, the text under it */}
        <section aria-labelledby="svc-graphic" className="bg-paper px-margin py-[calc(var(--section)*0.6)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12">
            <Visual service="graphic" className="md:col-span-6 md:col-start-4" />
            <Text id="svc-graphic" title="Graphic Designing" className="md:col-span-6 md:col-start-4">
              Looking for a graphical experience? Let us take over and animate your imagination into a product.
            </Text>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
