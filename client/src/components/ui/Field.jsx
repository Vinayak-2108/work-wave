import { forwardRef, useId } from "react";
import { AlertIcon } from "./icons";

/*
 * Labelled form field. `as` is "input" (default), "select" or "textarea".
 * `name` and `id` are passed to the control unchanged; an id is generated
 * only when none is given. Hint and error sit below the control and are tied
 * to it with aria-describedby. `prefix` (e.g. a currency sign) and
 * `endAdornment` (e.g. a Show toggle button) sit inside the control's box.
 * Marketing: filled white field, no border. App (.app): 1px --control border.
 */
const controlBase =
  "block w-full min-w-0 bg-surface text-ink [.app_&]:text-text font-text text-body " +
  "[.app_&]:text-[14px] rounded-input border-2 px-4 " +
  "h-12 [.app_&]:h-10 [.app_&]:border " +
  "placeholder:text-muted [.app_&]:placeholder:text-faint " +
  "transition-[border-color] duration-fast ease-out " +
  "disabled:bg-paper disabled:text-muted [.app_&]:disabled:bg-raised [.app_&]:disabled:text-muted " +
  "disabled:cursor-not-allowed";

const Field = forwardRef(function Field(
  {
    label,
    id,
    name,
    as: As = "input",
    hint,
    error,
    prefix,
    endAdornment,
    className = "",
    children,
    "aria-describedby": describedByProp,
    ...rest
  },
  ref
) {
  const generated = useId();
  const controlId = id || generated;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy =
    [describedByProp, hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shape =
    As === "textarea" ? "h-auto min-h-[7rem] py-3 [.app_&]:h-auto" : "";
  const pad = `${prefix ? "pl-10" : ""} ${endAdornment ? "pr-12" : ""}`;
  const invalid = error
    ? "border-negative [.app_&]:border-negative"
    : "border-transparent [.app_&]:border-control";

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <label
        htmlFor={controlId}
        className="text-body font-semibold text-ink [.app_&]:text-[14px] [.app_&]:text-text"
      >
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span
            className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted"
            aria-hidden="true"
          >
            {prefix}
          </span>
        ) : null}
        <As
          ref={ref}
          id={controlId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${controlBase} ${shape} ${pad} ${invalid}`.replace(/\s+/g, " ").trim()}
          {...rest}
        >
          {children}
        </As>
        {endAdornment ? (
          <span className="absolute inset-y-0 right-1 flex items-center">
            {endAdornment}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="text-small text-muted [.app_&]:text-[12px]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-2 text-small font-semibold text-negative [.app_&]:text-[12px]"
        >
          <AlertIcon size={16} className="mt-0.5 flex-none" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
});

export default Field;
