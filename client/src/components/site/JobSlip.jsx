import { memo, useCallback, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Field } from "../ui";
import { useRequestTarget } from "../../utils/useRequestTarget";
import "./site.css";

/*
 * The job slip: a paper slip with a zigzag bottom edge, built as a small
 * request builder. Pick one of the five services, type a budget, and the
 * slip fills in. "Send this request" saves {service, budget} under
 * sessionStorage key "workwave.slip" (read by Request a service in Phase 6)
 * and goes to /requestservice when a client is signed in, else /signup.
 * The slip has one face only, so its height never changes.
 * The stage sits in a rounded-card frame on navy-raised (landing redesign).
 * State stays in this component: no page reloads, no network.
 */
export const SLIP_KEY = "workwave.slip";

const SERVICES = [
  "Digital Marketing",
  "Content Creation",
  "Logo Designing",
  "Web Development",
  "Graphic Designing",
];

const TEETH = 22;
/* Zigzag edge, built right to left so the polygon stays one closed path. */
const clip = (() => {
  const pts = ["0 0", "100% 0"];
  for (let i = TEETH; i > 0; i -= 1) {
    pts.push(`${((i * 100) / TEETH).toFixed(3)}% calc(100% - 10px)`);
    pts.push(`${(((i - 0.5) * 100) / TEETH).toFixed(3)}% 100%`);
  }
  pts.push("0 calc(100% - 10px)");
  return `polygon(${pts.join(", ")})`;
})();

function Row({ label, value, tone = "ink" }) {
  return (
    <li className="flex items-baseline gap-2">
      <span>{label}</span>
      <span aria-hidden="true" className="mb-[0.3em] min-w-3 flex-1 self-end border-b-4 border-dotted border-muted" />
      <span className={`text-right font-semibold tabular-nums ${tone === "muted" ? "text-muted" : ""}`}>{value}</span>
    </li>
  );
}

function Group({ title, children }) {
  return (
    <section className="mt-6">
      <h3 className="text-body font-semibold">{title}</h3>
      <ul className="mt-2 flex flex-col gap-1.5 text-body">{children}</ul>
    </section>
  );
}

function ResultBar({ label, value }) {
  return (
    <p className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-navy px-4 py-3 text-body text-on-navy">
      <span className="whitespace-nowrap">{label}</span>
      <span className="stamp font-semibold">{value}</span>
    </p>
  );
}

function JobSlip() {
  const [service, setService] = useState("Web Development");
  const [budget, setBudget] = useState("");
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const target = useRequestTarget();
  const groupId = useId();

  const valid = useMemo(() => /^[1-9]\d{0,8}$/.test(budget), [budget]);
  const error =
    touched && budget !== "" && !valid
      ? "Use whole numbers only, for example 250."
      : undefined;
  const shown = valid ? budget : "not set";

  const onBudget = useCallback((e) => {
    setTouched(true);
    setBudget(e.target.value.trim());
  }, []);
  const onService = useCallback((e) => setService(e.target.value), []);

  const send = useCallback(() => {
    if (!valid) return;
    try {
      window.sessionStorage.setItem(SLIP_KEY, JSON.stringify({ service, budget }));
    } catch (e) {
      /* storage unavailable: the form simply opens empty */
    }
    navigate(target);
  }, [valid, service, budget, target, navigate]);

  return (
    <div className="rounded-card bg-navy-raised p-4 md:p-8">
    <div className="slip-stage mx-auto w-full max-w-[440px] text-ink" style={{ clipPath: clip }}>
      <div className="slip-front bg-paper px-6 pb-12 pt-6">
        <p className="text-lead font-semibold">Job slip</p>

        <fieldset className="mt-5">
          <legend className="text-body font-semibold">Choose the service</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SERVICES.map((s, i) => {
              const id = `${groupId}-${i}`;
              return (
                <span key={s} className="relative">
                  <input
                    id={id}
                    type="radio"
                    name="slip_service"
                    value={s}
                    checked={service === s}
                    onChange={onService}
                    className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <label
                    htmlFor={id}
                    className="pointer-events-none inline-flex h-11 cursor-pointer items-center rounded-pill bg-surface px-4 text-body font-semibold text-ink transition-[background-color,color,transform] duration-fast ease-out peer-checked:bg-navy peer-checked:text-on-navy peer-hover:bg-card-tint peer-checked:peer-hover:bg-action peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action peer-active:translate-y-px"
                  >
                    {s}
                  </label>
                </span>
              );
            })}
          </div>
        </fieldset>

        <Field
          className="mt-5"
          label="Your budget"
          id="slip-budget"
          name="slip_budget"
          inputMode="numeric"
          autoComplete="off"
          value={budget}
          onChange={onBudget}
          error={error}
          hint="You set the price. A person reviews it."
        />

        <Group title="You">
          <Row label="Choose the service" value={service} />
          <Row label="Write the brief" value="next page" tone="muted" />
          <Row label="Set your budget" value={shown} />
        </Group>
        <Group title="WorkWave">
          <Row label="Review" value="Pending" />
          <Row label="Decision" value="Accepted or Rejected" />
        </Group>
        <Group title="Together">
          <Row label="Pay" value="PayPal" />
        </Group>
        <ResultBar label="You hold" value="an accepted job and its receipt" />

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
          <Button
            onClick={send}
            arrow
            disabled={!valid}
            disabledReason="Enter a budget to send."
          >
            Send this request
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default memo(JobSlip);
