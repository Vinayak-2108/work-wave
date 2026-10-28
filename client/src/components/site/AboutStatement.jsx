import { memo } from "react";
import Reveal from "./Reveal";

/*
 * The About copy, set at lead size in two left-aligned columns (one left-aligned
 * column on phones). Four highlights in one colour (teal behind navy text);
 * the final sentence is the contact link, highlighted whole. Copy is sample
 * text to confirm (migration plan A8), cleaned of typos.
 */
const mark = "bg-highlight px-[0.1em] text-ink box-decoration-clone";

function AboutStatement({ headingId, heading = "About WorkWave" }) {
  return (
    <section aria-labelledby={headingId} className="bg-paper px-margin py-section text-ink">
      <h2 id={headingId} className="sr-only">
        {heading}
      </h2>
      <div lang="en" className="text-lead md:columns-2 md:gap-8">
        <Reveal as="p">
          WorkWave is a one roof solution for your technical requirements. We have a methodical team
          which caters to all your needs, from web development to logo designing, and supports you
          throughout with digital marketing and much more.
        </Reveal>
        <Reveal as="p" delay={75} className="mt-4">
          You choose one of our <span className={mark}>five trades</span>, write a short brief and set{" "}
          <span className={mark}>your own budget</span>. <span className={mark}>One person at WorkWave</span>{" "}
          reads every request and either accepts or rejects it, and you follow its status from your
          dashboard. Once a job is accepted you pay through <span className={mark}>PayPal</span> and our
          technical experts get to work, with a personalized experience available nowhere else, within
          the limits of your pocket.
        </Reveal>
        <Reveal as="p" delay={150} className="mt-6 md:mt-4 md:text-left">
          <a
            href="mailto:support@workwave.com"
            className={`${mark} font-semibold transition-colors duration-fast ease-out hover:bg-navy hover:text-teal`}
          >
            Questions about a request? Write to support@workwave.com
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(AboutStatement);
