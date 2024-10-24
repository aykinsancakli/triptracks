import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";
import { WeatherProvider } from "./contexts/WeatherContext";
import { CountryProvider } from "./contexts/CountryContext";
import { PlacesProvider } from "./contexts/PlacesContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage";
import Spinner from "./components/Spinner/Spinner";

const Place = lazy(() => import("./components/Place/Place"));
const Country = lazy(() => import("./components/Country/Country"));
const Form = lazy(() => import("./components/Form/Form"));

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
                    <MapProvider>
                      <WeatherProvider>
                        <CountryProvider>
                          <AppLayout />
                        </CountryProvider>
                      </WeatherProvider>
                    </MapProvider>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<Spinner />}>
                      <Country />
                    </Suspense>
                  }
                />
                <Route
                  path="places/:id"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <Place />
                    </Suspense>
                  }
                />
                <Route
                  path="form"
                  element={
                    <Suspense fallback={<Spinner />}>
                      <Form />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PlacesProvider>
    </AuthProvider>
  );
}

export default App;
