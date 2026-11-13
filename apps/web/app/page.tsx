import React from "react";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { MobileActionBar } from "../components/layout/mobile-action-bar";
import {
  Hero,
  Services,
  PetCareProcess,
  WhyChooseUs,
  Campuses,
  SpeciesTreated,
  Testimonials,
  FaqSection,
} from "../components/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <PetCareProcess />
        <WhyChooseUs />
        <Campuses />
        <SpeciesTreated />
        <Testimonials />
        <FaqSection />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
