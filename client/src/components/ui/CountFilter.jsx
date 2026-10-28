import { memo } from "react";

/*
 * Equal count cards that filter a list (All, Pending, Accepted, Rejected).
 * `items`: [{ key, label, count }]. `value` is the selected key and
 * `onChange(key)` is called on selection. A zero count is shown as "0".
 * Under 640px the cards become a horizontally scrolling chip row.
 * Memoised: callers should pass a stable `items` (useMemo) and `onChange`
 * (useCallback), otherwise memo does nothing.
 */
function CountFilter({ items, value, onChange, label = "Filter requests", className = "" }) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`-m-1 flex gap-2 overflow-x-auto p-1 sm:grid sm:auto-cols-fr sm:grid-flow-col sm:gap-3 sm:overflow-visible ${className}`.trim()}
    >
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.key)}
            className={
              "flex h-[61px] min-w-[108px] flex-none flex-col items-start justify-center gap-0.5 " +
              "rounded-panel px-4 text-left font-text sm:min-w-0 " +
              "transition-[background-color,border-color,transform] duration-fast ease-out active:translate-y-px " +
              (selected
                ? "border-[1.5px] border-accent bg-[color-mix(in_srgb,var(--accent)_8%,var(--surface))]"
                : "border border-border bg-surface hover:bg-raised")
            }
          >
            <span className="text-[13px] leading-none text-muted">{item.label}</span>
            <span className="text-[16px] font-semibold leading-none text-text tabular-nums">
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(CountFilter);
