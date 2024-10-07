import { createContext, useContext, useReducer } from "react";

const MapContext = createContext();

const initialState = {
  coordinates: null,
  initialPosition: { lat: 37.0164626, lng: -7.9351983 }, // default to Rome
  selectedPlacePosition: null,
  isOpen: false,
  isDarkMode: true,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: false,
  clickableIcons: false,
};

const darkMap = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

const defaultMap = [];

const darkMapOption = {
  ...mapOptions,
  styles: darkMap,
};

const defaultMapOption = {
  ...mapOptions,
  styles: defaultMap,
};

function reducer(state, action) {
  switch (action.type) {
    case "search/done":
      return {
        ...state,
        coordinates: action.payload,
        selectedPlacePosition: null,
      };

    case "map/clicked":
      return {
        ...state,
        coordinates: action.payload,
        isOpen: false,
        selectedPlacePosition: null,
      };

    case "marker/clicked":
      return { ...state, isOpen: action.payload };

    case "popup/close":
      return { ...state, isOpen: action.payload };

    case "darkmode/change":
      return { ...state, isDarkMode: !state.isDarkMode };

    case "place/selected":
      return { ...state, selectedPlacePosition: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function MapProvider({ children }) {
  const [
    {
      initialPosition,
      coordinates,
      isOpen,
      markerPosition,
      isDarkMode,
      selectedPlacePosition,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <MapContext.Provider
      value={{
        coordinates,
        isOpen,
        markerPosition,
        initialPosition,
        dispatch,
        darkMapOption,
        defaultMapOption,
        isDarkMode,
        selectedPlacePosition,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

function useMap() {
  const context = useContext(MapContext);
  if (context === undefined)
    throw new Error("Map context was used outside the MapProvider");
  return context;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { MapProvider, useMap };
