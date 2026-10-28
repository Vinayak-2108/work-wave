import { memo } from "react";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "../ui";
import logo from "../../assets/logo.png";
import Reveal from "../site/Reveal";

/*
 * Marketing footer: compact navy field. Left: small logo on a paper chip
 * plus a one-line description. Right: plain lists (Pages, Services, Contact).
 * Bottom: legal line.
 */
const pages = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/privacy", label: "Terms" },
];

const services = [
  ["Digital Marketing", "svc-marketing"],
  ["Content Creation", "svc-content"],
  ["Logo Designing", "svc-logo"],
  ["Web Development", "svc-web"],
  ["Graphic Designing", "svc-graphic"],
];

const link =
  "inline-flex min-h-11 items-center text-body text-on-navy underline-offset-4 " +
  "transition-colors duration-fast ease-out hover:text-teal hover:underline md:min-h-0";

const heading = "mb-3 text-body font-semibold text-on-navy-muted";

function SiteFooter() {
  return (
    <footer className="site bg-navy text-[1.29rem] px-margin pb-6 pt-14 text-on-navy [--focus:var(--teal)]">
      <div className="grid grid-cols-1 gap-x-gutter gap-y-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <Reveal>
          <Link to="/" className="inline-block rounded-input bg-paper px-3 py-2" aria-label="WorkWave home">
            <img src={logo} alt="" className="h-8 w-auto" />
          </Link>
          <p className="mt-4 max-w-[28ch] text-body text-on-navy-muted">
            One stop interface connecting clients and technical experts.
          </p>
        </Reveal>

        <Reveal as="section" delay={75} aria-labelledby="footer-pages">
          <h2 id="footer-pages" className={heading}>Pages</h2>
          <ul className="flex flex-col gap-1">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className={link}>{p.label}</Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" delay={150} aria-labelledby="footer-services">
          <h2 id="footer-services" className={heading}>Services</h2>
          <ul className="flex flex-col gap-1">
            {services.map(([name, id]) => (
              <li key={id}>
                <Link to={`/services#${id}`} className={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" delay={225} aria-labelledby="footer-contact">
          <h2 id="footer-contact" className={heading}>Contact</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <a href="mailto:support@workwave.com" className={`${link} gap-2`}>
                <EnvelopeIcon size={20} />
                support@workwave.com
              </a>
            </li>
          </ul>
        </Reveal>

      </div>

      <p className="mt-12 text-small text-on-navy-muted">
        Copyright &copy; {new Date().getFullYear()} WorkWave. All rights reserved.
      </p>
    </footer>
  );
}

export default memo(SiteFooter);
