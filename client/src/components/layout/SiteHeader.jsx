import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Button, CloseIcon, MenuIcon } from "../ui";
import { useAuth } from "../../utils/useAuth";

/*
 * Marketing header: paper bar, 64px (56px on phones), not sticky.
 * Links keep their labels: Home, About, Services, Terms, then Signup, or
 * Dashboard and Logout when a token exists (user and admin behave the same,
 * only the dashboard path differs). Every control is a real <a> or <button>.
 * Phone: a 44px Menu button toggles the same list as a full-width sheet
 * (aria-expanded, Escape closes and returns focus to the button, the sheet
 * closes on navigation). Logout updates auth state; it does not reload.
 */
const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/privacy", label: "Terms" },
];

const linkBase =
  "inline-flex min-h-11 items-center px-3 text-body font-semibold text-ink " +
  "underline-offset-[10px] decoration-[3px] hover:text-action md:min-h-0 md:py-1 " +
  "transition-colors duration-fast ease-out";

const navLinkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? "underline" : "no-underline"}`;

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, isAuthed, dashboardPath, logout } = useAuth();
  // Dashboard stays active on every route of the role's app area.
  const dashboardRoutes =
    role === "admin" ? ["/admindashboard"] : ["/userdashboard", "/requestservice"];
  const dashboardActive = dashboardRoutes.includes(location.pathname);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
    <header
      onKeyDown={onKeyDown}
      className="site relative z-20 bg-paper text-ink"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-margin focus:top-2 focus:z-30 focus:rounded-pill focus:bg-action focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 items-center justify-between px-margin md:h-16">
        <Link to="/" className="flex-none rounded-sm">
          <img src={logo} alt="WorkWave" className="h-8 w-auto" />
        </Link>

        <button
          ref={menuButton}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="site-nav"
          className="inline-flex h-11 items-center gap-2 rounded-pill px-4 text-body font-semibold text-ink transition-[background-color,transform] duration-fast ease-out hover:bg-surface active:translate-y-px md:hidden"
        >
          {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          <span>Menu</span>
        </button>

        <nav
          id="site-nav"
          aria-label="Main"
          className={
            (open ? "block" : "hidden") +
            " absolute inset-x-0 top-full bg-paper px-margin pb-4 shadow-menu " +
            "md:static md:block md:bg-transparent md:p-0 md:shadow-none"
          }
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={navLinkClass} onClick={close}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            {isAuthed ? (
              <>
                <li>
                  <NavLink
                    to={dashboardPath}
                    className={() => navLinkClass({ isActive: dashboardActive })}
                    aria-current={dashboardActive ? "page" : undefined}
                    onClick={close}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <Button variant="secondary" onClick={onLogout} className="max-md:mt-2 max-md:w-full">
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button to="/signup" onClick={close} className="max-md:mt-2 max-md:w-full">
                  Signup
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default memo(SiteHeader);
