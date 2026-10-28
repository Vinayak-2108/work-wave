import React, { useEffect } from "react";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import { Button } from "../components/ui";
import CtaBand from "../components/site/CtaBand";
import Reveal from "../components/site/Reveal";
import { archive, creditsFor } from "../components/site/archive";

const credits = creditsFor("billboard", "presses", "signPainter", "drafting", "lithograph");

const h2 = "font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]";

function Picture({ pic, className = "" }) {
  return (
    <img
      src={pic.src}
      width={pic.width}
      height={pic.height}
      alt={pic.alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

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

export default function Services() {
  useEffect(() => {
    document.title = "Services · WorkWave";
  }, []);

  return (
    <div className="site">
      <SiteHeader />
      <main id="main">
        <section className="bg-paper px-margin pb-section pt-14 md:pt-20">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-end">
            <h1 className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-6">
              Our services
            </h1>
            <p className="max-w-[40ch] text-lead md:col-span-5 md:col-start-8">
              All of our services hinge around one promise: brand awareness, traffic and leads, with content,
              marketing and sales working together. Small or large, your business gets strategic insight tailored
              to it and added value on top.
            </p>
          </div>
        </section>

        {/* Marketing: picture left, text right, on paper */}
        <section aria-labelledby="svc-marketing" className="bg-paper px-margin pb-section">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text
              id="svc-marketing"
              title="Digital Marketing"
              className="md:col-span-5 md:col-start-8 md:row-start-1"
            >
              Want your business to be acclaimed? Broadcast your business to every inch of the globe with our
              digital marketing team.
            </Text>
            <Reveal className="md:col-span-5 md:row-start-1">
              <Picture pic={archive.billboard} className="aspect-[4/5] w-full object-cover object-[35%_50%]" />
            </Reveal>
          </div>
        </section>

        {/* Content: full-bleed picture, text in a navy field below */}
        <Picture pic={archive.presses} className="h-[60svh] w-full object-cover object-[50%_60%]" />
        <section aria-labelledby="svc-content" className="bg-navy px-margin py-section text-on-navy [--focus:var(--teal)]">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-6 md:grid-cols-12 md:items-end">
            <Reveal className="md:col-span-6">
              <h2 id="svc-content" className={h2}>
                Content Creation
              </h2>
            </Reveal>
            <Reveal delay={90} className="md:col-span-5 md:col-start-8">
              <p className="max-w-[34ch] text-lead text-on-navy-muted">
                Confused about how to start your write-up? Let our experts glide in and take over with creativity.
              </p>
              <div className="mt-6">
                <Button to="/signup" variant="text" onDark arrow className="max-md:-ml-2">
                  Request this service
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Logo: text left, picture right, on paper */}
        <section aria-labelledby="svc-logo" className="bg-paper px-margin py-section">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text id="svc-logo" title="Logo Designing" className="md:col-span-5 md:row-start-1">
              Don't have an identity for your idea? Give a face to your ideas with a whole new personalised
              designing experience.
            </Text>
            <Reveal className="md:col-span-5 md:col-start-8 md:row-start-1">
              <Picture pic={archive.signPainter} className="aspect-[4/5] w-full object-cover object-[60%_40%]" />
            </Reveal>
          </div>
        </section>

        {/* Web: navy field, picture running to the right edge */}
        <section
          aria-labelledby="svc-web"
          className="bg-navy py-section pl-margin pr-margin text-on-navy [--focus:var(--teal)] md:pr-0"
        >
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12 md:items-center">
            <Text id="svc-web" title="Web Development" onDark className="md:col-span-5">
              Want a personal space for your business? Create your own website with the extremely skilled coders
              and creators.
            </Text>
            <Reveal className="md:col-span-6 md:col-start-7">
              <Picture pic={archive.drafting} className="aspect-[4/5] w-full object-cover object-[45%_55%]" />
            </Reveal>
          </div>
        </section>

        {/* Graphics: paper, the picture large, the text under it */}
        <section aria-labelledby="svc-graphic" className="bg-paper px-margin py-section">
          <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12">
            <Reveal className="md:col-span-6 md:col-start-4">
              <Picture pic={archive.lithograph} className="aspect-[4/5] w-full object-cover" />
            </Reveal>
            <Text id="svc-graphic" title="Graphic Designing" className="md:col-span-6 md:col-start-4">
              Looking for a graphical experience? Let us take over and animate your imagination into a product.
            </Text>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter credits={credits} />
    </div>
  );
}
