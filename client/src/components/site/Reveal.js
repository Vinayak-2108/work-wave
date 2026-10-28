import { useLayoutEffect, useRef } from "react";
import "./site.css";

/*
 * One shared IntersectionObserver for every entrance on the page.
 * Content is visible without script and under reduced motion. An element
 * already on screen when it mounts is left alone; one below the fold gets
 * `.reveal-pending` (hidden, 24px low) and `.is-in` when it scrolls into view.
 * An element already on screen at mount plays the same rise once from CSS
 * (`.reveal-load`, class added before first paint so there is no flash).
 * `scale` instead marks a picture wrapper for the slow 1 to 1.04 drift, which
 * starts when it is seen. Only opacity and transform change, so nothing moves
 * the layout or the focus order. Stagger with `delay` (ms). With no
 * IntersectionObserver, or under reduced motion, no class is added at all.
 */
let observer;
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
  }
  return observer;
}

export default function Reveal({ as: Tag = "div", delay = 0, scale = false, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const onScreen = el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (!scale && onScreen) {
      el.classList.add("reveal-load", "is-in");
      return undefined;
    }
    if (!scale) el.classList.add("reveal-pending");
    const io = getObserver();
    io.observe(el);
    /* Keyboard focus inside a still-hidden block shows it at once. */
    const onFocus = () => {
      el.classList.add("is-in");
      io.unobserve(el);
    };
    el.addEventListener("focusin", onFocus);
    return () => {
      el.removeEventListener("focusin", onFocus);
      io.unobserve(el);
    };
  }, [scale]);

  return (
    <Tag
      ref={ref}
      className={scale ? `slow-scale ${className}`.trim() : className}
      style={delay ? { ...style, "--reveal-delay": `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
