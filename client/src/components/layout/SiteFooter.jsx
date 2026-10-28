import { memo } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "../ui";
import logo from "../../assets/logo.png";

/*
 * Marketing footer: compact navy field. Left: small logo on a paper chip
 * plus a one-line description. Right: plain lists (Pages, Services, Contact,
 * and Credits when `credits` is given). Bottom: legal line.
 * `credits`: optional [{ label, href }] for picture credits (Phase 4).
 */
const pages = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/privacy", label: "Terms" },
];

const services = [
  "Digital Marketing",
  "Content Creation",
  "Logo Designing",
  "Web Development",
  "Graphic Designing",
];

const link =
  "inline-flex min-h-11 items-center text-body text-on-navy underline-offset-4 " +
  "transition-colors duration-fast ease-out hover:text-teal hover:underline md:min-h-0";

const heading = "mb-3 text-body font-semibold text-on-navy-muted";

function SiteFooter({ credits = [] }) {
  return (
    <footer className="site bg-navy px-margin pb-6 pt-14 text-on-navy [--focus:var(--teal)]">
      <div className="grid grid-cols-1 gap-x-gutter gap-y-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Link to="/" className="inline-block rounded-input bg-paper px-3 py-2" aria-label="WorkWave home">
            <img src={logo} alt="" className="h-8 w-auto" />
          </Link>
          <p className="mt-4 max-w-[28ch] text-body text-on-navy-muted">
            One stop interface connecting clients and technical experts.
          </p>
        </div>

        <section aria-labelledby="footer-pages">
          <h2 id="footer-pages" className={heading}>Pages</h2>
          <ul className="flex flex-col gap-1">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className={link}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-services">
          <h2 id="footer-services" className={heading}>Services</h2>
          <ul className="flex flex-col gap-1">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className={link}>{s}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className={heading}>Contact</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <a href="mailto:support@workwave.com" className={`${link} gap-2`}>
                <EnvelopeIcon size={20} />
                support@workwave.com
              </a>
            </li>
          </ul>
        </section>

        {credits.length > 0 ? (
          <section aria-labelledby="footer-credits">
            <h2 id="footer-credits" className={heading}>Credits</h2>
            <ul className="flex flex-col gap-1">
              {credits.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className={link}>{c.label}</a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <p className="mt-10 border-t border-on-navy-muted/30 pt-6 text-small text-on-navy-muted">
        Copyright &copy; {new Date().getFullYear()} WorkWave. All rights reserved.
      </p>
    </footer>
  );
}

export default memo(SiteFooter);
