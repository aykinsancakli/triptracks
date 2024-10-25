import { useLocation } from "react-router-dom";
import styles from "./Places.module.scss";

import { MdBookmarkAdded } from "react-icons/md";
import { usePlaces } from "../../contexts/PlacesContext";

function Places({ children }) {
  const { places } = usePlaces();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  return (
    <div
      className={`${styles.places} ${
        isFormPage ? `${styles.placesDisabled}` : ""
      }`}
    >
      <button
        className={`${styles.placesBtn} ${
          isFormPage ? `${styles.placesDisabled}` : ""
        }`}
      >
        <MdBookmarkAdded size={32} color="#22c55e" />
        <span>Places</span>
        {places.length > 0 && (
          <span className={styles.num}>{places.length}</span>
        )}
      </button>
      {children}
    </div>
  );
}

export default Places;
