import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const PlacesContext = createContext();

const initialState = {
  places: [],
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
      };

    case "place/deleted":
      return {
        ...state,
        isLoading: false,
        places: state.places.filter((place) => place._id !== action.payload),
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
  const [{ places, isLoading, currentPlace, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchPlaces() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/places`);

        if (!res.ok) {
          // Handle the case where the response status is not OK (e.g., 404 or 500)
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch places.");
        }

        const data = await res.json();
        dispatch({ type: "places/loaded", payload: data });
      } catch (error) {
        // Send the actual error message back to the state
        dispatch({
          type: "rejected",
          payload: error.message || "There was an error loading places...",
        });
      }
    }

    fetchPlaces();
  }, []);

  const getPlace = useCallback(
    async function getPlace(id) {
      // Check if the place is already loaded, comparing string ids
      if (id === currentPlace._id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/places/${id}`);

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
        body: newPlace, // Directly pass FormData
        // No Content-Type header needed; the browser sets it automatically
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
        method: "DELETE",
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
        isLoading,
        currentPlace,
        getPlace,
        createPlace,
        deletePlace,
        error,
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
