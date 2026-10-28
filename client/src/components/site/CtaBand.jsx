import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "../ui";

/*
 * The whole band is one link to /signup. Teal field, 46svh on phones and
 * 60svh from md. The word REQUEST spans the width on one line; the sentence
 * sits top-left and an arrow top-right. Hover and focus swap field and word
 * colours. The accessible name is "Request a service" (it contains the
 * visible word).
 */
function CtaBand() {
  return (
    <Link
      to="/signup"
      aria-label="Request a service"
      className="group flex min-h-[46svh] flex-col justify-between bg-teal px-margin pb-4 pt-6 text-on-teal transition-colors duration-fast ease-out hover:bg-navy hover:text-teal focus-visible:[outline-offset:-6px] focus-visible:[outline-color:var(--on-teal)] md:min-h-[60svh] md:pb-6 md:pt-8"
    >
      <span className="flex items-start justify-between gap-gutter">
        <span className="relative z-10 max-w-[24ch] text-lead">Post your first job. It takes a minute.</span>
        <ArrowIcon size={48} className="flex-none -rotate-45 transition-transform duration-fast ease-out group-hover:translate-x-1 group-hover:-translate-y-1 max-md:h-8 max-md:w-8" />
      </span>
      <span
        aria-hidden="true"
        className="block whitespace-nowrap pb-[0.14em] pt-8 font-display text-[min(26vw,520px)] md:text-[min(29.4vw,520px)] font-extrabold uppercase leading-[0.8] tracking-[-0.005em]"
      >
        Request
      </span>
    </Link>
  );
}

export default memo(CtaBand);
