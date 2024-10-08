import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./PlaceItem.module.scss";
import { usePlaces } from "../../contexts/PlacesContext";
import { useMap } from "../../contexts/MapContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function PlaceItem({ place }) {
  const { currentPlace, deletePlace } = usePlaces();
  const { placeName, country, flag, date, _id, position } = place;

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  // Convert position to number
  const posNum = {
    lat: Number(position.lat),
    lng: Number(position.lng),
  };

  const { dispatch } = useMap();

  const navigate = useNavigate();

  async function handleClick(e) {
    e.preventDefault();
    await deletePlace(_id);
    navigate(`/app?lat=${posNum.lat}&lng=${posNum.lng}`);
  }

  function handleLinkClick() {
    dispatch({ type: "place/selected", payload: posNum });
  }

  return (
    <li>
      <Link
        className={`${styles.placeItem} ${
          _id === currentPlace._id ? styles["placeItem--active"] : ""
        } ${isFormPage ? styles.disabledLink : ""}`}
        to={`places/${_id}?lat=${position.lat}&lng=${position.lng}`}
        onClick={handleLinkClick}
      >
        <img className={styles.flag} src={flag} alt={`Flag of ${placeName}`} />
        <div>
          <h3 className={styles.name}>
            {country}, {placeName}
          </h3>
          <time className={styles.date}>{formatDate(date)}</time>
        </div>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default PlaceItem;
