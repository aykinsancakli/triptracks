import PageNav from "../../components/PageNav/PageNav";
import styles from "./Product.module.scss";
import img from "../../assets/img-1.webp";

function Product() {
  return (
    <main className={styles.product}>
      <PageNav />

      <section>
        <img
          className={styles.img}
          src={img}
          alt="Person canoeing on a river"
        />
        <div className={styles.description}>
          <h2>About TripTracks</h2>
          <p>
            TripTracks is your personal travel companion, designed to preserve
            the memories of every journey. Whether you&apos;re exploring
            bustling cities or hidden corners of the world, TripTracks ensures
            no moment goes unnoticed.
          </p>
          <p>
            With TripTracks, every place you visit is saved, every memory
            cherished. Our seamless interface allows you to track your travels
            effortlessly, giving you a beautiful visual record of your global
            adventures.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Product;
