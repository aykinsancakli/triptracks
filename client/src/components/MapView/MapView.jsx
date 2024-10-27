import React, { useCallback, useEffect, useRef, useState } from "react";

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useMap } from "../../contexts/MapContext";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./MapView.module.scss";
import markerGreen from "../../assets/marker-green.png";
import markerRed from "../../assets/marker-red.png";
import pinRed from "../../assets/pin-red.png";

import { CiDark, CiLight } from "react-icons/ci";
import { usePlaces } from "../../contexts/PlacesContext";
import { useUrlPosition } from "../../hooks/useUrlPosition";

function MapView() {
  // Map Provider
  const {
    coordinates,
    initialPosition,
    darkMapOption,
    defaultMapOption,
    dispatch,
    isDarkMode,
    selectedPlacePosition,
  } = useMap();

  // React Router
  const navigate = useNavigate();

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");
  const isPlacesPage = location.pathname.includes("/places");

  const [lat, lng] = useUrlPosition();
  const urlPosition = { lat: Number(lat), lng: Number(lng) };

  // Ref
  const mapRef = useRef();
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const { places, isLoading } = usePlaces();
  const [markers, setMarkers] = useState([]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindowVisible, setInfoWindowVisible] = useState(false);

  // Modify the handleMarkerClick function to set selected marker and its corresponding place details
  const handleMarkerClick = (marker) => {
    const place = places.find(
      (place) =>
        place.position.lat === marker.position.lat &&
        place.position.lng === marker.position.lng
    );

    if (place) {
      setSelectedMarker({
        ...marker,
        flag: place.flag,
        place: place.placeName,
      });
    }

    // Navigate to the URL with the marker's position when clicked
    navigate(`/app?lat=${marker.position.lat}&lng=${marker.position.lng}`);

    setInfoWindowVisible(true);
  };

  // Effect to update markers when places change
  useEffect(() => {
    if (places.length > 0) {
      const updatedMarkers = places.map((place) => ({
        id: place.id,
        position: {
          lat: Number(place.position.lat),
          lng: Number(place.position.lng),
        },
      }));

      // Update markers state
      setMarkers(updatedMarkers);
    } else {
      // Reset markers if no places
      setMarkers([]);
    }
  }, [places]);

  const handleMapClick = (event) => {
    setInfoWindowVisible(false);

    const { lat, lng } = event.latLng.toJSON();
    dispatch({ type: "map/clicked", payload: { lat, lng } });
    navigate(`/app?lat=${lat}&lng=${lng}`);
  };

  // Effect to set the initial URL if lat and lng are not present
  useEffect(() => {
    if (isLoading) return;

    const lat = urlPosition.lat;
    const lng = urlPosition.lng;

    // If no lat and lng in URL, change URL (?lat&lng) => (initial load)
    if ((!lat || !lng) && places.length === 0) {
      navigate(`/app?lat=${initialPosition.lat}&lng=${initialPosition.lng}`, {
        replace: true,
      });
    }

    if ((!lat || !lng) && places.length > 0) {
      const latestPlace = places[places.length - 1];
      const latestLat = Number(latestPlace.position.lat);
      const latestLng = Number(latestPlace.position.lng);

      navigate(`/app?lat=${latestLat}&lng=${latestLng}`, { replace: true });
    }
  }, [
    initialPosition,
    navigate,
    places,
    urlPosition.lat,
    urlPosition.lng,
    isLoading,
  ]);

  // Effect to smoothly center the map using `panTo`
  useEffect(() => {
    if (mapRef.current && coordinates) {
      mapRef.current.panTo(coordinates); // This smoothly pans the map
    }
  }, [coordinates]);

  // Automatically open InfoWindow for the marker based on URL lat/lng
  useEffect(() => {
    if (isPlacesPage && lat && lng) {
      const marker = markers.find(
        (marker) =>
          marker.position.lat === Number(lat) &&
          marker.position.lng === Number(lng)
      );

      if (marker) {
        const place = places.find(
          (place) =>
            place.position.lat === Number(lat) &&
            place.position.lng === Number(lng)
        );

        if (place) {
          setSelectedMarker({
            ...marker,
            flag: place.flag,
            place: place.placeName,
          });
          setInfoWindowVisible(true); // Show the InfoWindow for the selected marker
        }
      }
    }
  }, [isPlacesPage, lat, lng, markers, places]);

  return (
    <div className={`${styles.mapview} ${isFormPage ? styles.waiting : ""}`}>
      {/* DARK AND LIGHT MAP THEME */}
      <button
        onClick={() => dispatch({ type: "darkmode/change" })}
        disabled={isFormPage} // Disable the button if on the /form page
      >
        {isDarkMode ? (
          <CiDark className={styles.mode} />
        ) : (
          <CiLight className={styles.mode} />
        )}
      </button>

      {/* GOOGLE MAP */}
      <GoogleMap
        mapContainerClassName={styles.mapContainer}
        options={{
          ...(isDarkMode ? darkMapOption : defaultMapOption),
          draggable: !isFormPage, // Disable dragging if on the /form page
        }}
        zoom={isFormPage ? 11 : 10} // Zoom in when the /form page is open
        center={
          isFormPage
            ? urlPosition || initialPosition // Use coordinates if on the form page
            : places.length > 0
            ? urlPosition ||
              selectedPlacePosition ||
              selectedMarker?.position || {
                lat: Number(places[places.length - 1].position.lat), // Center on the latest place
                lng: Number(places[places.length - 1].position.lng),
              }
            : urlPosition || coordinates || initialPosition // Fallback to initial position if no places exist
        }
        onLoad={onLoad}
        onClick={isFormPage ? null : handleMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={marker.position}
            icon={{
              url: isDarkMode ? markerGreen : markerRed,
              scaledSize: new window.google.maps.Size(32, 42.56),
            }}
            onClick={() => handleMarkerClick(marker)} // Trigger InfoWindow on marker click
            clickable={!isFormPage}
          />
        ))}

        {infoWindowVisible && selectedMarker && isPlacesPage && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setInfoWindowVisible(false)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -30),
            }}
          >
            <div className={styles.infoWindow}>
              <h2>
                {selectedMarker.place.length > 10
                  ? `${selectedMarker.place.slice(0, 10)}...`
                  : selectedMarker.place}
              </h2>
              <img
                src={selectedMarker.flag}
                alt={`${selectedMarker.country} flag`}
                style={{ width: "30px", height: "20px" }}
              />
            </div>
          </InfoWindow>
        )}

        {/* Conditionally render marker when on the /form page */}
        {isFormPage && urlPosition.lat && urlPosition.lng && (
          <Marker
            position={urlPosition}
            icon={{
              url: pinRed,
              scaledSize: new window.google.maps.Size(45, 57.825),
            }}
            clickable={!isFormPage}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default React.memo(MapView);
