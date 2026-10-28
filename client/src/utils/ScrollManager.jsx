import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/*
 * One scroll manager for the whole app (rendered inside BrowserRouter).
 * - New pathname, no hash: scroll to the top.
 * - Hash: wait (up to about 1s) for the element to exist, since sections
 *   render through Reveal, then scroll it into view; targets carry
 *   scroll-margin-top so the header never covers them.
 * - prefers-reduced-motion: instant.
 * Same-path, same-hash updates (the admin dashboard's own state changes and
 * scroll restore) are ignored: the effect only depends on pathname, hash and
 * the navigation key, none of which change then.
 */
const MAX_WAIT_MS = 1000;

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    // Leave the browser's own restore alone on the first load (reload, back
    // from another site) unless a hash asks for a section.
    if (first.current) {
      first.current = false;
      if (!hash) return undefined;
    }
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? "auto" : "smooth";

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch (e) {
      /* keep the raw id */
    }
    const start = performance.now();
    let raf = 0;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "start", behavior });
        return;
      }
      if (performance.now() - start < MAX_WAIT_MS) raf = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, key]);

  return null;
}
