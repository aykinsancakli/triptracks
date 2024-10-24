import styles from "./PageNotFound.module.scss";
import { PiSmileySad } from "react-icons/pi";

function PageNotFound() {
  return (
    <main className={styles.pageNotFound}>
      <PiSmileySad className={styles.sadFace} />
      <span>404</span>
      <p className={styles.heading}>Page not found</p>
      <p className={styles.description}>
        The page you are looking for doesn&apos;t exist or an other error
        occured. <br />
        Go back, or head over to triptracks.com to choose a new direction.
      </p>
    </main>
  );
}

export default PageNotFound;
