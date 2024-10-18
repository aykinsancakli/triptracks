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

  // Search options to restrict search to cities and countries only
  const searchOptions = {
    types: ["(regions)"], // Can use "(regions)" to include countries
    language: "en", // Restrict search to English results
  };

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
      searchOptions={searchOptions} // Pass search options
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <input
              {...getInputProps({
                placeholder: "Search Cities or Countries ...", // Adjusted placeholder text
                className: "location-search-input",
              })}
              disabled={isFormPage}
              className={`${isFormPage ? `${styles.inputDisabled}` : ""}`}
            />
            <button
              disabled={isFormPage}
              className={`${isFormPage ? `${styles.btnDisabled}` : ""}`}
            >
              <FaSearchLocation size={24} />
            </button>
          </div>
          <div className={styles.autoDropdown}>
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#1d1b1b", cursor: "pointer" }
                : { backgroundColor: "#373535ea", cursor: "pointer" };
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
