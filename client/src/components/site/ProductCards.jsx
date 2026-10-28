import { memo } from "react";

/*
 * Hero mockup: three overlapping cards that show a request's life (post,
 * review, pay) in WorkWave's own words. Static and non-interactive. Cards
 * sit on the navy field in navy-raised; a card stacked on another uses
 * navy-raised-2. The overlap and the 1 degree turn apply from md; phones
 * stack the cards flat.
 */
const card = "rounded-card p-5 md:p-6";
const label = "text-small text-on-navy-faint";

function Chip({ tone = "quiet", children }) {
  const tones = {
    quiet: "bg-navy-raised-2 text-on-navy",
    done: "bg-teal text-on-teal",
  };
  return (
    <span
      className={`inline-flex h-7 flex-none items-center whitespace-nowrap rounded-pill px-3 text-small font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function ProductCards() {
  return (
    <div data-ui className="mx-auto flex w-full max-w-[520px] flex-col gap-4 text-on-navy md:gap-0">
      <div className={`${card} bg-navy-raised md:w-[90%] md:pb-12`}>
        <p className={label}>New request</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="text-lead font-semibold">Logo for a bakery</p>
          <Chip>Pending</Chip>
        </div>
        <p className="mt-3 flex items-baseline justify-between gap-4 text-body">
          <span className="text-on-navy-muted">Budget</span>
          <span className="font-semibold tabular-nums">250</span>
        </p>
      </div>

      <div className={`${card} relative bg-navy-raised-2 md:-mt-8 md:ml-auto md:w-[90%] md:rotate-1 md:pb-12`}>
        <p className={label}>Reviewed</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="text-body">Accepted by the WorkWave team</p>
          <Chip tone="done">Accepted</Chip>
        </div>
      </div>

      <div className={`${card} relative bg-navy-raised md:-mt-8 md:w-[90%]`}>
        <p className={label}>Payment</p>
        <p className="mt-2 text-lead font-semibold tabular-nums">Amount to be paid: 250</p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-panel bg-navy-raised-2 px-4 py-3 text-body">
          <span className="font-semibold">PayPal</span>
          <span className="text-small text-on-navy-muted">Pay button on your dashboard</span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCards);
