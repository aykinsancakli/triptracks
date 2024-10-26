import styles from "./Nav.module.scss";

import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";
import Logo from "../Logo/Logo";
import Stats from "../Stats/Stats";
import Places from "../Places/Places";
import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";
import Account from "../Account/Account";

function Nav() {
  return (
    <nav className={styles.nav}>
      {/* LOGO */}
      <div className={styles.logo}>
        <Logo />
      </div>

      {/* SEARCHBAR */}
      <SearchAutocomplete />

      {/* STATS & PLACES */}
      <div className={styles.statsPlaces}>
        <Account />

        <Stats />

        <Places>
          <PlaceList />
          <PlacesFilter />
        </Places>
      </div>
    </nav>
  );
}

export default Nav;
