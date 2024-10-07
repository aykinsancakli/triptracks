import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:8080";

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
        places: state.places.filter((place) => place.id !== action.payload),
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
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
        const data = await res.json();
        dispatch({ type: "places/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading places...",
        });
      }
    }
    fetchPlaces();
  }, []);

  const getPlace = useCallback(
    async function getPlace(id) {
      if (Number(id) === currentPlace.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/places/${id}`);
        const data = await res.json();
        dispatch({ type: "place/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading place",
        });
      }
    },
    [currentPlace.id]
  );

  async function createPlace(newPlace) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/places/`, {
        method: "POST",
        body: JSON.stringify(newPlace),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "place/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the place...",
      });
    }
  }

  async function deletePlace(id) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/places/${id}`, {
        method: "DELETE",
      });

      dispatch({
        type: "place/deleted",
        payload: id,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting place...",
      });
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
