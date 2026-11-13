import React from "react";
import Image from "next/image";
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
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className={styles.image}
                  />
                  <div className={styles.numberBadge}>{num}</div>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.desc}>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
