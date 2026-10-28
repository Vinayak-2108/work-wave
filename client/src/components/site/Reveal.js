import { useEffect, useRef } from "react";
import "./site.css";

/*
 * One shared IntersectionObserver for every entrance on the page.
 * Content is visible without script and under reduced motion. An element
 * already on screen when it mounts is left alone; one below the fold gets
 * `.reveal-pending` (hidden, 24px low) and `.is-in` when it scrolls into view.
 * Only opacity and transform change. Stagger with `delay` (ms).
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

export default function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return undefined;
    el.classList.add("reveal-pending");
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={delay ? { ...style, "--reveal-delay": `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
