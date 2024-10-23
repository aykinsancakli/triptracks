import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { CountryProvider } from "./contexts/CountryContext";
import { PlacesProvider } from "./contexts/PlacesContext";

import Place from "./components/Place/Place";
import Country from "./components/Country/Country";
import Form from "./components/Form/Form";
import Homepage from "./pages/Homepage/Homepage";
import Pricing from "./pages/Pricing/Pricing";
import Login from "./pages/Login/Login";

import AppLayout from "./pages/AppLayout/AppLayout";
import Product from "./pages/Product/Product";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlacesProvider>
          <MapProvider>
            <WeatherProvider>
              <CountryProvider>
                <Routes>
                  {/* Pages */}
                  <Route index element={<Homepage />} />
                  <Route path="pricing" element={<Pricing />} />
                  <Route path="product" element={<Product />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />

                  {/* Protected Routes */}
                  <Route
                    path="app"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Country />} />
                    <Route path="places/:id" element={<Place />} />
                    <Route path="form" element={<Form />} />
                  </Route>
                </Routes>
              </CountryProvider>
            </WeatherProvider>
          </MapProvider>
        </PlacesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
