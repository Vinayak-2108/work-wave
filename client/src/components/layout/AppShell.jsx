import { memo } from "react";
import { NavLink } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { useAuth } from "../../utils/useAuth";

/*
 * Dashboard frame (Milestone B): the shared SiteHeader on top, then a
 * sub-nav strip on `frame` (role tabs, 2px accent underline on the active
 * tab, account name at the right, the page's `action` node on phones), then
 * the white sheet, then the marketing SiteFooter (Milestone C). No sidebar, no second Logout, no second phone menu.
 * Props: title (unused visually, pages carry their own h1), action (phone
 * strip node), accountName (optional, shown from md).
 * The header root carries `.site`; the `.app` class stays on this shell so the
 * dashboard tokens apply to the strip and the sheet.
 */
const clientNav = [
  { to: "/userdashboard", label: "Requests" },
  { to: "/requestservice", label: "Request a service" },
];
const adminNav = [{ to: "/admindashboard", label: "Queue" }];

const tabClass = ({ isActive }) =>
  "inline-flex h-full flex-none items-center whitespace-nowrap border-b-2 px-3 text-[14px] font-semibold text-text " +
  "transition-colors duration-fast ease-out hover:bg-active focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:-outline-offset-2 focus-visible:outline-accent " +
  (isActive ? "border-accent" : "border-transparent");

function AppShell({ children, action, accountName }) {
  const { role } = useAuth();
  const nav = role === "admin" ? adminNav : clientNav;

  return (
    <div className="app flex min-h-[100svh] flex-col bg-frame text-text [--margin:clamp(16px,2.5vw,32px)]">
      <SiteHeader />

      <div className="flex h-11 flex-none items-stretch justify-between gap-2 px-margin md:h-12">
        <nav aria-label="Dashboard" className="-mx-3 flex min-w-0 items-stretch overflow-x-auto">
          <ul className="flex items-stretch">
            {nav.map((n) => (
              <li key={n.to} className="flex">
                <NavLink to={n.to} className={tabClass}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-none items-center gap-3">
          {accountName ? (
            <span className="hidden text-[14px] text-muted md:inline">{accountName}</span>
          ) : null}
          <div className="md:hidden">{action}</div>
        </div>
      </div>

      <main
        id="main"
        className="mx-margin mb-2 min-w-0 flex-1 overflow-x-auto rounded-sheet border border-border bg-surface"
      >
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

export default memo(AppShell);
