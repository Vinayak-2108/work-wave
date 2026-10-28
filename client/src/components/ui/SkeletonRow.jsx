import { memo } from "react";

/*
 * Loading placeholder with the RequestRow layout: title and budget on line
 * one, description and status slot on line two. Flat bars, no shimmer, same
 * height as the real row so nothing shifts when data lands. `count` repeats it.
 * Memoised: props are primitives, so it only re-renders when `count` changes.
 */
const bar = "block rounded-panel bg-active";

function Row() {
  return (
    <div className="flex min-h-[72px] flex-col justify-center gap-2 px-pad py-3">
      <div className="flex items-center justify-between gap-4">
        <span className={`${bar} h-[14px] w-2/5`} />
        <span className={`${bar} h-[14px] w-16 flex-none`} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className={`${bar} h-[14px] w-3/5`} />
        <span className="block h-5 w-[72px] flex-none rounded-pill bg-active" />
      </div>
    </div>
  );
}

function SkeletonRow({ count = 1 }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: count }, (_, i) => (
        <Row key={i} />
      ))}
    </div>
  );
}

export default memo(SkeletonRow);
