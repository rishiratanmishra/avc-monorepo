import React from "react";
import type { Metadata } from "next";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { MobileActionBar } from "../../components/layout/mobile-action-bar";
import {
  ContactHero,
  ContactCampuses,
  ContactForm,
  ContactFaq,
} from "../../components/pages/contact";
import { Testimonials } from "../../components/pages/home";

export const metadata: Metadata = {
  title: "Contact Us & Hospital Locations | AVC Multispeciality Pet Hospital Gurugram",
  description:
    "Contact AVC Multispeciality Pet Hospital. 24/7 Trauma Emergency ICU at Sector 90 and Luxury Pet World Resort at Sector 87, Gurugram. Call +91 99900 70026 or book consultation online.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <ContactCampuses />
        <ContactForm />
        <Testimonials />
        <ContactFaq />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
