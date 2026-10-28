import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { Button, Field, Notice } from "../components/ui";
import { SLIP_KEY } from "../components/site/JobSlip";
import { notifyAuthChange } from "../utils/useAuth";
import { auth_user, submit_form } from "../controllers/user";

/*
 * Request a service (design-system 4.7). Auth is checked once on mount, not
 * on every render. A job slip saved by the Home builder in
 * sessionStorage["workwave.slip"] ({service, budget}) prefills the service
 * and budget and is removed as soon as it has been read.
 */
const SERVICES = [
  "Digital Marketing",
  "Content Creation",
  "Logo Designing",
  "Web Development",
  "Graphic Designing",
];
const BUDGET_RE = /^[1-9]\d{0,8}$/;
const NETWORK_ERROR = "We could not reach WorkWave. Check your connection and try again.";

/* Read once, then remove. Returns {service, budget} with only valid parts, or null. */
function takeSlip() {
  let raw = null;
  try {
    raw = window.sessionStorage.getItem(SLIP_KEY);
    if (raw !== null) window.sessionStorage.removeItem(SLIP_KEY);
  } catch (e) {
    return null;
  }
  if (!raw) return null;
  try {
    const slip = JSON.parse(raw);
    const service = SERVICES.includes(slip.service) ? slip.service : "";
    const budget = BUDGET_RE.test(String(slip.budget)) ? String(slip.budget) : "";
    const given = slip.budget === undefined || slip.budget === null ? "" : String(slip.budget);
    const dropped = given !== "" && !budget ? given : "";
    return service || budget || dropped ? { service, budget, dropped } : null;
  } catch (e) {
    return null;
  }
}

export default function RequestService() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [budget, setBudget] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fromSlip, setFromSlip] = useState(null);
  const alive = useRef(true);

  useEffect(() => {
    document.title = "Request a service · WorkWave";
  }, []);

  // Prefill from the slip. State is set here, so a StrictMode re-run that
  // finds the slip already removed does not undo it.
  useEffect(() => {
    const slip = takeSlip();
    if (!slip) return;
    if (slip.service) setTitle(slip.service);
    if (slip.budget) setBudget(slip.budget);
    setFromSlip(slip);
  }, []);

  // One auth check on mount. An invalid token is cleared; RequireAuth then redirects.
  useEffect(() => {
    alive.current = true;
    const token = localStorage.getItem("user_token");
    if (token) {
      auth_user({ token })
        .then((data) => {
          if (alive.current && data && !data.tag) {
            localStorage.removeItem("user_token");
            notifyAuthChange();
          }
        })
        .catch(() => {
          /* offline: the submit below reports it */
        });
    }
    return () => {
      alive.current = false;
    };
  }, []);

  const errors = useMemo(
    () => ({
      title: title ? undefined : "Choose a service.",
      desc: desc.trim() ? undefined : "Describe the job so we can review it.",
      budget: BUDGET_RE.test(budget) ? undefined : "Use whole numbers only, for example 250.",
    }),
    [title, desc, budget]
  );

  const onService = useCallback((e) => setTitle(e.target.value), []);
  const onDesc = useCallback((e) => setDesc(e.target.value), []);
  const onBudget = useCallback((e) => setBudget(e.target.value.trim()), []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched(true);
      if (errors.title || errors.desc || errors.budget) return;
      setBusy(true);
      setError("");
      try {
        const data = await submit_form({
          form_title: title,
          form_desc: desc,
          form_budget: budget,
          token: localStorage.getItem("user_token"),
        });
        if (!alive.current) return;
        if (data && data.tag === false) {
          setError("The request could not be sent. Try again.");
          setBusy(false);
          return;
        }
        navigate("/userdashboard", { state: { notice: "Request sent. It is now pending review." } });
      } catch (err) {
        if (!alive.current) return;
        setError(NETWORK_ERROR);
        setBusy(false);
      }
    },
    [errors, title, desc, budget, navigate]
  );

  const dismissSlip = useCallback(() => setFromSlip(null), []);

  return (
    <AppShell>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-gap p-pad max-sm:p-4">
        <h1 className="text-[24px] font-semibold leading-tight">Request a service</h1>

        <div className="grid gap-gap md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-8">
          <div>
            <h2 className="text-[16px] font-semibold">What happens next</h2>
            <ul className="mt-2 flex flex-col gap-2 text-[14px] text-muted">
              <li>You send the job with your own budget.</li>
              <li>A WorkWave admin reads it and accepts or rejects it.</li>
              <li>Once it is accepted, you pay with PayPal from your Requests list.</li>
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex min-w-0 flex-col gap-4 rounded-panel border border-border p-pad max-sm:p-4"
          >
            {fromSlip ? (
              <Notice kind="info" onDismiss={dismissSlip}>
                {fromSlip.service || fromSlip.budget ? (
                  <>
                    Filled in from your job slip
                    {fromSlip.service ? `: ${fromSlip.service}` : ""}
                    {fromSlip.budget ? `, USD ${fromSlip.budget}` : ""}. Change anything you like.
                  </>
                ) : null}
                {fromSlip.dropped ? (
                  <>
                    {fromSlip.service || fromSlip.budget ? " " : ""}
                    The slip budget ({fromSlip.dropped}) was not used. Enter a whole number
                    that does not start with 0.
                  </>
                ) : null}
              </Notice>
            ) : null}

            <Field
              as="select"
              label="Service"
              name="user_type"
              id="request-service"
              required
              value={title}
              onChange={onService}
              error={touched ? errors.title : undefined}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Field>

            <Field
              as="textarea"
              label="Description"
              name="Description"
              id="request-description"
              required
              placeholder="What do you need, and by when?"
              value={desc}
              onChange={onDesc}
              error={touched ? errors.desc : undefined}
            />

            <Field
              label="Budget (USD)"
              name="budget"
              id="request-budget"
              required
              inputMode="numeric"
              prefix="$"
              hint="Whole numbers in US dollars. You set the price."
              value={budget}
              onChange={onBudget}
              error={touched ? errors.budget : undefined}
            />

            {error ? <Notice kind="error">{error}</Notice> : null}

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" to="/userdashboard">
                Back to dashboard
              </Button>
              <Button type="submit" loading={busy}>
                Send request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
