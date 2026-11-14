import React from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { HOSPITAL_INFO } from "../../../constants";
import { PhoneCall } from "lucide-react";
import styles from "./process.module.css";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Call or book",
    description:
      "Call us to arrange a routine visit. Emergency cases can walk in at the Sector 90 hospital.",
    image: "/images/process-step1-make-appointment.png",
    imageAlt: "Pet owner arranging a visit with the veterinary team",
  },
  {
    step: "02",
    title: "Meet the vet",
    description:
      "The veterinarian will examine your pet and ask about their symptoms and medical history.",
    image: "/images/process-step2-doctor-assigned.jpg",
    imageAlt: "Veterinary team at AVC Pet Hospital",
  },
  {
    step: "03",
    title: "Tests if needed",
    description:
      "The team can run in-house blood tests or imaging and review the results with you.",
    image: "/images/doctor-dr-hardeep-opd-consult.jpg",
    imageAlt: "Veterinarian examining a dog with a colleague",
  },
  {
    step: "04",
    title: "Treatment and follow-up",
    description:
      "Your veterinarian will explain the recommended treatment and any follow-up your pet may need.",
    image: "/images/process-step4-cure-and-relief.jpg",
    imageAlt: "Dog at the veterinary hospital",
  },
];

export const PetCareProcess: React.FC = () => {
  return (
    <section className={styles.section} id="process">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>How a visit works</h2>
          <p className={styles.subtitle}>
            A quick look at what to expect when you bring your pet to AVC.
          </p>
        </div>

        <div className={styles.grid}>
          {PROCESS_STEPS.map((step) => (
            <article key={step.step} className={styles.stepCard}>
              <div className={styles.imageWrap}>
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.stepImage}
                />
              </div>

              <div className={styles.content}>
                <span className={styles.stepNumber}>{step.step}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.emergencyBypassCard}>
          <div className={styles.bypassPetSection}>
            <Image
              src="/images/emergency-dog-companion.png"
              alt="Golden retriever at AVC Pet Hospital"
              width={150}
              height={210}
              className={styles.bypassPetImg}
            />
          </div>

          <div className={styles.emergencyCopy}>
            <h3 className={styles.bypassTitle}>24/7 emergency care</h3>
            <p className={styles.bypassText}>
              The Sector 90 hospital accepts emergency walk-ins 24/7.
            </p>
          </div>

          <a
            href={`tel:${HOSPITAL_INFO.emergencyPhone.replace(/\s+/g, "")}`}
            className={styles.callCtaBtn}
          >
            <PhoneCall size={16} aria-hidden="true" />
            <span>Call · {HOSPITAL_INFO.emergencyPhone}</span>
          </a>
        </div>
      </Container>
    </section>
  );
};
