import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../../layout/container";
import { VETERINARY_TEAM } from "../../../constants/about-info";
import { Users, GraduationCap, Award, Calendar, Heart } from "lucide-react";
import styles from "./veterinary-team.module.css";

export const VeterinaryTeam: React.FC = () => {
  return (
    <section className={styles.section} id="team" aria-labelledby="team-title">
      <Container>
        <div className={styles.header}>
          <div className={styles.tagWrap}>
            <Users className={styles.tagIcon} size={16} />
            <span>Dedicated Specialists</span>
          </div>

          <h2 id="team-title" className={styles.title}>
            Meet Our <span className={styles.titleHighlight}>Veterinary Surgeons & Doctors</span>
          </h2>

          <p className={styles.description}>
            Our medical board brings together specialized surgeons, emergency physicians, and feline medicine consultants committed to the health and happiness of your pets.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {VETERINARY_TEAM.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
              {/* Doctor Visual Header */}
              <div className={styles.visualWrapper}>
                <div className={styles.imageBackdrop} />
                <div className={styles.imageContainer}>
                  <Image
                    src={doctor.image}
                    alt={`${doctor.name} - ${doctor.role}`}
                    width={400}
                    height={440}
                    className={styles.doctorPhoto}
                  />
                </div>
                <div className={styles.experienceBadge}>
                  <Award size={14} className={styles.awardIcon} />
                  <span>{doctor.experience}</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <h3 className={styles.doctorName}>{doctor.name}</h3>
                  <span className={styles.doctorRole}>{doctor.role}</span>
                </div>

                <div className={styles.credentialsRow}>
                  <GraduationCap size={15} className={styles.credentialIcon} />
                  <span>{doctor.qualifications}</span>
                </div>

                <div className={styles.specialtyTag}>
                  <Heart size={13} className={styles.heartIcon} />
                  <span>{doctor.specialty}</span>
                </div>

                <p className={styles.doctorBio}>{doctor.bio}</p>

                {doctor.stats && (
                  <div className={styles.statsRow}>
                    <span className={styles.statsValue}>{doctor.stats.value}</span>
                    <span className={styles.statsLabel}>{doctor.stats.label}</span>
                  </div>
                )}
              </div>

              <div className={styles.cardAction}>
                <Link href="/#contact" className={styles.bookDocBtn}>
                  <Calendar size={15} />
                  <span>Book with {doctor.name.split(" ")[1] || "Doctor"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
