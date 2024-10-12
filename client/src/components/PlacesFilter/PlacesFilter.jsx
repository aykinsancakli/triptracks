import { usePlaces } from "../../contexts/PlacesContext";
import styles from "./PlacesFilter.module.scss";
import { useState } from "react";

function PlacesFilter() {
  const { places, dispatch } = usePlaces();
  const [sortCriteria, setSortCriteria] = useState(null);

  // Sorting function
  const handleSort = (criteria) => {
    setSortCriteria(criteria);

    let sortedPlaces = [...places];

    if (criteria === "date") {
      sortedPlaces.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date
    } else if (criteria === "name") {
      sortedPlaces.sort((a, b) => a.country.localeCompare(b.country)); // Sort by alphabetical order
    }

    dispatch({
      type: "places/sorted",
      payload: sortedPlaces,
    });
  };

  return (
    <div className={styles.placesFilter}>
      <h2>Your trip history</h2>
      <div>
        <button onClick={() => handleSort("name")}>Sort by name</button>
        <button onClick={() => handleSort("date")}>Sort by date</button>
      </div>
    </div>
  );
}

export default PlacesFilter;
