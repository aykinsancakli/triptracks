import { useLocation, useNavigate } from "react-router-dom";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import styles from "./Form.module.scss";
import { useState } from "react";
import { useCountry } from "../../contexts/CountryContext";
import { useWeather } from "../../contexts/WeatherContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePlaces } from "../../contexts/PlacesContext";
import StarRating from "../StarRating/StarRating";
import Spinner from "../Spinner/Spinner";

// Star rating messages
const messages = ["Terrible", "Bad", "Not Bad", "Good", "Amazing"];

function Form() {
  const [isOpen, setIsOpen] = useState(true);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [userRating, setUserRating] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // State for the uploaded photo
  const rating = messages[userRating - 1];

  const [lat, lng] = useUrlPosition();
  const { country, flag } = useCountry();
  const { placeName, formImgUrl } = useWeather();
  const { createPlace, isLoading } = usePlaces();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!placeName && !date) return;

    // Create FormData object to hold the data
    const formData = new FormData();
    formData.append("placeName", placeName);
    formData.append("country", country);
    formData.append("flag", flag);
    formData.append("date", date.toISOString());
    formData.append("notes", notes);
    formData.append("rating", rating);
    formData.append("position", JSON.stringify({ lat, lng }));
    if (photoFile) {
      formData.append("image", photoFile); // Append the photo file if it exists
    }

    await createPlace(formData); // Call the createPlace function with formData
    navigate(-1); // Navigate back to the previous page
  }

  // Handle photo file change
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file); // Set the selected file to the state
    }
  }

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  return (
    <form
      className={`${styles.form} ${isFormPage ? styles.fullLength : ""}`}
      onSubmit={handleSubmit}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.formWrapper}>
          {isOpen && (
            <div className={styles.formImg}>
              <div>
                <span className={styles.times} onClick={() => setIsOpen(false)}>
                  &times;
                </span>
                <h2>
                  <span>A photo from {placeName}</span>
                </h2>
                <img src={formImgUrl} alt={`Picture of ${placeName}`} />
              </div>
            </div>
          )}

          <div className={styles.row}>
            <label htmlFor="cityName">Place name</label>
            <input id="cityName" value={placeName} readOnly />
            <span className={styles.flag}>
              <img src={flag} alt="flag" />
            </span>
          </div>

          <div className={styles.row}>
            <label htmlFor="date">When did you go to {placeName}?</label>

            <DatePicker
              id="date"
              onChange={(date) => setDate(date)}
              selected={date}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="rating">How was your trip?</label>

            <StarRating
              maxRating={5}
              size={26}
              color="#22c55e"
              messages={messages}
              onSetRating={setUserRating}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="notes">Notes about your trip</label>

            <textarea
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="photo">Any photos from your trip?</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>

          <div className={styles.buttons}>
            <button className={styles.addBtn}>Add</button>
            <button
              className={styles.backBtn}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/app?lat=${lat}&lng=${lng}`);
              }}
            >
              &larr; Back
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default Form;
