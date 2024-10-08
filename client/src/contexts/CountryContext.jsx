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
  error: "",
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
        error: "",
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
      error,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Store last fetched coordinates
  const lastFetchedCoords = useRef({ lat: null, lng: null });

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
      const countryRes = await fetch(`${BASE_URL}/country/${lat}/${lng}`);

      if (countryRes.status === 404) {
        const countryResBody = await countryRes.json();
        throw new Error(countryResBody.message);
      }

      const countryData = await countryRes.json();

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
        error,

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
