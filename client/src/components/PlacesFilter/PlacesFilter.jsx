import { usePlaces } from "../../contexts/PlacesContext";
import styles from "./PlacesFilter.module.scss";
import { useState } from "react";

import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortNumericDown,
  FaSortNumericUp,
} from "react-icons/fa";

function PlacesFilter() {
  const { places, dispatch } = usePlaces();
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Sorting function
  const handleSort = (criteria) => {
    // Toggle order if the same criteria is clicked
    const newSortOrder =
      criteria === sortCriteria && sortOrder === "asc" ? "desc" : "asc";

    setSortCriteria(criteria);
    setSortOrder(newSortOrder);

    let sortedPlaces = [...places];

    if (criteria === "date") {
      sortedPlaces.sort((a, b) =>
        newSortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
    } else if (criteria === "name") {
      sortedPlaces.sort((a, b) =>
        newSortOrder === "asc"
          ? a.country.localeCompare(b.country)
          : b.country.localeCompare(a.country)
      );
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
        {places.length > 1 && (
          <>
            <p>Sort by</p>
            <button onClick={() => handleSort("name")}>
              <span>Name</span>
              {sortCriteria === "name" && sortOrder === "asc" ? (
                <FaSortAlphaUp />
              ) : (
                <FaSortAlphaDown />
              )}
            </button>
            <button onClick={() => handleSort("date")}>
              <span>Date</span>
              {sortCriteria === "date" && sortOrder === "asc" ? (
                <FaSortNumericUp />
              ) : (
                <FaSortNumericDown />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PlacesFilter;
