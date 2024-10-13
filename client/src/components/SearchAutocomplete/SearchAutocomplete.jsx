import { useState } from "react";
import styles from "./SearchAutocomplete.module.scss";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useMap } from "../../contexts/MapContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearchLocation } from "react-icons/fa";

function SearchAutocomplete() {
  const [address, setAddress] = useState("");

  // Map Provider
  const { dispatch } = useMap();

  // React Router
  const navigate = useNavigate();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    dispatch({ type: "search/done", payload: ll });

    // This URL change triggers country and weather fetching automatically :)
    navigate(`/app?lat=${ll.lat}&lng=${ll.lng}`);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.formWrapper} key={suggestions.description}>
          <div className={styles.form}>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
              disabled={isFormPage}
              className={`${isFormPage ? `${styles.inputDisabled}` : ""}`}
            />
            <button
              disabled={isFormPage}
              className={`${isFormPage ? `${styles.btnDisabled}` : ""}`}
            >
              <FaSearchLocation size={20} />
              Search
            </button>
          </div>
          <div className={styles.autoDropdown}>
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#373535ea", cursor: "pointer" }
                : { backgroundColor: "#1d1b1b", cursor: "pointer" };
              return (
                <div
                  key={suggestion.description}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{loading ? `Loading...` : suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

export default SearchAutocomplete;
