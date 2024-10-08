import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

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

  // Get country info data
  const getCountryDataByName = useCallback(async function getCountryDataByName(
    name
  ) {
    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);

      if (!res.ok) throw new Error("Country not found");

      const [data] = await res.json();

      // Destructure data
      const flag = data.flags.svg;
      const countryName = data.name.common;
      const [region] = data.continents;
      const [capital] = data.capital;
      const [language] = Object.values(data.languages);
      const population = data.population.toString().slice(0, 2);
      const currency = Object.values(data.currencies)[0].name;
      const [capLat, capLng] = Object.values(data.capitalInfo.latlng);

      // Create brand new object to return
      const country = {
        flag,
        countryName,
        region,
        capital,
        language,
        population,
        currency,
        capLat,
        capLng,
      };

      // Return the country object
      return country;
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: err.message,
      });
    }
  },
  []);

  // Get country info (useCallback to prevent infitine re-render => (new reference))
  const getCountry = useCallback(
    async function getCountry(lat, lng) {
      // Check if coordinates are the same as last fetched
      if (
        lastFetchedCoords.current.lat === lat &&
        lastFetchedCoords.current.lng === lng
      ) {
        // console.log("Coordinates are the same. Skipping fetch.");
        return; // Skip the fetch
      }

      dispatch({ type: "data/loading" });
      try {
        const res = await fetch(
          `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${
            import.meta.env.VITE_BIG_DATA_CLOUD_API_KEY
          }`
        );

        if (!res.ok) throw new Error("Failed to reverse geocode location");

        // Fetch country name data
        const countryNameData = await res.json();
        dispatch({
          type: "countryName/ready",
          payload: countryNameData.countryName,
        });

        // Fetch country info data
        const countryData = await getCountryDataByName(
          countryNameData.countryName || "spain"
        );

        // IF COUNTRY NAME NOT EXISTS DO ANOTHER ACTION LIKE NOT EXISTS AND RETURN THE SAME STATE OR A MESSAGE LIKE THERE IS NO COUNTRY LIKE THAT ETC

        dispatch({ type: "data/ready", payload: countryData });

        // Update last fetched coordinates
        lastFetchedCoords.current = { lat, lng };
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: err.message,
        });
      }
    },
    [getCountryDataByName]
  );

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
