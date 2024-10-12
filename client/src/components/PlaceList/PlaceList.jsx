import Spinner from "../Spinner/Spinner";
// import styles from "./PlaceList.module.scss";
import { usePlaces } from "../../contexts/PlacesContext";
import Message from "../Message/Message";
import PlaceItem from "../PlaceItem/PlaceItem";

function PlaceList() {
  const { sortedPlaces, isLoading } = usePlaces();

  return (
    <ul>
      {isLoading && <Spinner />}

      {!sortedPlaces.length && (
        <Message message="Start by adding your favorite places!" />
      )}

      {!isLoading &&
        sortedPlaces.map((place) => (
          <PlaceItem place={place} key={place._id} />
        ))}
    </ul>
  );
}

export default PlaceList;
