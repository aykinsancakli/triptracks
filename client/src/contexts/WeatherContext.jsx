import { createContext, useCallback, useContext, useReducer } from "react";

// ----- WEATHER CONTEXT -----

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create context
const WeatherContext = createContext();

// Set initial state
const initialState = {
  isLoading: false,
  placeName: null,
  degree: null,
  description: null,
  icon: null,
  date: null,
  time: null,
  imgUrl: null,
  formImgUrl: null,
  error: "",
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    // Weather data loading state
    case "data/loading":
      return { ...state, isLoading: true };

    // Weather data loaded state
    case "weather/loaded":
      return {
        ...state,
        placeName: action.payload.name,
        degree: action.payload.main.temp.toFixed(0),
        description: action.payload.weather[0].main,
        icon: action.payload.weather[0].icon,
      };

    // Time data loaded state
    case "time/loaded":
      return {
        ...state,
        date: action.payload.date,
        time: action.payload.time,
      };

    // Image data loaded state
    case "image/loaded":
      return {
        ...state,
        imgUrl: action.payload.weatherImageUrl,
        formImgUrl: action.payload.formImageUrl,
      };

    // All data loaded state
    case "data/ready":
      return { ...state, isLoading: false, error: "" };

    // Error state
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    // Unknown action state
    default:
      throw new Error("Unknown action type");
  }
}

// Provider function
function WeatherProvider({ children }) {
  const [
    {
      isLoading,
      placeName,
      degree,
      description,
      icon,
      date,
      time,
      imgUrl,
      formImgUrl,
      error,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Get weather info (useCallback to prevent infitine re-render => (new reference))
  const getWeather = useCallback(async (lat, lng) => {
    if (!lat || !lng) return;

    dispatch({ type: "data/loading" });

    try {
      // Fetch weather data from server
      const weatherRes = await fetch(
        `${BASE_URL}/weather/by-coordinates?lat=${lat}&lng=${lng}`
      );

      if (weatherRes.status === 404) {
        const weatherResBody = await weatherRes.json();
        throw new Error(weatherResBody.message);
      }

      const weatherData = await weatherRes.json();
      dispatch({ type: "weather/loaded", payload: weatherData });

      // Fetch time data from server
      const timeRes = await fetch(
        `${BASE_URL}/weather/time/by-coordinates?lat=${lat}&lng=${lng}`
      );

      if (!timeRes.ok) throw new Error("Failed to fetch time data");

      const timeData = await timeRes.json();

      // City e.g Rome
      const city = timeData.timezone.split("/")[1];

      // Find corresponding data
      const dateVal = timeData.date.replaceAll("-", ".");
      const timeVal = timeData.datetime;

      // Internationalize the date format based on the user's locale
      const userLocale = navigator.language;

      const date = new Intl.DateTimeFormat(userLocale, {
        dateStyle: "medium",
      }).format(new Date(dateVal));

      const time = timeVal.split(" ")[1].slice(0, 5);

      dispatch({ type: "time/loaded", payload: { time, date } });

      // Fetch image data from server
      const imageRes = await fetch(
        `${BASE_URL}/weather/image?place=${weatherData.name}&city=${city}` // We get city from time data above
      );

      if (!imageRes.ok) throw new Error("Failed to fetch image data");

      const imageData = await imageRes.json();
      dispatch({ type: "image/loaded", payload: imageData });

      // Mark all data as ready
      dispatch({ type: "data/ready" });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        isLoading,
        placeName,
        degree,
        description,
        icon,
        date,
        time,
        imgUrl,
        getWeather,
        formImgUrl,
        error,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

// Custom hook to use Weather Context
function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined)
    throw new Error("Weather context was used outside the WeatherProvider");
  return context;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { WeatherProvider, useWeather };
