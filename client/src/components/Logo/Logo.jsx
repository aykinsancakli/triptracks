import { Link } from "react-router-dom";
import styles from "./Logo.module.scss";
import logo from "../../assets/TripTracks-logo.png";

function Logo() {
  return (
    <Link to="/">
      <img src={logo} alt="TripTracks logo" className={styles.logo} />
    </Link>
  );
}

export default Logo;
