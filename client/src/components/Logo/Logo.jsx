import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";

function Logo() {
  return (
    <Link to="/">
      <span className={styles.logo}>TripTracks</span>
    </Link>
  );
}

export default Logo;
