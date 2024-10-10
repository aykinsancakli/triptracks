import { useEffect } from "react";

import styles from "./Weather.module.scss";
import Spinner from "../Spinner/Spinner";

import { IoCalendarOutline } from "react-icons/io5";
import { WiTime10 } from "react-icons/wi";

import { useUrlPosition } from "../../hooks/useUrlPosition";
import { useWeather } from "../../contexts/WeatherContext";
import Message from "../Message/Message";
import { useLocation } from "react-router-dom";

function Weather() {
  const {
    isLoading,
    placeName,
    degree,
    description,
    icon,
    date,
    time,
    imgUrl,
    getWeather,
    error,
  } = useWeather();

  // URL change on map click triggers re-render
  const [lat, lng] = useUrlPosition();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");
  const isPlacePage = location.pathname.includes("/places");

  //  Fetch all related data (Weather provider provides getWeather func)
  useEffect(() => {
    getWeather(lat, lng);
  }, [getWeather, lat, lng]);

  return (
    !(isFormPage || isPlacePage) && ( // Render only if it's neither form nor place page
      <div className={styles.weather}>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className={styles.error}>
            <Message message={error} />
          </div>
        ) : (
          <div
            className={styles.weatherBackground}
            style={{
              backgroundImage: imgUrl && `url(${imgUrl})`,
            }}
          >
            {/* City name (HEADING) */}
            <h2 className={styles.weatherHeading}>{placeName}</h2>

            {/* Weather icon and information (BODY) */}
            <div className={styles.weatherBody}>
              <div className={styles.weatherBodyMain}>
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt="Weather icon"
                />
              </div>

              {/* Degree and weather condition */}
              <div className={styles.weatherInfo}>
                <p>
                  {degree} <span className={styles.celcius}>°C</span>
                </p>
                <span>{description}</span>
              </div>
            </div>

            {/* Date and time (FOOTER) */}
            <div className={styles.weatherFooter}>
              <div className={styles.weatherDate}>
                <IoCalendarOutline className={styles.calendar} />
                <span>{date}</span>
              </div>

              <div className={styles.weatherTime}>
                <WiTime10 className={styles.clock} />
                <span>{time}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default Weather;
