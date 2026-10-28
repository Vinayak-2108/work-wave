import { forwardRef, useId } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon, SpinnerIcon } from "./icons";

/*
 * Pill button. Variants: primary, secondary, text.
 * `onDark` flips primary/secondary for navy and teal fields (paper fill,
 * navy label). Its focus ring is teal, which suits navy fields only.
 * `onTeal` is for teal fields: same flipped colours with a navy (--on-teal)
 * ring, because a teal ring is invisible on teal. Secondary and text
 * variants switch to navy labels there (paper on teal is 1.6:1).
 * Heights: 48px on marketing (.site), 36px in the app (44px on phones, from
 * --control-height). Renders a router <Link> when given `to`.
 * `loading`: label stays, a spinner replaces the arrow, aria-busy is set and
 * clicks are ignored. `disabled` needs `disabledReason`, which is shown in
 * words beside the button and tied to it with aria-describedby.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 " +
  "font-text text-body font-semibold leading-none whitespace-nowrap select-none " +
  "h-12 [.app_&]:h-control-height [.app_&]:px-4 [.app_&]:text-[14px] " +
  "transition-[background-color,color,border-color,transform] duration-fast ease-out " +
  "active:translate-y-px";

const light = {
  primary: "bg-action text-surface hover:bg-navy",
  secondary:
    "bg-surface text-ink border-2 border-navy hover:bg-navy hover:text-on-navy",
  text: "px-2 text-ink underline underline-offset-4 hover:text-action",
};

const dark = {
  primary: "bg-paper text-navy hover:bg-surface",
  secondary:
    "bg-transparent text-on-navy border-2 border-on-navy hover:bg-paper hover:text-navy",
  text: "px-2 text-on-navy underline underline-offset-4 hover:text-teal",
};

// Teal fields: paper-on-teal text fails contrast, so secondary/text use navy.
const teal = {
  primary: dark.primary,
  secondary:
    "bg-transparent text-on-teal border-2 border-on-teal hover:bg-on-teal hover:text-on-navy",
  text: "px-2 text-on-teal underline underline-offset-4 hover:bg-paper",
};

const ringNavy = " focus-visible:[outline-color:var(--teal)]";
const ringTeal = " focus-visible:[outline-color:var(--on-teal)]";

const disabledStyle = {
  primary: "bg-muted text-surface cursor-not-allowed",
  secondary: "bg-surface text-muted border-2 border-muted cursor-not-allowed",
  text: "px-2 text-muted underline underline-offset-4 cursor-not-allowed",
};

const disabledDark = {
  primary: "bg-on-navy-muted text-navy cursor-not-allowed",
  secondary: "bg-transparent text-on-navy-muted border-2 border-on-navy-muted cursor-not-allowed",
  text: "px-2 text-on-navy-muted underline underline-offset-4 cursor-not-allowed",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    onDark = false,
    onTeal = false,
    to,
    arrow = false,
    loading = false,
    disabled = false,
    disabledReason,
    type = "button",
    className = "",
    children,
    onClick,
    ...rest
  },
  ref
) {
  const reasonId = useId();
  const isDisabled = disabled && !loading;
  const tone = isDisabled
    ? (onDark && !onTeal ? disabledDark : disabledStyle)[variant]
    : onTeal
      ? teal[variant] + ringTeal
      : onDark
        ? dark[variant] + ringNavy
        : light[variant];
  const classes = `${base} ${tone} ${className}`.trim();
  const trailing = loading ? (
    <SpinnerIcon size={20} />
  ) : arrow ? (
    <ArrowIcon size={20} />
  ) : null;
  const content = (
    <>
      <span>{children}</span>
      {trailing}
    </>
  );
  const showReason = isDisabled && disabledReason;

  let control;
  if (to && !isDisabled) {
    control = (
      <Link
        ref={ref}
        to={to}
        className={classes}
        aria-busy={loading || undefined}
        onClick={loading ? (e) => e.preventDefault() : onClick}
        {...rest}
      >
        {content}
      </Link>
    );
  } else {
    control = (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-describedby={showReason ? reasonId : undefined}
        onClick={loading ? (e) => e.preventDefault() : onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }

  if (!showReason) return control;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      {control}
      <span id={reasonId} className="text-small text-muted">
        {disabledReason}
      </span>
    </span>
  );
});

export default Button;
