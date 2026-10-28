/*
 * Empty list state. Sits inside the block's own frame: one sentence across
 * the block and, optionally, the first action (pass a <Button> as `action`).
 */
export default function EmptyState({ children, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-start gap-4 px-pad py-10 font-text text-body text-ink [.app_&]:text-[14px] [.app_&]:text-text ${className}`.trim()}
    >
      <p className="max-w-[60ch]">{children}</p>
      {action}
    </div>
  );
}
