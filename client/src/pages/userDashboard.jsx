import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import {
  Button,
  CountFilter,
  Dialog,
  EmptyState,
  Field,
  Notice,
  SkeletonRow,
  StatusPill,
} from "../components/ui";
import { notifyAuthChange } from "../utils/useAuth";
import {
  auth_user,
  get_forms,
  get_user_det_by_id,
  delete_form,
  get_forms_by_formid,
  edit_form,
} from "../controllers/user";

/*
 * Client dashboard (design-system 4.6). Everything updates from state: edit,
 * delete and load never reload the page. One Dialog at a time (edit, delete
 * or pay) is open for the selected request.
 */

// Created once so the PayPal provider does not see new options every render.
const PAYPAL_OPTIONS = { "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID };

const NETWORK_ERROR = "We could not reach WorkWave. Check your connection and try again.";
const BUDGET_RE = /^[1-9]\d{0,8}$/;

/* Reads the user id out of the JWT payload (base64url), or null. */
function userIdFromToken(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)).id || null;
  } catch (e) {
    return null;
  }
}

const statusOf = (form) => (form.status ? form.status : "Pending");

const rowClass =
  "motion-row flex flex-col gap-2 border-b border-rule px-pad py-4 transition-colors duration-fast ease-out last:border-b-0 hover:bg-raised"; // taste-skill-ignore: list row divider

function Row({ form, onEdit, onDelete, onPay }) {
  const status = statusOf(form);
  return (
    <li className={rowClass}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="min-w-0 truncate text-[14px] font-semibold">{form.form_title}</p>
        <p className="flex-none text-[14px] font-semibold tabular-nums">USD {form.form_budget}</p>
      </div>
      <div className="flex items-start justify-between gap-4">
        <p
          className="min-w-0 break-words text-[14px] text-muted overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
          title={form.form_desc}
        >
          {form.form_desc}
        </p>
        <StatusPill status={status} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="-ml-4 flex items-center">
          <Button
            variant="text"
            id={`edit-btn-${form._id}`}
            onClick={() => onEdit(form)}
            aria-label={`Edit ${form.form_title}`}
          >
            Edit
          </Button>
          <Button
            variant="text"
            onClick={() => onDelete(form)}
            aria-label={`Delete ${form.form_title}`}
            className="!text-negative"
          >
            Delete
          </Button>
        </div>
        {status.toLowerCase() === "accepted" ? (
          <Button
            variant="secondary"
            onClick={() => onPay(form)}
            aria-label={`Pay for ${form.form_title}`}
          >
            Pay
          </Button>
        ) : null}
      </div>
    </li>
  );
}
const RequestRow = memo(Row);

/* Edit: fields prefilled once, when the dialog mounts. Payload shape is unchanged. */
function EditPanel({ form, onSaved, onClose }) {
  const [title, setTitle] = useState(form.form_title || "");
  const [desc, setDesc] = useState(form.form_desc || "");
  const [budget, setBudget] = useState(String(form.form_budget ?? ""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const budgetError =
    touched && !BUDGET_RE.test(budget) ? "Use whole numbers only, for example 250." : undefined;

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched(true);
      const cleanTitle = title.trim();
      const cleanDesc = desc.trim();
      if (!BUDGET_RE.test(budget) || !cleanTitle || !cleanDesc) return;
      setBusy(true);
      setError("");
      try {
        const data = await edit_form({
          formid: { _id: form._id },
          form_title: cleanTitle,
          form_desc: cleanDesc,
          form_budget: budget,
        });
        // Success only when the server says tag: true (failures answer 500 {message} or {}).
        if (!(data && data.tag === true)) {
          setError("The request could not be saved. Try again.");
          setBusy(false);
          return;
        }
        const saved = data && typeof data.message === "object" ? data.message : null;
        onSaved({
          ...form,
          ...(saved || {}),
          form_title: cleanTitle,
          form_desc: cleanDesc,
          form_budget: budget,
        });
      } catch (err) {
        setError(NETWORK_ERROR);
        setBusy(false);
      }
    },
    [budget, desc, form, onSaved, title]
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field
        label="Title"
        name="txt"
        id="edit-txt"
        required
        data-autofocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={touched && !title.trim() ? "Add a title." : undefined}
      />
      <Field
        as="textarea"
        label="Description"
        name="Description"
        id="edit-description"
        required
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        error={touched && !desc.trim() ? "Describe the job." : undefined}
      />
      <Field
        label="Budget (USD)"
        name="budget"
        id="edit-budget"
        required
        inputMode="numeric"
        prefix="$"
        value={budget}
        onChange={(e) => setBudget(e.target.value.trim())}
        error={budgetError}
      />
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={busy}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

/* Delete confirmation: names the request, shows a loading state. */
function DeletePanel({ form, onDeleted, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const data = await delete_form({ _id: form._id });
      // The server answers 200 with "... will be deleted" and 400 with the failure text.
      if (data && typeof data.message === "string" && /will be deleted/i.test(data.message)) {
        onDeleted(form._id);
        return;
      }
      setError("The request could not be deleted. Try again.");
    } catch (err) {
      setError(NETWORK_ERROR);
    }
    setBusy(false);
  }, [form._id, onDeleted]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px]">
        This permanently removes <strong className="font-semibold">{form.form_title}</strong>. It cannot
        be undone.
      </p>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onClose} data-autofocus>
          Keep request
        </Button>
        <Button
          onClick={confirm}
          loading={busy}
          className="!bg-negative !text-surface hover:brightness-90"
        >
          Delete request
        </Button>
      </div>
    </div>
  );
}

/* Pay: amount from get_forms_by_formid; PayPal buttons mount only after Checkout. */
function PayPanel({ form, onClose }) {
  const [amount, setAmount] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [show, setShow] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState("");
  const amountRef = useRef(null);
  const attempt = useRef(0);
  const [{ isRejected }] = usePayPalScriptReducer();

  const fetchAmount = useCallback(() => {
    const mine = ++attempt.current;
    const live = () => mine === attempt.current;
    setState("loading");
    get_forms_by_formid({ id: form._id })
      .then((data) => {
        if (!live()) return;
        const budget = data && data.message && data.message[0] && data.message[0].form_budget;
        if (!budget) {
          setState("error");
          return;
        }
        amountRef.current = budget;
        setAmount(budget);
        setState("ready");
      })
      .catch(() => live() && setState("error"));
  }, [form._id]);

  // Retries share the counter, so unmounting cancels a retry in flight too.
  useEffect(() => {
    fetchAmount();
    return () => {
      attempt.current += 1;
    };
  }, [fetchAmount]);

  // Reads the ref so the PayPal button never holds a stale amount.
  const createOrder = useCallback(
    (data, actions) =>
      actions.order
        .create({
          purchase_units: [
            { amount: { currency_code: "USD", value: amountRef.current } },
          ],
        })
        .then((orderID) => orderID),
    []
  );
  const onApprove = useCallback(
    (data, actions) => actions.order.capture().then(() => setPaid(true)),
    []
  );
  const onError = useCallback(() => setPayError("An error occurred with your payment."), []);
  const checkout = useCallback(() => setShow(true), []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] text-muted">{form.form_title}</p>
      {state === "error" ? (
        <Notice kind="error" onRetry={fetchAmount}>
          The amount could not be loaded.
        </Notice>
      ) : (
        <p className="text-[24px] font-semibold tabular-nums">
          Amount to be paid: {amount ? `USD ${amount}` : "..."}
        </p>
      )}
      {paid ? <Notice kind="success">Payment received. Thank you.</Notice> : null}
      {payError ? <Notice kind="error">{payError}</Notice> : null}
      {show && isRejected ? (
        <Notice kind="error">PayPal could not be loaded. Try again later.</Notice>
      ) : null}
      {show && !paid ? (
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      ) : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={onClose} data-autofocus>
          Back
        </Button>
        {!show ? (
          <Button
            onClick={checkout}
            disabled={state !== "ready"}
            disabledReason={state === "loading" ? "Loading the amount." : "Amount unavailable."}
          >
            Checkout
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [forms, setForms] = useState([]);
  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState(null); // { kind, text }
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [paying, setPaying] = useState(null);
  const run = useRef(0);
  const listRef = useRef(null);
  const visibleRef = useRef([]);
  const focusAfter = useRef(null);
  const [focusTick, setFocusTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Requests · WorkWave";
  }, []);

  // A notice handed over by Request a service; shown once, then cleared from history.
  useEffect(() => {
    const text = location.state && location.state.notice;
    if (text) {
      setNotice({ kind: "success", text });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const load = useCallback(async () => {
    const mine = ++run.current;
    const live = () => mine === run.current;
    const token = localStorage.getItem("user_token");
    if (!token) return;
    setPhase("loading");
    try {
      const auth = await auth_user({ token });
      if (!live()) return;
      if (!auth || !auth.tag) {
        // Invalid or expired token: clear it; RequireAuth sends the visitor to /signup.
        localStorage.removeItem("user_token");
        notifyAuthChange();
        return;
      }
      const obj = { id: userIdFromToken(token) };
      const [details, list] = await Promise.all([get_user_det_by_id(obj), get_forms(obj)]);
      if (!live()) return;
      if (details && details.message) {
        setName(details.message.user_name || "");
        setEmail(details.message.user_email || "");
      }
      if (!list || !Array.isArray(list.message)) {
        setPhase("error");
        return;
      }
      setForms(list.message);
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

  visibleRef.current = visible;

  // After a delete, focus goes to the next row's Edit button, else the previous, else the list.
  useEffect(() => {
    if (!focusTick) return;
    const id = focusAfter.current;
    const target = (id && document.getElementById(`edit-btn-${id}`)) || listRef.current;
    if (target) target.focus();
  }, [focusTick]);

  const onEdit = useCallback((f) => setEditing(f), []);
  const onDelete = useCallback((f) => setDeleting(f), []);
  const onPay = useCallback((f) => setPaying(f), []);
  const closeEdit = useCallback(() => setEditing(null), []);
  const closeDelete = useCallback(() => setDeleting(null), []);
  const closePay = useCallback(() => setPaying(null), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const onSaved = useCallback((saved) => {
    focusAfter.current = saved._id;
    setFocusTick((t) => t + 1);
    setForms((prev) => prev.map((f) => (f._id === saved._id ? saved : f)));
    setEditing(null);
    setNotice({ kind: "success", text: "Request updated." });
  }, []);
  const onDeleted = useCallback((id) => {
    const list = visibleRef.current;
    const at = list.findIndex((f) => f._id === id);
    const neighbour = at === -1 ? null : list[at + 1] || list[at - 1] || null;
    focusAfter.current = neighbour ? neighbour._id : null;
    setFocusTick((t) => t + 1);
    setForms((prev) => prev.filter((f) => f._id !== id));
    setDeleting(null);
    setNotice({ kind: "success", text: "Request deleted." });
  }, []);

  return (
    <AppShell accountName={name}>
      <PayPalScriptProvider options={PAYPAL_OPTIONS}>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-gap p-pad max-sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-gap">
            <div className="min-w-0">
              <h1 className="text-[24px] font-semibold leading-tight">Requests</h1>
              {name || email ? (
                <p className="mt-1 break-words text-[14px] text-muted">
                  Signed in as {name}
                  {name && email ? ", " : ""}
                  {email}
                </p>
              ) : null}
            </div>
            <Button to="/requestservice">Request a service</Button>
          </div>

          {notice ? (
            <Notice kind={notice.kind} onDismiss={dismissNotice}>
              {notice.text}
            </Notice>
          ) : null}

          <CountFilter items={filterItems} value={filter} onChange={setFilter} />

          <section
            ref={listRef}
            tabIndex={-1}
            aria-label="Your requests"
            className="rounded-panel border border-border outline-none"
          >
            {phase === "loading" ? (
              <SkeletonRow count={3} />
            ) : phase === "error" ? (
              <div className="px-pad py-6">
                <Notice kind="error" onRetry={load}>
                  Your requests could not be loaded.
                </Notice>
              </div>
            ) : forms.length === 0 ? (
              <EmptyState action={<Button to="/requestservice">Request a service</Button>}>
                You haven't requested anything yet.
              </EmptyState>
            ) : visible.length === 0 ? (
              <EmptyState>No {filter} requests.</EmptyState>
            ) : (
              <ul>
                {visible.map((f) => (
                  <RequestRow
                    key={f._id}
                    form={f}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPay={onPay}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        <Dialog open={Boolean(editing)} onClose={closeEdit} title="Edit request">
          {editing ? <EditPanel key={editing._id} form={editing} onSaved={onSaved} onClose={closeEdit} /> : null}
        </Dialog>
        <Dialog open={Boolean(deleting)} onClose={closeDelete} title="Delete this request?">
          {deleting ? <DeletePanel form={deleting} onDeleted={onDeleted} onClose={closeDelete} /> : null}
        </Dialog>
        <Dialog open={Boolean(paying)} onClose={closePay} title="Pay for this request">
          {paying ? <PayPanel key={paying._id} form={paying} onClose={closePay} /> : null}
        </Dialog>
      </PayPalScriptProvider>
    </AppShell>
  );
}
