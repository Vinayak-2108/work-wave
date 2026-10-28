import { useCallback, useEffect, useId, useRef } from "react";
import { CloseIcon } from "./icons";

/*
 * Modal dialog built on the native <dialog> element opened with showModal():
 * the browser traps focus, closes on Escape and returns focus to the trigger.
 * `open` is controlled and `onClose` is REQUIRED: it fires on Escape, the
 * close button and a backdrop click, and the parent must set open to false
 * in response. A backdrop click only closes when both the mousedown and the
 * mouseup landed on the <dialog> itself (so a text-selection drag that ends
 * outside does not dismiss it). Children mount only while open, so heavy
 * content (e.g. PayPal buttons) is not loaded early. Up to 560px wide; full
 * screen under 640px. Keep it inside a .app or .site wrapper so tokens resolve.
 *
 * Initial focus: the first descendant with `autofocus` or `data-autofocus`
 * (React does not emit a DOM autofocus attribute, so pass `data-autofocus`
 * on the field in an Edit dialog), otherwise the close button.
 */
export default function Dialog({
  open,
  onClose,
  title,
  children,
  className = "",
}) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const pressedOnBackdrop = useRef(false);
  const releasedOnBackdrop = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      const target = el.querySelector("[autofocus], [data-autofocus]") || closeRef.current;
      target?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  const handleClose = useCallback(() => {
    if (open) onClose();
  }, [open, onClose]);

  const onMouseDown = useCallback((e) => {
    pressedOnBackdrop.current = e.target === ref.current;
  }, []);
  const onMouseUp = useCallback((e) => {
    releasedOnBackdrop.current = e.target === ref.current;
  }, []);
  const onBackdropClick = useCallback(
    (e) => {
      const both = pressedOnBackdrop.current && releasedOnBackdrop.current;
      pressedOnBackdrop.current = false;
      releasedOnBackdrop.current = false;
      if (e.target === ref.current && both) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={handleClose}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onBackdropClick}
      className={
        "m-auto w-[min(560px,calc(100%-2*var(--margin,16px)))] max-w-none overflow-y-auto rounded-sheet " +
        "border-0 bg-surface p-0 font-text text-ink shadow-dialog [.app_&]:text-text " +
        "max-sm:m-0 max-sm:h-full max-sm:max-h-none max-sm:w-full max-sm:rounded-none " +
        "backdrop:bg-[color-mix(in_srgb,var(--navy)_40%,transparent)] " +
        className
      }
    >
      {open ? (
        <div className="flex flex-col gap-4 p-pad">
          <div className="flex items-start justify-between gap-4">
            <h2
              id={titleId}
              className="text-[16px] font-semibold leading-snug [.site_&]:text-lead"
            >
              {title}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-2 flex h-11 w-11 flex-none items-center justify-center rounded-pill transition-[background-color,transform] duration-fast ease-out hover:bg-paper active:translate-y-px [.app_&]:hover:bg-raised"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
