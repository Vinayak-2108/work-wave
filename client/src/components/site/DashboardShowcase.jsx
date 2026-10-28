import { memo } from "react";
import { StatusPill } from "../ui";
import Reveal from "./Reveal";

/*
 * Dashboard showcase: a static copy of the client dashboard (data-ui) on a
 * wide white panel. Counts are computed from the sample rows. Real text, with
 * a visually hidden caption. Nothing in it is interactive.
 */
const rows = [
  { title: "Logo for a bakery", budget: "250", brief: "Two logo options in navy and cream.", status: "accepted" },
  { title: "Landing page", budget: "600", brief: "One page with a contact form.", status: "pending" },
  { title: "Instagram posts", budget: "120", brief: "Ten posts for the first month.", status: "rejected" },
];

const count = (status) => rows.filter((r) => r.status === status).length;
const counts = [
  { label: "All", n: rows.length },
  { label: "Pending", n: count("pending") },
  { label: "Accepted", n: count("accepted") },
  { label: "Rejected", n: count("rejected") },
];

function DashboardShowcase() {
  return (
    <section aria-labelledby="home-track" className="bg-paper px-margin py-[calc(var(--section)*0.6)] text-ink">
      <div className="mx-auto text-center">
        <Reveal
          as="h2"
          id="home-track"
          className="font-display text-head font-extrabold uppercase leading-[0.95] tracking-[-0.005em]"
        >
          Track every request
        </Reveal>
        <Reveal as="p" delay={90} className="mx-auto mt-4 max-w-[40ch] text-lead">
          See what is pending, accepted or rejected, and pay when a job is accepted.
        </Reveal>
      </div>

      <Reveal delay={150} className="mt-10 rounded-card bg-card p-4 md:mt-14 md:p-8">
        <div data-ui className="app bg-card text-base text-text">
          <p className="sr-only">Example of the client dashboard</p>
          <p className="text-lg font-semibold">Requests</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {counts.map((c, i) => (
              <li key={c.label} className={`rounded-panel px-4 py-3 ${i === 0 ? "bg-active" : "bg-raised"}`}>
                <p className="text-muted">{c.label}</p>
                <p className="text-lg font-semibold tabular-nums">{c.n}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-col gap-2">
            {rows.map((r) => (
              <li key={r.title} className="flex items-start justify-between gap-4 rounded-panel bg-raised px-5 py-4">
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
      </Reveal>
    </section>
  );
}

export default memo(DashboardShowcase);
