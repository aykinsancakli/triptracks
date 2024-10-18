import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";

function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <span>TripTracks</span>
    </Link>
  );
}

export default Logo;
