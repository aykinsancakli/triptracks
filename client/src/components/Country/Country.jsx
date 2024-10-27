import { useEffect, useState } from "react";
import { useUrlPosition } from "../../hooks/useUrlPosition";

import styles from "./Country.module.scss";

import {
  IoHomeOutline,
  IoLanguageOutline,
  IoEarthOutline,
} from "react-icons/io5";
import { BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { MdCurrencyExchange } from "react-icons/md";
import { useCountry } from "../../contexts/CountryContext";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import { Link, useNavigate } from "react-router-dom";
import { useWeather } from "../../contexts/WeatherContext";
import { usePlaces } from "../../contexts/PlacesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function Country() {
  const {
    isLoading,
    country,
    flag,
    continent,
    capital,
    language,
    population,
    currency,
    getCountry,
    error,
  } = useCountry();
  const { placeName } = useWeather();

  const { places } = usePlaces();

  const [isSaved, setIsSaved] = useState(false);
  const [savedPlace, setSavedPlace] = useState(null);

  // URL change on map click triggers re-render
  const [lat, lng] = useUrlPosition();

  // Fetch all related data (Country provider provides getCountry func)
  useEffect(() => {
    if (lat && lng) getCountry(lat, lng);
  }, [lat, lng, getCountry]);

  // Check if the current place is already saved
  useEffect(() => {
    if (lat && lng) {
      const savedPlace = places.find(
        (place) =>
          place.position.lat === Number(lat) &&
          place.position.lng === Number(lng)
      );
      setIsSaved(!!savedPlace); // Set isSaved to true if the place is found
      setSavedPlace(savedPlace);
    }
  }, [lat, lng, places]);

  const navigate = useNavigate(); // Initialize navigate

  const handleButtonClick = () => {
    // Navigate to the form page with lat and lng as query parameters
    if (!isSaved && lat && lng) {
      navigate(`form?lat=${lat}&lng=${lng}`);
    }
  };

  return (
    <div className={styles.country}>
      <div className={styles.countryWrapper}>
        {isLoading ? (
          <Spinner message="Loading country..." />
        ) : error ? (
          <div className={styles.error}>
            <Message message={error} />
          </div>
        ) : (
          <>
            {/* COUNTRY HEADER */}
            <div className={styles.countryHeader}>
              <img src={flag} alt={`Flag of ${country}`} />

              <h2>
                <span>
                  {placeName}, {country}
                </span>
              </h2>
            </div>

            {/* COUNTRY BODY */}
            <div className={styles.countryBody}>
              {/* VISITED LABEL FOR COUNTRY BODY */}
              {savedPlace && isSaved && (
                <>
                  <div className={styles.visitedLabel}>
                    Visited on {formatDate(savedPlace.date)}
                  </div>
                  <Link
                    className={styles.details}
                    to={`places/${savedPlace._id}?lat=${lat}&lng=${lng}`}
                  >
                    <button>Details &rarr;</button>
                  </Link>
                </>
              )}

              {/* BOOKMARKS BUTTON */}
              <button
                className={styles.likeBtn}
                onClick={() => {
                  setIsSaved((isSaved) => !isSaved);
                  handleButtonClick(); // Call the navigation on button click
                }}
                disabled={isSaved}
              >
                <div className={styles.heartBg}>
                  <div
                    className={
                      isSaved
                        ? `${styles.heartIcon} ${styles.liked}`
                        : `${styles.heartIcon}`
                    }
                  >
                    <div className={styles.likePopup}>
                      {!isSaved && (
                        <p>
                          <span>Save this place</span>
                          <BsBookmarkCheck className={styles.bookmark} />
                        </p>
                      )}
                      {isSaved && (
                        <p>
                          <span>Place is saved</span>
                          <BsBookmarkCheckFill className={styles.bookmark} />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* COUNTRY INFO ROWS */}
              <div className={styles.countryInfoRow}>
                <IoEarthOutline className={styles.globe} />
                <span>{continent}</span>
              </div>

              <div className={styles.countryInfoRow}>
                <IoHomeOutline className={styles.home} />
                <span>{capital}</span>
              </div>

              <div className={styles.countryInfoRow}>
                <IoLanguageOutline className={styles.language} />
                <span>{language}</span>
              </div>

              <div className={styles.countryInfoRow}>
                <GoPerson className={styles.population} />
                <span>{population} million</span>
              </div>

              <div className={styles.countryInfoRow}>
                <MdCurrencyExchange className={styles.currency} />
                <span>{currency}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Country;
