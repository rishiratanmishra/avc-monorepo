import React from "react";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { MobileActionBar } from "../components/layout/mobile-action-bar";
import {
  Hero,
  PetCareProcess,
  WhyChooseUs,
  Campuses,
  SpeciesTreated,
  Testimonials,
  FaqSection,
} from "../components/pages/home";
import { Services } from "../components/pages/service";

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
