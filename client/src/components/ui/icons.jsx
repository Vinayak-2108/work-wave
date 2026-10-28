import { forwardRef } from "react";

/*
 * Inline SVG icons. They inherit colour from `currentColor` and are
 * decorative by default (aria-hidden). Pass `title` to give one a name.
 */
const Svg = forwardRef(function Svg(
  { size = 24, title, children, strokeWidth = 2, ...rest },
  ref
) {
  const labelled = Boolean(title);
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...rest}
    >
      {labelled ? <title>{title}</title> : null}
      {children}
    </svg>
  );
});

export const MenuIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
));

export const CloseIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
));

export const ArrowIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
));

export const EnvelopeIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Svg>
));

export const EyeIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
));

export const EyeOffIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <path d="M9.9 5.7A10.6 10.6 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.2 3.9M6.3 7.3A17 17 0 0 0 2 12s3.6 6.5 10 6.5c1.5 0 2.9-.3 4.1-.9" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </Svg>
));

export const AlertIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </Svg>
));

export const CheckIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </Svg>
));

export const InfoIcon = forwardRef((props, ref) => (
  <Svg ref={ref} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5v.01" />
  </Svg>
));

/* Loading indicator. Spins unless the user prefers reduced motion. */
export const SpinnerIcon = forwardRef(({ className = "", ...props }, ref) => (
  <Svg
    ref={ref}
    className={`motion-safe:animate-spin ${className}`}
    {...props}
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Svg>
));
