import React from "react";
import Image from "next/image";
import { Container } from "../../layout/container";
import { SPECIES_TREATED } from "../../../constants";
import styles from "./species.module.css";

export const SpeciesTreated: React.FC = () => {
  return (
    <section className={styles.section} id="species" aria-labelledby="species-title">
      <Container>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Compassionate Patient Care</span>
          <h2 id="species-title" className={styles.title}>
            Pets We Treat at Our Hospital
          </h2>
          <p className={styles.subtitle}>
            From domestic dogs and cats to companion birds and delicate exotic species, our medical team provides tailored clinical care.
          </p>
        </div>

        <div className={styles.grid}>
          {SPECIES_TREATED.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.desc}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
