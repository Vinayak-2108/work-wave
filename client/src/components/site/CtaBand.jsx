import { memo } from "react";
import { Button } from "../ui";
import Reveal from "./Reveal";

/*
 * Closing call to action: a teal rounded panel inside the page margins, on
 * the paper ground. The heading and sentence are text; only the navy pill
 * button links to /signup. The focus ring is navy, because teal is invisible
 * on teal.
 */
function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-paper px-margin pb-12 pt-12 text-on-teal md:pb-16 md:pt-16"
    >
      <Reveal className="grid grid-cols-1 items-end gap-x-gutter gap-y-8 rounded-card bg-teal p-8 [--focus:var(--on-teal)] md:grid-cols-12 md:p-14">
        <h2
          id="cta-heading"
          className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-7"
        >
          Post your first job
        </h2>
        <div className="flex flex-col items-start gap-6 md:col-span-5">
          <p className="max-w-[28ch] text-lead">It takes a minute. A person reads every brief.</p>
          <Button to="/signup" arrow>
            Request a service
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

export default memo(CtaBand);
