import React from "react";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import {
  EmergencyBanner,
  Hero,
  Services,
  PetCareProcess,
  SpeciesTreated,
  Testimonials,
  FaqSection,
} from "../components/sections";

export default function Home() {
  return (
    <>
      <EmergencyBanner />
      <Header />
      <main>
        <Hero />
        <Services />
        <PetCareProcess />
        <SpeciesTreated />
        <Testimonials />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
