import { useEffect } from "react";

import styles from "./Weather.module.scss";
import Spinner from "../Spinner/Spinner";

import { IoCalendarOutline } from "react-icons/io5";
import { WiTime10 } from "react-icons/wi";

import { useUrlPosition } from "../../hooks/useUrlPosition";
import { useWeather } from "../../contexts/WeatherContext";
import Message from "../Message/Message";

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

  //  Fetch all related data (Weather provider provides getWeather func)
  useEffect(() => {
    getWeather(lat, lng);
  }, [getWeather, lat, lng]);

  return (
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
                alt="img"
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
  );
}

export default Weather;
