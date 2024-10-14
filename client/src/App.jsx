import { BrowserRouter, Route, Routes } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <PlacesProvider>
        <MapProvider>
          <WeatherProvider>
            <CountryProvider>
              <Routes>
                <Route index element={<Homepage />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="product" element={<Product />} />
                <Route path="login" element={<Login />} />
                <Route path="app" element={<AppLayout />}>
                  <Route index element={<Country />} />
                  <Route path="places/:id" element={<Place />} />
                  <Route path="form" element={<Form />} />
                </Route>
              </Routes>
            </CountryProvider>
          </WeatherProvider>
        </MapProvider>
      </PlacesProvider>
    </BrowserRouter>
  );
}

export default App;
