import Spinner from "../Spinner/Spinner";
// import styles from "./PlaceList.module.scss";
import { usePlaces } from "../../contexts/PlacesContext";
import Message from "../Message/Message";
import PlaceItem from "../PlaceItem/PlaceItem";

function PlaceList() {
  const { places, isLoading } = usePlaces();

  return (
    <ul>
      {isLoading && <Spinner />}

      {!places.length && <Message message="No bookmarks yet." />}

      {places.map((place) => (
        <PlaceItem place={place} key={place._id} />
      ))}
    </ul>
  );
}

export default PlaceList;
