import React from "react";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { SPECIES_TREATED } from "../../constants";
import styles from "./species.module.css";

export const SpeciesTreated: React.FC = () => {
  return (
    <section className={styles.section} id="species">
      <Container>
        <div className={styles.header}>
          <Badge variant="teal">Patients We Care For</Badge>
          <h2 className={styles.title}>Pets We Treat At Our Hospital</h2>
          <p className={styles.subtitle}>
            From dogs and cats to avian friends and exotic pocket pets, our doctors offer gentle, tailored veterinary medicine.
          </p>
        </div>

        <div className={styles.grid}>
          {SPECIES_TREATED.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.desc}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
