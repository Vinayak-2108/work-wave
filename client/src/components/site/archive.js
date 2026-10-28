import presses from "../../assets/archive/printing-presses-at-bureau-of-engraving-and.jpg";
import signPainter from "../../assets/archive/sign-painter-fortepan-12472.jpg";
import billboard from "../../assets/archive/billboard-7248873130.jpg";
import drafting from "../../assets/archive/engineering-department-at-dow-chemical-company.jpg";
import lithograph from "../../assets/archive/rehearsal-at-the-folies-bergere-emilenne-d.jpg";

/*
 * Archival pictures of each trade's ancestor, found with scripts/assets.mjs
 * (sources and licences in assets/archive/credits.json). They show the trade's
 * history, never WorkWave's own team or work. `width` and `height` are the
 * files' real pixel sizes, so the browser reserves space before they load.
 */
export const archive = {
  presses: {
    src: presses,
    width: 1600,
    height: 1235,
    alt: "A long hall of hand-operated printing presses in the 1860s, their levers raised.",
    caption: "Printing presses at the Bureau of Engraving and Printing, about 1860",
    credit: {
      label: "Printing presses, Mathew Benjamin Brady, public domain",
      href: "https://commons.wikimedia.org/wiki/File:Printing_presses_at_Bureau_of_Engraving_and_Printing_-_NARA_-_530059.jpg",
    },
  },
  signPainter: {
    src: signPainter,
    width: 1600,
    height: 2092,
    alt: "A sign painter lettering a wall by hand with a long brush, partway through a word.",
    caption: "A sign painter lettering a wall, 1943",
    credit: {
      label: "Sign painter, Fortepan 12472, CC BY-SA 3.0",
      href: "https://commons.wikimedia.org/wiki/File:Sign_painter_Fortepan_12472.jpg",
    },
  },
  billboard: {
    src: billboard,
    width: 1600,
    height: 1551,
    alt: "A hand-painted 1944 hoarding with a running total, a man hammering a new figure into place.",
    caption: "A hand-painted hoarding being updated, 1944",
    credit: {
      label: "Billboard, doe-oakridge, public domain",
      href: "https://commons.wikimedia.org/wiki/File:Billboard_(7248873130).jpg",
    },
  },
  drafting: {
    src: drafting,
    width: 1600,
    height: 1342,
    alt: "Rows of draughtsmen at drawing tables, each working over a large set of plans.",
    caption: "A drafting room at Dow Chemical",
    credit: {
      label: "Engineering Department, Dow Chemical Company, no known copyright",
      href: "https://commons.wikimedia.org/wiki/File:Engineering_Department_at_Dow_Chemical_Company_-_DPLA_-_64571eb3b977c388b837212f60f76f26.jpg",
    },
  },
  lithograph: {
    src: lithograph,
    width: 843,
    height: 1146,
    alt: "An 1893 lithograph of two dancers in a theatre, printed from stones in grey and tan.",
    caption: "A lithograph by Toulouse-Lautrec, 1893",
    credit: {
      label: "Toulouse-Lautrec lithograph, Art Institute of Chicago, CC0",
      href: "https://www.artic.edu/artworks/67139",
    },
  },
};

/* Credit lines for SiteFooter's `credits` prop. Call once at module level per page. */
export const creditsFor = (...keys) => keys.map((k) => archive[k].credit);
