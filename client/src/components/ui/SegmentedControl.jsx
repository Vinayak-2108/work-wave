import { useId, useRef, useState } from "react";

/*
 * Two-or-more pill choice (e.g. User / Admin). A real <select> carrying
 * `name` and `id` sits underneath, visually hidden and out of the tab order,
 * so the submitted field and its value are unchanged. The visible pills are
 * a radiogroup with roving tabindex and arrow-key support.
 *
 * `onChange` receives `{ target: { name, value } }`, so handlers written for
 * a <select> change event keep working. Controlled via `value`, or
 * uncontrolled via `defaultValue`.
 */
export default function SegmentedControl({
  label,
  name,
  id,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className = "",
}) {
  const labelId = useId();
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : inner;
  const refs = useRef([]);
  // Roving tabindex: if a controlled value matches no option, index 0 stays
  // reachable so the group is never skipped by the keyboard.
  const matched = options.findIndex((o) => o.value === current);
  const tabbable = matched === -1 ? 0 : matched;

  const select = (next, focus) => {
    if (disabled || next === current) return;
    if (value === undefined) setInner(next);
    if (onChange) onChange({ target: { name, value: next } });
    if (focus) {
      const i = options.findIndex((o) => o.value === next);
      refs.current[i]?.focus();
    }
  };

  const onKeyDown = (event, index) => {
    const last = options.length - 1;
    let target;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      target = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      target = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      target = 0;
    } else if (event.key === "End") {
      target = last;
    } else {
      return;
    }
    event.preventDefault();
    select(options[target].value, true);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <span
        id={labelId}
        className="text-body font-semibold text-ink [.app_&]:text-[14px] [.app_&]:text-text"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="inline-flex w-full gap-1 rounded-pill bg-surface p-1 [.app_&]:border [.app_&]:border-control"
      >
        {options.map((option, index) => {
          const selected = option.value === current;
          return (
            <button
              key={option.value}
              ref={(el) => (refs.current[index] = el)}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={index === tabbable ? 0 : -1}
              disabled={disabled}
              onClick={() => select(option.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={
                "flex-1 rounded-pill px-4 font-text text-body font-semibold " +
                "h-10 [.app_&]:h-8 [.app_&]:text-[14px] " +
                "transition-[background-color,color,transform] duration-fast ease-out active:translate-y-px " +
                "disabled:cursor-not-allowed " +
                (selected
                  ? "bg-action text-surface"
                  : "bg-transparent text-ink [.app_&]:text-text hover:bg-paper [.app_&]:hover:bg-raised")
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <select
        id={id}
        name={name}
        value={current}
        onChange={(e) => select(e.target.value)}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
