import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Set up your first scrape <br className="sm:block hidden" /> in just a
        few steps.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Langley makes web scraping simple. Define your target site, choose the
        data you need, and launch — no complex setup required. Get clean results
        ready for export or automation.
      </p>

      <Button styles={`mt-10`} />
    </div>

    <div className={layout.sectionImg}>
      <img
        src={card}
        alt="scraping setup preview"
        className="w-[100%] h-[100%]"
      />
    </div>
  </section>
);

export default CardDeal;
