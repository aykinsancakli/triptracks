import PageNav from "../../components/PageNav/PageNav";
import styles from "./Product.module.scss";
import img from "../../assets/img-1.jpg";

function Product() {
  return (
    <main className={styles.product}>
      <PageNav />

      <section>
        <img src={img} alt="person with dog overlooking mountain with sunset" />
        <div>
          <h2>About TripTracks</h2>
          <p>
            TripTracks is your personal travel companion, built to preserve the
            memories of every journey you take. Whether you’re wandering through
            bustling cities or exploring hidden corners of the world, TripTracks
            ensures that no moment goes unnoticed.
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
