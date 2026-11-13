import type { NavItem } from "../types";

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Emergency", href: "#emergency" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const FOOTER_LINKS = {
  services: [
    { label: "24/7 Emergency", href: "#services" },
    { label: "OPD & Vaccinations", href: "#services" },
    { label: "Surgery & OT", href: "#services" },
    { label: "Pathology & X-Ray", href: "#services" },
  ],
  company: [
    { label: "About AVC", href: "#about" },
    { label: "Our Veterinarians", href: "#doctors" },
    { label: "Admin Portal", href: "http://localhost:3002", isExternal: true },
    { label: "Contact Us", href: "#contact" },
  ],
};
