import styles from "./Nav.module.scss";

import SearchAutocomplete from "../SearchAutocomplete/SearchAutocomplete";
import Logo from "../Logo/Logo";
import Stats from "../Stats/Stats";
import Places from "../Places/Places";
import PlaceList from "../PlaceList/PlaceList";
import PlacesFilter from "../PlacesFilter/PlacesFilter";
import Account from "../Account/Account";
import { useState } from "react";

function Nav() {
  const [openBox, setOpenBox] = useState(null);

  const toggleBox = (box) => {
    setOpenBox((prevBox) => (prevBox === box ? null : box));
  };
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
        <Account
          isOpen={openBox === "account"}
          onToggle={() => toggleBox("account")}
        />

        <Stats
          isOpen={openBox === "stats"}
          onToggle={() => toggleBox("stats")}
        />

        <Places>
          <PlaceList />
          <PlacesFilter />
        </Places>
      </div>
    </nav>
  );
}

export default Nav;
