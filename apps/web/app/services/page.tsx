import React from "react";
import type { Metadata } from "next";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { MobileActionBar } from "../../components/layout/mobile-action-bar";
import {
  ServicesHero,
  ServicesCatalog,
  TriageGuide,
  CareProcess,
  ServicesFaq,
} from "../../components/pages/service";
import { Campuses, EmergencyBanner } from "../../components/pages/home";

export const metadata: Metadata = {
  title: "Veterinary Services | AVC Multispeciality Pet Hospital Gurugram",
  description:
    "Explore comprehensive pet care services at AVC Pet Hospital. 24/7 trauma emergency ICU, sterile modular surgeries, rapid IDEXX lab, Cat Care OPD, and luxury boarding in Gurugram.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <ServicesHero />
        <ServicesCatalog />
        <TriageGuide />
        <CareProcess />
        <ServicesFaq />
        <Campuses />
        <EmergencyBanner />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
