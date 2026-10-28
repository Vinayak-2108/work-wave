import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppShell from "../components/layout/AppShell";
import {
  Button,
  CountFilter,
  EmptyState,
  Notice,
  SkeletonRow,
  StatusPill,
} from "../components/ui";
import { notifyAuthChange } from "../utils/useAuth";
import {
  auth_admin,
  get_forms,
  get_admin_det_by_id,
  action_by_admin,
} from "../controllers/admin";

/*
 * Admin queue (design-system 4.8): a list column with a count filter and an
 * open-item panel. Accept and Deny keep name={_id} and value "accept"/"deny"
 * on the <button> itself. After an action the request's status is updated in
 * state, so pills and counts change in place with no page reload.
 * Below 1024px the list and the detail take turns (Back returns to the list
 * at the same scroll position).
 */
const NETWORK_ERROR = "We could not reach WorkWave. Check your connection and try again.";
const OUTCOME = { accept: "Accepted", deny: "Rejected" };

const statusOf = (form) => (form.status ? form.status : "Pending");

/* Reads the admin id out of the JWT payload (base64url), or null. */
function adminIdFromToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)).id || null;
  } catch (e) {
    return null;
  }
}

const isSmall = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 1023.98px)").matches;

const rowClass = "motion-row border-b border-rule last:border-b-0"; // taste-skill-ignore: list row divider

function Row({ form, selected, onSelect }) {
  return (
    <li className={rowClass}>
      <button
        type="button"
        id={`queue-row-${form._id}`}
        aria-current={selected ? "true" : undefined}
        onClick={() => onSelect(form._id)}
        className={
          "flex w-full min-w-0 flex-col gap-1 border-l-2 px-4 py-3 text-left text-[14px] " +
          "transition-colors duration-fast ease-out active:translate-y-px " +
          (selected ? "border-accent bg-active" : "border-transparent hover:bg-raised")
        }
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 truncate font-semibold">
            {form.form_user_name || "Unnamed client"}
          </span>
          <span className="flex-none font-semibold tabular-nums">USD {form.form_budget}</span>
        </span>
        <span className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-muted">{form.form_title}</span>
          <StatusPill status={statusOf(form)} />
        </span>
      </button>
    </li>
  );
}
const QueueRow = memo(Row);

function Detail({ form, busy, result, onAction, onBack, headingRef }) {
  const status = statusOf(form).toLowerCase();
  // busy is keyed by request id, so another request's in-flight decision never locks this one.
  const acting = busy[form._id] || null;
  const other = (a) => Boolean(acting) && acting !== a;
  return (
    <article className="flex flex-col gap-4 p-pad max-sm:p-4" aria-labelledby="queue-detail-title">
      <Button variant="text" onClick={onBack} className="-ml-4 self-start lg:hidden">
        Back to queue
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h2
          id="queue-detail-title"
          ref={headingRef}
          tabIndex={-1}
          className="min-w-0 break-words text-[16px] font-semibold"
        >
          {form.form_title}
        </h2>
        <StatusPill status={statusOf(form)} />
      </div>

      <div>
        <p className="text-[12px] font-medium text-muted">Brief</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-[14px]">{form.form_desc}</p>
      </div>

      <dl className="grid gap-4 text-[14px] sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-[12px] font-medium text-muted">Budget</dt>
          <dd className="mt-1 font-semibold tabular-nums">USD {form.form_budget}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[12px] font-medium text-muted">Client name</dt>
          <dd className="mt-1 break-words">{form.form_user_name || "Not given"}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[12px] font-medium text-muted">Client contact</dt>
          <dd className="mt-1 break-words">{form.form_user_contact || "Not given"}</dd>
        </div>
      </dl>

      {result[form._id] ? (
        <Notice kind={result[form._id].kind}>{result[form._id].text}</Notice>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          name={form._id}
          value="accept"
          onClick={onAction}
          loading={acting === "accept"}
          disabled={status === "accepted" || other("accept")}
          disabledReason={status === "accepted" ? "Already accepted." : "Saving the decision."}
        >
          Accept
        </Button>
        <Button
          variant="secondary"
          name={form._id}
          value="deny"
          onClick={onAction}
          loading={acting === "deny"}
          disabled={status === "rejected" || other("deny")}
          disabledReason={status === "rejected" ? "Already rejected." : "Saving the decision."}
          className="!text-negative hover:!text-on-navy"
        >
          Deny
        </Button>
      </div>
    </article>
  );
}

export default function DashboardAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [forms, setForms] = useState([]);
  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [filter, setFilter] = useState("pending");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState({}); // { [_id]: action }
  const [result, setResult] = useState({}); // { [_id]: { kind, text } }
  const filterRef = useRef(null);
  const visibleRef = useRef([]);
  const run = useRef(0);
  const scrollY = useRef(0);
  const lastSelected = useRef(null);
  const headingRef = useRef(null);
  const alive = useRef(true);

  useEffect(() => {
    document.title = "Queue · WorkWave";
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    const mine = ++run.current;
    const live = () => mine === run.current;
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    setPhase("loading");
    try {
      const auth = await auth_admin({ token });
      if (!live()) return;
      if (!auth || !auth.tag) {
        // Invalid or expired token: clear it; RequireAuth sends the visitor to /signup.
        localStorage.removeItem("admin_token");
        notifyAuthChange();
        return;
      }
      const obj = { id: adminIdFromToken(token) };
      const [details, list] = await Promise.all([get_admin_det_by_id(obj), get_forms(obj)]);
      if (!live()) return;
      if (details && details.message) {
        setName(details.message.admin_name || "");
        setEmail(details.message.admin_email || "");
      }
      if (!Array.isArray(list)) {
        setPhase("error");
        return;
      }
      setForms(list);
      setPhase("ready");
    } catch (err) {
      if (live()) setPhase("error");
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      run.current += 1; // drop any response that lands after unmount
    };
  }, [load]);

  const counts = useMemo(() => {
    const c = { all: forms.length, pending: 0, accepted: 0, rejected: 0 };
    forms.forEach((f) => {
      const k = statusOf(f).toLowerCase();
      if (k in c) c[k] += 1;
    });
    return c;
  }, [forms]);

  const filterItems = useMemo(
    () => [
      { key: "all", label: "All", count: counts.all },
      { key: "pending", label: "Pending", count: counts.pending },
      { key: "accepted", label: "Accepted", count: counts.accepted },
      { key: "rejected", label: "Rejected", count: counts.rejected },
    ],
    [counts]
  );

  const visible = useMemo(
    () =>
      filter === "all" ? forms : forms.filter((f) => statusOf(f).toLowerCase() === filter),
    [forms, filter]
  );

  // The open item comes from `forms`, not `visible`, so it stays open after its
  // status moves it out of the current filter.
  const selected = useMemo(
    () => forms.find((f) => f._id === selectedId) || null,
    [forms, selectedId]
  );

  visibleRef.current = visible;

  const onSelect = useCallback((id) => {
    scrollY.current = window.scrollY;
    setSelectedId(id);
  }, []);
  const onBack = useCallback(() => setSelectedId(null), []);

  // Small screens: list and detail take turns. Move focus and scroll with them.
  useEffect(() => {
    if (!isSmall()) return;
    if (selectedId) {
      lastSelected.current = selectedId;
      window.scrollTo(0, 0);
      headingRef.current?.focus({ preventScroll: true });
    } else if (lastSelected.current) {
      const row = document.getElementById(`queue-row-${lastSelected.current}`);
      if (row) {
        window.scrollTo(0, scrollY.current);
        row.focus({ preventScroll: true });
      } else {
        // The decision moved it out of the current filter: land on the first row, else the filter.
        window.scrollTo(0, 0);
        const first = visibleRef.current[0];
        const next =
          (first && document.getElementById(`queue-row-${first._id}`)) ||
          (filterRef.current && filterRef.current.querySelector("button"));
        next?.focus({ preventScroll: true });
      }
    }
  }, [selectedId]);

  const onFilter = useCallback((key) => {
    setFilter(key);
    setResult({});
  }, []);

  const handleAction = useCallback(
    async (e) => {
      e.preventDefault();
      // currentTarget: the <button> itself carries name and value, not its label span.
      const formid = e.currentTarget.name;
      const newAction = e.currentTarget.value;
      setBusy((prev) => ({ ...prev, [formid]: newAction }));
      setResult((prev) => {
        const { [formid]: dropped, ...rest } = prev;
        return rest;
      });
      const say = (kind, text) =>
        setResult((prev) => ({ ...prev, [formid]: { kind, text } }));
      try {
        const data = await action_by_admin({ id: formid, action: newAction });
        if (!alive.current) return;
        // Success only when the server says tag: true (failures answer 500 {message} or {}).
        if (!(data && data.tag === true)) {
          say("error", "The decision could not be saved. Try again.");
        } else {
          const status =
            data && data.message && typeof data.message === "object" && data.message.status
              ? data.message.status
              : OUTCOME[newAction];
          setForms((prev) =>
            prev.map((f) => (f._id === formid ? { ...f, status, action: newAction } : f))
          );
          say("success", status === "Accepted" ? "Request accepted." : "Request rejected.");
        }
      } catch (err) {
        if (alive.current) say("error", NETWORK_ERROR);
      }
      if (alive.current) {
        setBusy((prev) => {
          const { [formid]: done, ...rest } = prev;
          return rest;
        });
      }
    },
    []
  );

  return (
    <AppShell accountName={name}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-gap p-pad max-sm:p-4">
        <div>
          <h1 className="text-[24px] font-semibold leading-tight">Queue</h1>
          {name || email ? (
            <p className="mt-1 break-words text-[14px] text-muted">
              Signed in as {name}
              {name && email ? ", " : ""}
              {email}
            </p>
          ) : null}
        </div>

        {/* Below 1024px the filter would be a dead control while the detail is open. */}
        <div ref={filterRef} className={selected ? "max-lg:hidden" : ""}>
          <CountFilter items={filterItems} value={filter} onChange={onFilter} />
        </div>

        {phase === "error" ? (
          <Notice kind="error" onRetry={load}>
            The queue could not be loaded.
          </Notice>
        ) : (
          <div className="grid gap-gap lg:grid-cols-[384px_minmax(0,1fr)]">
            <section
              aria-label="Requests"
              className={
                "min-w-0 rounded-panel border border-border " + (selected ? "max-lg:hidden" : "")
              }
            >
              {phase === "loading" ? (
                <SkeletonRow count={4} />
              ) : forms.length === 0 ? (
                <EmptyState>No requests have come in yet.</EmptyState>
              ) : visible.length === 0 ? (
                <EmptyState>No {filter} requests.</EmptyState>
              ) : (
                <ul>
                  {visible.map((f) => (
                    <QueueRow
                      key={f._id}
                      form={f}
                      selected={f._id === selectedId}
                      onSelect={onSelect}
                    />
                  ))}
                </ul>
              )}
            </section>

            <section
              aria-label="Open request"
              className={
                "min-w-0 rounded-panel border border-border " + (selected ? "" : "max-lg:hidden")
              }
            >
              {selected ? (
                <Detail
                  form={selected}
                  busy={busy}
                  result={result}
                  onAction={handleAction}
                  onBack={onBack}
                  headingRef={headingRef}
                />
              ) : (
                <EmptyState>Select a request to read the brief and decide.</EmptyState>
              )}
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}
