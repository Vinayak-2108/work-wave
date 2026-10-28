import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, CloseIcon, MenuIcon } from "../ui";
import { useAuth } from "../../utils/useAuth";

/*
 * Dashboard frame: tinted L-shape (228px sidebar plus 48px top bar) around a
 * white sheet (16px radius, 1px border, inset 8px right and bottom).
 * Sidebar: wordmark, then "Requests" and "Request a service" for clients or
 * "Queue" for admins. Top bar: Home, About, Services, Terms, optional account
 * name, Logout. No marketing footer here (approved A5).
 * Phone: the frame collapses to a 48px bar with Menu, `title` and one
 * `action` node; Menu opens a sheet holding every link. Escape closes it.
 * Props: title (phone bar), action (phone bar node), accountName (optional).
 */
const siteLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/privacy", label: "Terms" },
];

const clientNav = [
  { to: "/userdashboard", label: "Requests" },
  { to: "/requestservice", label: "Request a service" },
];
const adminNav = [{ to: "/admindashboard", label: "Queue" }];

const sideItem = ({ isActive }) =>
  "flex h-control-height items-center rounded-panel px-3 text-[14px] font-semibold text-text " +
  "transition-colors duration-fast ease-out hover:bg-raised " +
  (isActive ? "bg-active" : "");

const topItem = ({ isActive }) =>
  "inline-flex h-control-height items-center rounded-pill px-3 text-[14px] text-text " +
  "transition-colors duration-fast ease-out hover:bg-active " +
  (isActive ? "font-semibold underline underline-offset-4" : "");

function Wordmark() {
  return (
    <Link
      to="/"
      className="rounded-panel px-3 font-display text-[28px] font-extrabold uppercase leading-none tracking-[-0.005em] text-primary"
    >
      WorkWave
    </Link>
  );
}

function AppShell({ children, title, action, accountName }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const nav = role === "admin" ? adminNav : clientNav;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    },
    [open]
  );
  const onLogout = useCallback(() => {
    logout();
    setOpen(false);
    navigate("/");
  }, [logout, navigate]);

  return (
    <div className="app flex min-h-[100svh] bg-frame text-text" onKeyDown={onKeyDown}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-30 focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>

      <aside className="hidden w-[228px] flex-none flex-col gap-gap px-3 py-4 md:flex">
        <Wordmark />
        <nav aria-label="Dashboard">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={sideItem}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="relative z-20 flex h-12 flex-none items-center justify-between gap-2 px-2 md:px-0 md:pr-2">
          <button
            ref={menuButton}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="app-menu"
            className="inline-flex h-control-height items-center gap-2 rounded-pill px-3 text-[14px] font-semibold hover:bg-active md:hidden"
          >
            {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            <span>Menu</span>
          </button>
          {title ? (
            <p className="min-w-0 truncate text-[16px] font-semibold md:hidden">{title}</p>
          ) : null}
          <div className="md:hidden">{action}</div>

          <nav aria-label="Site" className="ml-auto hidden items-center gap-1 md:flex">
            {siteLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={topItem}>
                {l.label}
              </NavLink>
            ))}
            {accountName ? (
              <span className="px-3 text-[14px] text-muted">{accountName}</span>
            ) : null}
            <Button variant="text" onClick={onLogout}>
              Logout
            </Button>
          </nav>

          <div
            id="app-menu"
            className={
              (open ? "block" : "hidden") +
              " absolute inset-x-0 top-full rounded-b-panel bg-frame px-2 pb-3 shadow-menu md:hidden"
            }
          >
            <ul className="flex flex-col gap-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className={sideItem} onClick={close}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
              {siteLinks.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} className={sideItem} onClick={close}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Button variant="secondary" onClick={onLogout} className="mt-2 w-full">
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <main
          id="main"
          className="mb-2 min-w-0 flex-1 overflow-x-auto rounded-sheet border border-border bg-surface md:mr-2 max-md:mx-0 max-md:mb-0 max-md:rounded-none max-md:border-x-0"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(AppShell);
