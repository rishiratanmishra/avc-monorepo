import type { NavItem } from "../types";

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  services: [
    { label: "24/7 Emergency & ICU", href: "/services" },
    { label: "Surgeries & Modular OT", href: "/services" },
    { label: "In-House IDEXX Diagnostics", href: "/services" },
    { label: "Cat Care OPD", href: "/services" },
  ],
  company: [
    { label: "About AVC", href: "/about" },
    { label: "Our Veterinarians", href: "/about#team" },
    { label: "Hospital Facilities", href: "/about#facilities" },
    { label: "Staff & Admin", href: "/manage/practice" },
    { label: "Contact Us", href: "/contact" },
  ],
};
