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

const messages = ["Terrible", "Bad", "Normal", "Good", "Amazing"];

function Form() {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [userRating, setUserRating] = useState(null);
  const rating = messages[userRating - 1];

  const [lat, lng] = useUrlPosition();

  const { country, flag } = useCountry();
  const { placeName, formImgUrl } = useWeather();
  const { createPlace } = usePlaces();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!placeName && !date) return;

    console.log(flag);

    const newPlace = {
      placeName,
      country,
      flag,
      date: date.toISOString(),
      notes,
      rating,
      position: { lat, lng },
      userId: "64321f08b91d9c2e4cb6e023", // Add userId here for now
    };

    await createPlace(newPlace);
    navigate(-1);
  }

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  return (
    <form
      className={`${styles.form} ${isFormPage ? styles.fullLength : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.formWrapper}>
        <div className={styles.formImg}>
          <h2>
            <span>A photo from {placeName}</span>
          </h2>
          <img src={formImgUrl} alt={`Picture of ${placeName}`} />
        </div>

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
            size={28}
            color="#84cc16"
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
    </form>
  );
}

export default Form;
