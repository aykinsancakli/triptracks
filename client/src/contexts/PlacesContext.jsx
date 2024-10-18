import { createContext, useCallback, useContext, useReducer } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PlacesContext = createContext();

const initialState = {
  places: [],
  sortedPlaces: [],
  isLoading: false,
  currentPlace: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "places/loaded":
      return {
        ...state,
        isLoading: false,
        places: action.payload,
      };

    case "place/loaded":
      return { ...state, isLoading: false, currentPlace: action.payload };

    case "place/created":
      return {
        ...state,
        isLoading: false,
        places: [...state.places, action.payload],
        sortedPlaces: [...state.sortedPlaces, action.payload],
      };

    case "place/deleted":
      return {
        ...state,
        isLoading: false,
        places: state.places.filter((place) => place._id !== action.payload),
        sortedPlaces: state.sortedPlaces.filter(
          (place) => place._id !== action.payload
        ),
      };

    case "places/sorted":
      return {
        ...state,
        sortedPlaces: action.payload,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

function PlacesProvider({ children }) {
  const [{ places, sortedPlaces, isLoading, currentPlace, error }, dispatch] =
    useReducer(reducer, initialState);

  // async function fetchPlaces() {
  //   dispatch({ type: "loading" });

  //   try {
  //     const res = await fetch(`${BASE_URL}/places`, {
  //       method: "GET", // Explicitly set the method
  //       credentials: "include", // This ensures cookies (like JWT) are sent
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || "Failed to fetch places.");
  //     }

  //     const data = await res.json();
  //     dispatch({ type: "places/loaded", payload: data });
  //     dispatch({ type: "places/sorted", payload: data });
  //   } catch (error) {
  //     dispatch({
  //       type: "rejected",
  //       payload: error.message || "There was an error loading places...",
  //     });
  //   }
  // }

  const fetchPlaces = useCallback(async () => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/places`, {
        method: "GET", // Explicitly set the method
        credentials: "include", // This ensures cookies (like JWT) are sent
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch places.");
      }

      const data = await res.json();
      dispatch({ type: "places/loaded", payload: data });
      dispatch({ type: "places/sorted", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: error.message || "There was an error loading places...",
      });
    }
  }, [dispatch]); // `dispatch` is stable, so it won’t cause unnecessary recreation

  const getPlace = useCallback(
    async function getPlace(id) {
      // Check if the place is already loaded, comparing string ids
      if (id === currentPlace._id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/places/${id}`, {
          method: "GET", // Explicitly set the method
          credentials: "include", // This ensures cookies (like JWT) are sent
        });

        // Handle HTTP errors
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch place.");
        }

        const data = await res.json();
        dispatch({ type: "place/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: error.message || "There was an error loading place.",
        });
      }
    },
    [currentPlace._id]
  );

  async function createPlace(newPlace) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/places`, {
        method: "POST",
        body: newPlace,
        credentials: "include",
      });

      if (!res.ok) {
        // Handle response errors
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create place.");
      }

      const data = await res.json();
      dispatch({ type: "place/created", payload: data });
    } catch (error) {
      // Send the actual error message back to the state
      dispatch({
        type: "rejected",
        payload: error.message || "There was an error creating the place...",
      });
    }
  }

  async function deletePlace(id) {
    dispatch({ type: "loading" });

    try {
      const response = await fetch(`${BASE_URL}/places/${id}`, {
        method: "DELETE", // Explicitly set the method
        credentials: "include", // This ensures cookies (like JWT) are sent
      });

      if (response.ok) {
        // Success: Dispatch action to delete the place
        dispatch({ type: "place/deleted", payload: id });
      } else {
        // Handle specific error responses
        const errorData = await response.json();
        let errorMessage = "Error deleting the place.";

        // Customize message based on status code if needed
        if (response.status === 404) {
          errorMessage = "Place not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        dispatch({
          type: "rejected",
          payload: errorData.message || errorMessage,
        });
      }
    } catch (err) {
      // Log the error for debugging
      console.error("Delete place error:", err);
      dispatch({ type: "rejected", payload: "Error deleting the place." });
    }
  }

  return (
    <PlacesContext.Provider
      value={{
        places,
        sortedPlaces,
        isLoading,
        currentPlace,
        getPlace,
        createPlace,
        fetchPlaces,
        deletePlace,
        error,
        dispatch,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
}

function usePlaces() {
  const context = useContext(PlacesContext);
  if (context === undefined)
    throw new Error("Places context was used outside the PlacesProvider");
  return context;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export { PlacesProvider, usePlaces };
