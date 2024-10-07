import { createContext, useCallback, useContext, useReducer } from "react";

// ----- WEATHER CONTEXT -----

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
        date: action.payload?.date,
        time: action.payload?.time,
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
      return { ...state, isLoading: false };

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
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Get weather info (useCallback to prevent infitine re-render => (new reference))
  const getWeather = useCallback(async function getWeather(lat, lng) {
    dispatch({ type: "data/loading" });
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${
          import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY
        }&units=metric`
      );

      if (!res.ok) throw new Error("Weather data not available");

      // Fetch weather data
      const weatherData = await res.json();
      dispatch({ type: "weather/loaded", payload: weatherData });

      // Fetch time data
      const timeData = await getTime(lat, lng);
      dispatch({ type: "time/loaded", payload: timeData });

      // Fetch image data
      // const imageData = await getImage(weatherData.name, timeData.city); // weatherData.name = (city name)
      // dispatch({ type: "image/loaded", payload: imageData });

      // All ready
      dispatch({ type: "data/ready" });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: err.message,
      });
    }
  }, []);

  // Get time info
  async function getTime(lat, lng) {
    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lng}`,
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_API_NINJAS_API_KEY,
          },
        }
      );

      if (!res.ok) throw new Error("Time data not available");

      const data = await res.json();

      // City e.g Rome
      const city = data.timezone.split("/")[1];

      // Find corresponding data
      const dateRes = data.date.replaceAll("-", ".");
      const timeRes = data.datetime;

      // Internationalize the date format based on the user's locale
      const userLocale = navigator.language;

      const date = new Intl.DateTimeFormat(userLocale, {
        dateStyle: "medium",
      }).format(new Date(dateRes));

      const time = timeRes.split(" ")[1].slice(0, 5);

      return { date, time, city };
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: err.message,
      });
    }
  }

  // Get image from unsplash
  async function getImage(place, city) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${
          import.meta.env.VITE_UNSPLASH_API_KEY
        }&query=${`${city}, ${place}`}`
      );

      if (!res.json) throw new Error("City image not available");
      const data = await res.json();

      // Image selection
      const randomNum = Math.trunc(Math.random() * 7) + 1;

      console.log(data.results);

      const weatherImageUrl = data.results[randomNum + 1].urls.regular;

      const formImageUrl = data.results[randomNum - 1].urls.regular;

      return { weatherImageUrl, formImageUrl };
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: err.message,
      });
    }
  }

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
