import React from "react";
import type { Metadata } from "next";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";
import { MobileActionBar } from "../../components/layout/mobile-action-bar";
import {
  AboutHero,
  MissionValues,
  FounderStory,
  FacilitiesShowcase,
  VeterinaryTeam,
  Milestones,
} from "../../components/pages/about";
import {
  Campuses,
  Testimonials,
  EmergencyBanner,
} from "../../components/pages/home";

export const metadata: Metadata = {
  title: "About Us | AVC Multispeciality Pet Care Hospital Gurugram",
  description:
    "Learn about AVC Pet Hospital, founded by Dr. Hardeep Beniwal. Discover our 24/7 emergency ICU, sterile modular OT, IDEXX diagnostics lab, Cat Care OPD, and luxury boarding resort in Gurugram.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <MissionValues />
        <FounderStory />
        <FacilitiesShowcase />
        <VeterinaryTeam />
        <Milestones />
        <Campuses />
        <Testimonials />
        <EmergencyBanner />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
