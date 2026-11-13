import React from "react";
import { Container } from "../layout/container";
import { SPECIES_TREATED } from "../../constants";
import styles from "./species.module.css";

export const SpeciesTreated: React.FC = () => {
  return (
    <section className={styles.section} id="species">
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>Pets we treat at our Hospital</h2>
        </div>

        <div className={styles.grid}>
          {SPECIES_TREATED.map((item, index) => {
            const num = String(index + 1).padStart(2, "0");
            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.image}
                    loading="lazy"
                  />
                  <div className={styles.numberBadge}>{num}</div>
                </div>
                <h3 className={styles.name}>{item.name}</h3>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
