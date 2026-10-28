import { memo } from "react";

/*
 * 20px status pill, 12/500, one per row. Never wraps or shrinks.
 * Colours come from the --pill-* tokens (defined in .app).
 * Memoised: props are primitives (status string), so rows skip re-rendering
 * while their status is unchanged.
 */
const styles = {
  pending:
    "bg-pill-pending-bg text-pill-pending-ink border-pill-pending-border",
  accepted:
    "bg-pill-accepted-bg text-pill-accepted-ink border-pill-accepted-bg",
  rejected:
    "bg-pill-rejected-bg text-pill-rejected-ink border-pill-rejected-bg",
};

function StatusPill({ status, className = "" }) {
  const key = String(status ?? "").trim().toLowerCase();
  const tone = styles[key] || "bg-active text-muted border-active";
  const text = key ? key.charAt(0).toUpperCase() + key.slice(1) : "";
  return (
    <span
      className={`inline-flex h-5 flex-none items-center whitespace-nowrap rounded-pill border px-2 font-text text-xs font-medium leading-none ${tone} ${className}`.trim()}
    >
      {text}
    </span>
  );
}

export default memo(StatusPill);
