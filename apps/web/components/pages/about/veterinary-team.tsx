import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { VETERINARY_TEAM } from "../../../constants/about-info";
import styles from "./veterinary-team.module.css";

export const VeterinaryTeam: React.FC = () => {
  return (
    <section className={styles.section} id="team" aria-labelledby="team-title">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Our team</span>

          <h2 id="team-title" className={styles.title}>
            Veterinary team at AVC
          </h2>

          <p className={styles.description}>
            Our veterinarians provide surgery, internal medicine, and emergency care in Gurugram.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {VETERINARY_TEAM.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              <div className={styles.visualWrapper}>
                <div className={styles.imageContainer}>
                  <Image
                    src={doctor.image}
                    alt={`${doctor.name} - ${doctor.role}`}
                    width={400}
                    height={440}
                    className={styles.doctorPhoto}
                  />
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <h3 className={styles.doctorName}>{doctor.name}</h3>
                  <span className={styles.doctorRole}>{doctor.role}</span>
                </div>

                <p className={styles.credentialsRow}>
                  {doctor.qualifications} · {doctor.experience}
                </p>
                <p className={styles.specialtyText}>{doctor.specialty}</p>

                <p className={styles.doctorBio}>{doctor.bio}</p>
              </div>

              {/* <div className={styles.cardAction}>
                <Link href="/#contact" className={styles.bookDocBtn}>
                  Contact AVC
                </Link>
              </div> */}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
