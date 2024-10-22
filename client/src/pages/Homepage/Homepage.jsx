import { Link } from "react-router-dom";
import styles from "./Homepage.module.scss";
import PageNav from "../../components/PageNav/PageNav";
import signature from "../../assets/signature.png";

function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <h1>
          Every journey has a story.
          <br />
          <span>TripTracks brings your moments to life.</span>
        </h1>
        <h2>
          A world map that turns every place you visit into a piece of your
          story. Mark the world with your travels and revisit the moments that
          shaped your adventures.
        </h2>
        <Link to="/login" className={styles.cta}>
          Start tracking now
        </Link>
      </section>

      <footer>
        Designed and Developed by
        <img src={signature} alt="Aykın Sancaklı's signature" />
      </footer>
    </main>
  );
}

export default Homepage;
