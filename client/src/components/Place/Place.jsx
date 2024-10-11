import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./Place.module.scss";
import { usePlaces } from "../../contexts/PlacesContext";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";

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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(
    function () {
      getPlace(id);
    },
    [id, getPlace]
  );

  const { placeName, country, position, date, notes, rating, photoUrl } =
    currentPlace;

  // Use location from React Router to check if the current URL contains '/place'
  const location = useLocation();
  const isPlacePage = location.pathname.includes("/place");

  return (
    <div className={`${styles.place} ${isPlacePage ? styles.fullLength : ""}`}>
      <div className={styles.placeWrapper}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {/* IMAGE */}
            {isOpen && (
              <div className={styles.formImg}>
                {photoUrl ? ( // Check if image exists
                  <div>
                    <span
                      className={styles.times}
                      onClick={() => setIsOpen(false)}
                    >
                      &times;
                    </span>
                    <h2>
                      <span>A photo from {placeName}</span>
                    </h2>
                    <img src={photoUrl} alt={`Picture of ${placeName}`} />
                  </div>
                ) : (
                  <h2>No image available for this place.</h2>
                )}
              </div>
            )}

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
                <span>Your trip was</span>
                {rating ? (
                  <p>{rating}</p>
                ) : (
                  <p>No rating available for this trip.</p>
                )}
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
                <span>Photos from your trip</span>
                {photoUrl ? (
                  <div
                    className={styles.imgWrap}
                    onClick={() => setIsOpen((isOpen) => !isOpen)}
                  >
                    <span>{!isOpen ? "enlarge" : "shrink"}</span>
                    <img src={photoUrl} alt="saved image" />
                  </div>
                ) : (
                  <p>No photos available for this trip.</p>
                )}
              </div>

              <div className={styles.placeInfoRow}>
                <span>Learn more</span>
                <a
                  href={`https://en.wikipedia.org/wiki/${placeName}`}
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
