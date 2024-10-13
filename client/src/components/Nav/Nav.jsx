import styles from "./Nav.module.scss";

import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";
import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";
import Places from "../Places/Places";

function Nav() {
  return (
    <nav className={styles.nav}>
      {/* LOGO */}
      <h1 className={styles.logo}>TripTracks</h1>

      {/* SEARCHBAR */}
      <SearchAutocomplete />

      {/* PLACES */}
      <Places>
        <PlaceList />
        <PlacesFilter />
      </Places>
    </nav>
  );
}

export default Nav;
