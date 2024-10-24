import PageNav from "../../components/PageNav/PageNav";
import styles from "../Product/Product.module.scss";
import img from "../../assets/img-2.webp";

function Pricing() {
  return (
    <main className={styles.product}>
      <PageNav />

      <section>
        <div className={styles.description}>
          <h2>
            Simple pricing.
            <br />
            Just $6/month.
          </h2>
          <p>
            Save and organize your favorite places with ease. Get access to your
            own custom travel map, where you can add personal notes and keep
            track of every special spot. Plus, enjoy automatic weather updates
            and beautiful photos to relive your memories. Start exploring today!
          </p>
        </div>
        <img
          className={styles.img}
          src={img}
          alt="Window view of a lake and mountains."
        />
      </section>
    </main>
  );
}

export default Pricing;
