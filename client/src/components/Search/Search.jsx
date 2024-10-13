import styles from "./Search.module.scss";

import { MdBookmarkAdded } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { usePlaces } from "../../contexts/PlacesContext";

import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";
import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";

function Search() {
  const { places } = usePlaces();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  return (
    <nav className={styles.nav}>
      {/* LOGO */}
      <h1 className={styles.logo}>TripTracks</h1>

      {/* AUTOCOMPLETE */}
      <SearchAutocomplete />

      {/* FAVORITES */}
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
          <MdBookmarkAdded size={32} color="#84cc16" />
          <span>Places</span>
          {places.length > 0 && (
            <span className={styles.num}>{places.length}</span>
          )}
        </button>

        {/* PLACES LIST */}
        <PlaceList />
        <PlacesFilter />
      </div>
    </nav>
  );
}

export default Search;
