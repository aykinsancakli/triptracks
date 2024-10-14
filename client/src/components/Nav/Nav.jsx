import styles from "./Nav.module.scss";

import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";
import Logo from "../Logo/Logo";
import Stats from "../Stats/Stats";
import Places from "../Places/Places";
import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";

function Nav() {
  return (
    <nav className={styles.nav}>
      {/* LOGO */}
      <Logo />

      {/* SEARCHBAR */}
      <SearchAutocomplete />

      {/* STATS */}
      <Stats />

      {/* PLACES */}
      <Places>
        <PlaceList />
        <PlacesFilter />
      </Places>
    </nav>
  );
}

export default Nav;
