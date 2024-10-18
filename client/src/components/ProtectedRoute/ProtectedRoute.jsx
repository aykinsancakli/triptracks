import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePlaces } from "../../contexts/PlacesContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { fetchPlaces, places } = usePlaces();

  useEffect(() => {
    if (isAuthenticated && places.length === 0) {
      // Fetch places only if not already loaded
      fetchPlaces(); // Fetch places when authenticated
    }
  }, [isAuthenticated, fetchPlaces, places.length]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
