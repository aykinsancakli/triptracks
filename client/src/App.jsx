import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { CountryProvider } from "./contexts/CountryContext";
import { PlacesProvider } from "./contexts/PlacesContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Place from "./components/Place/Place";
import Country from "./components/Country/Country";
import Form from "./components/Form/Form";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage";

const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing"));
const Product = lazy(() => import("./pages/Product/Product"));
const Login = lazy(() => import("./pages/Login/Login"));
const Signup = lazy(() => import("./pages/Signup/Signup"));
const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));

function App() {
  return (
    <AuthProvider>
      <PlacesProvider>
        <MapProvider>
          <WeatherProvider>
            <CountryProvider>
              <BrowserRouter>
                <Suspense fallback={<SpinnerFullPage />}>
                  <Routes>
                    <Route index element={<Homepage />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="product" element={<Product />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
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
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </CountryProvider>
          </WeatherProvider>
        </MapProvider>
      </PlacesProvider>
    </AuthProvider>
  );
}

export default App;
