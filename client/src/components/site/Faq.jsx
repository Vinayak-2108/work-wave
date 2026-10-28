import { memo } from "react";
import Reveal from "./Reveal";

/*
 * FAQ: heading left, native <details> items right (two columns from md).
 * Answers only describe what the app really does. The chevron turns when an
 * item is open; the summary is a real keyboard control.
 */
const items = [
  { q: "Who sets the price?", a: "You do, when you post the request." },
  {
    q: "What happens after I post?",
    a: "A WorkWave admin reviews it and marks it accepted or rejected. You see the status on your dashboard.",
  },
  { q: "Can I change a request?", a: "Yes, edit or delete it from your dashboard." },
  { q: "How do I pay?", a: "Accepted requests show a Pay button that opens PayPal." },
  {
    q: "Which services can I request?",
    a: "Digital marketing, content creation, logo design, web development and graphic design.",
  },
];

function Chevron() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="flex-none transition-transform duration-base ease-out motion-reduce:transition-none group-open:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Faq() {
  return (
    <section aria-labelledby="home-faq" className="bg-paper px-margin pb-[calc(var(--section)*0.6)] text-ink">
      <div className="grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-12">
        <Reveal
          as="h2"
          id="home-faq"
          className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em] md:col-span-5"
        >
          Questions
        </Reveal>
        <div className="flex flex-col gap-3 md:col-span-7">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 60}>
              <details className="group rounded-card bg-card">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-6 py-4 text-lead font-semibold transition-colors duration-fast ease-out hover:text-action [&::-webkit-details-marker]:hidden">
                  {it.q}
                  <Chevron />
                </summary>
                <p className="max-w-[56ch] px-6 pb-5 text-body">{it.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Faq);
