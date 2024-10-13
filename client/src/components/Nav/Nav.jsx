import styles from "./Nav.module.scss";

import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";
import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";
import Places from "../Places/Places";
import Logo from "../Logo/Logo";

function Nav() {
  return (
    <nav className={styles.nav}>
      {/* LOGO */}
      <Logo />

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
