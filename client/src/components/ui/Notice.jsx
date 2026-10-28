import { AlertIcon, CheckIcon, InfoIcon } from "./icons";
import Button from "./Button";

/*
 * Inline message placed inside the block it concerns. One sentence plus an
 * optional Retry and/or Dismiss text button. kind: info | success | error.
 * Errors use role="alert"; the others role="status".
 */
const kinds = {
  info: { Icon: InfoIcon, text: "", role: "status" },
  success: { Icon: CheckIcon, text: "text-positive", role: "status" },
  error: { Icon: AlertIcon, text: "text-negative", role: "alert" },
};

export default function Notice({
  kind = "info",
  children,
  onRetry,
  retryLabel = "Retry",
  onDismiss,
  dismissLabel = "Dismiss",
  className = "",
}) {
  const { Icon, text, role } = kinds[kind] || kinds.info;
  return (
    <div
      role={role}
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-text text-body [.app_&]:text-[14px] ${text} ${className}`.trim()}
    >
      <Icon size={20} className="flex-none" />
      <p className="min-w-0 flex-1 font-semibold">{children}</p>
      {onRetry || onDismiss ? (
        <span className="flex flex-none items-center">
          {onRetry ? (
            <Button variant="text" onClick={onRetry} className="!text-current">
              {retryLabel}
            </Button>
          ) : null}
          {onDismiss ? (
            <Button variant="text" onClick={onDismiss} className="!text-current">
              {dismissLabel}
            </Button>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
