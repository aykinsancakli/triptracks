import { usePlaces } from "../../contexts/PlacesContext";
import styles from "./Stats.module.scss";
import { IoStatsChart } from "react-icons/io5";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function Stats() {
  const { places } = usePlaces();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Filter out places that have photos
  const placesWithPhotos = places.filter((place) => place.photoUrl);

  // Function to handle the next photo
  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === placesWithPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle the previous photo
  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? placesWithPhotos.length - 1 : prevIndex - 1
    );
  };

  // Calculate unique countries
  const uniqueCountries = [...new Set(places.map((place) => place.country))];

  // Count total places visited
  const totalPlaces = places.length;

  // Flags
  const countryFlags = uniqueCountries.map((country) => {
    const placeWithFlag = places.find((place) => place.country === country);
    return placeWithFlag?.flag;
  });

  return (
    <div className={`${styles.stats} ${isFormPage ? styles.waiting : ""}`}>
      {/* STATS BUTTON */}
      <button
        className={`${styles.statsBtn} ${isStatsOpen ? styles.active : ""}`}
        onClick={() => setIsStatsOpen((isStatsOpen) => !isStatsOpen)}
      >
        <IoStatsChart size={32} color="#22c55e" />
        <span>Stats</span>
      </button>

      {/* ZOOMED PHOTO SLIDER */}
      {placesWithPhotos.length > 0 && isOpen && (
        <div className={styles.zoomedPhotoContainer}>
          <div className={styles.zoomedPhotoBox}>
            <img
              className={styles.zoomedPhoto}
              src={placesWithPhotos[currentPhotoIndex].photoUrl}
              alt={`Photo from ${placesWithPhotos[currentPhotoIndex].placeName}`}
            />

            <h2>
              <span>
                {placesWithPhotos[currentPhotoIndex].placeName},{" "}
                {placesWithPhotos[currentPhotoIndex].country}{" "}
                <img
                  src={placesWithPhotos[currentPhotoIndex].flag}
                  alt="Country flag"
                />{" "}
                <br />
                {formatDate(placesWithPhotos[currentPhotoIndex].date)}
              </span>
            </h2>

            {/* Close Button */}
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            {/* Previous and Next Buttons */}
            <button className={styles.prevBtn} onClick={handlePreviousPhoto}>
              &larr; {/* Left Arrow */}
            </button>

            <button className={styles.nextBtn} onClick={handleNextPhoto}>
              &rarr; {/* Right Arrow */}
            </button>
          </div>
        </div>
      )}

      {/* STATS BOX */}
      {isStatsOpen && (
        <div className={styles.statsBox}>
          {/* BTN */}
          <div className={styles.times} onClick={() => setIsStatsOpen(false)}>
            <span>&times;</span>
          </div>

          {/* Display stats */}
          <div className={styles.statsHeader}>
            <h4>STATS</h4>
            <p>
              {places.length > 0
                ? `You have visited ${uniqueCountries.length} countries and 
            ${totalPlaces} different places. 🎉`
                : `Start exploring and keep track of your amazing travels! 🌍`}
            </p>
          </div>

          {/* Display flags of visited countries */}
          <div className={styles.flagsContainer}>
            <h4>Countries Visited</h4>
            <div className={styles.flags}>
              {countryFlags.length > 0 ? (
                countryFlags.map((flagUrl, index) => (
                  <img
                    key={index}
                    src={flagUrl}
                    alt={`Flag ${uniqueCountries[index]}`}
                    className={styles.flag}
                  />
                ))
              ) : (
                <p className={styles.noFlags}>
                  Add some places to see the flags! 🎌
                </p>
              )}
            </div>
          </div>

          {/* Display uploaded photos */}
          <div className={styles.photosContainer}>
            <h4>Photos from your trips</h4>
            <div className={styles.photos}>
              {places.some((place) => place.photoUrl) ? (
                places.map((place) =>
                  place.photoUrl ? (
                    <div key={place._id} className={styles.photoItem}>
                      <div
                        className={styles.imgWrap}
                        onClick={() => {
                          setCurrentPhotoIndex(placesWithPhotos.indexOf(place));
                          setIsOpen((isOpen) => !isOpen);
                        }}
                      >
                        <span>enlarge</span>
                        <img
                          src={place.photoUrl}
                          alt={place.placeName}
                          className={styles.photo}
                        />
                      </div>
                      {/* Display placeName and country below the photo */}
                      <div className={styles.photoDetails}>
                        <span>{place.placeName}</span>
                        <img
                          className={styles.photoDetailFlag}
                          src={place.flag}
                          alt={`Flag of ${place.country}`}
                        />
                      </div>
                    </div>
                  ) : null
                )
              ) : (
                <p className={styles.noPhotos}>
                  Your travel memories will appear here! 📸
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;
