import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Fetch the base URL from the .env file

// ----- COUNTRY CONTEXT -----

// Create Context
const CountryContext = createContext();

// Set initial state
const initialState = {
  isLoading: false,
  country: null,
  flag: null,
  continent: null,
  capital: null,
  language: null,
  population: null,
  currency: null,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    // Country data loading state
    case "data/loading":
      return { ...state, isLoading: true };

    // Country name data ready state
    case "countryName/ready":
      return { ...state, countryName: action.payload };

    // Country data ready state
    case "data/ready":
      return {
        ...state,
        isLoading: false,
        country: action.payload.countryName,
        flag: action.payload.flag,
        continent: action.payload.region,
        capital: action.payload.capital,
        language: action.payload.language,
        population: action.payload.population,
        currency: action.payload.currency,
      };

    // Error state
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    // Unknown action state
    default:
      throw new Error("Unknown action type");
  }
}

// Provider function
function CountryProvider({ children }) {
  const [
    {
      isLoading,
      country,
      flag,
      continent,
      capital,
      language,
      population,
      currency,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Store last fetched coordinates
  const lastFetchedCoords = useRef({ lat: null, lng: null });

  // Get country info data by name
  const getCountryDataByName = useCallback(async function getCountryDataByName(
    name
  ) {
    try {
      const res = await fetch(`${BASE_URL}/country/${name}`);

      if (!res.ok) throw new Error("Country not found");

      const data = await res.json();
      return data;
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  },
  []);

  // Get country info by coordinates (useCallback to prevent infitine re-render => (new reference))
  const getCountry = useCallback(async function getCountry(lat, lng) {
    if (
      lastFetchedCoords.current.lat === lat &&
      lastFetchedCoords.current.lng === lng
    ) {
      return; // Skip the fetch
    }

    dispatch({ type: "data/loading" });

    try {
      const res = await fetch(`${BASE_URL}/country/${lat}/${lng}`);

      if (!res.ok) throw new Error("Failed to reverse geocode location");

      const countryData = await res.json();

      dispatch({ type: "data/ready", payload: countryData });

      lastFetchedCoords.current = { lat, lng };
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }, []);

  return (
    <CountryContext.Provider
      value={{
        isLoading,
        country,
        flag,
        continent,
        capital,
        language,
        population,
        currency,
        getCountry,

        dispatch,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

// Custom hook to use Country Context
function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined)
    throw new Error("Country context was used outside the CountryProvider");
  return context;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { CountryProvider, useCountry };
