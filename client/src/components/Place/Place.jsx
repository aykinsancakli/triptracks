import { useNavigate, useParams } from "react-router-dom";
import styles from "./Place.module.scss";
import { usePlaces } from "../../contexts/PlacesContext";
import { useEffect } from "react";
import Spinner from "../Spinner/Spinner";
import { useWeather } from "../../contexts/WeatherContext";
import { useCountry } from "../../contexts/CountryContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function Place() {
  const { id } = useParams();
  const { getPlace, currentPlace, isLoading } = usePlaces();
  const { formImgUrl, isLoading: isLoadingWeather } = useWeather();

  const navigate = useNavigate();

  useEffect(
    function () {
      getPlace(id);
    },
    [id, getPlace]
  );

  const { placeName, country, position, date, notes } = currentPlace;

  return (
    <div className={styles.place}>
      <div className={styles.placeWrapper}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {/* IMAGE */}
            <div className={styles.formImg}>
              {isLoadingWeather ? (
                <Spinner />
              ) : (
                <>
                  <h2>
                    <span>A photo from {placeName}</span>
                  </h2>
                  <img src={formImgUrl} alt={`Picture of ${placeName}`} />
                </>
              )}
            </div>

            {/* PLACE HEADER */}
            <div className={styles.placeHeader}>
              <img src={currentPlace.flag} alt={`Flag of ${country}`} />
              <h2>
                <span>
                  {placeName}, {country}
                </span>
              </h2>
            </div>

            <div className={styles.placeBody}>
              {/* PLACE INFO ROWS */}
              <div className={styles.placeInfoRow}>
                <span>You went to {placeName} on </span>
                <p>{formatDate(date || null)}</p>
              </div>

              <div className={styles.placeInfoRow}>
                <span>Your notes</span>
                {notes ? (
                  <p>{notes}</p>
                ) : (
                  <p>No notes available for this trip.</p>
                )}
              </div>

              <div className={styles.placeInfoRow}>
                <span>Learn more</span>
                <a
                  href={`https://en.wikipedia.org/wiki/${country}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check out {placeName} on Wikipedia &rarr;
                </a>
              </div>

              <div>
                <button
                  className={styles.backBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/app?lat=${position.lat}&lng=${position.lng}`);
                  }}
                >
                  &larr; Back
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Place;
