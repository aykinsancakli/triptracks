import { useLoadScript } from "@react-google-maps/api";

import styles from "./AppLayout.module.scss";

import Search from "../../components/Search/Search";
import Main from "../../components/Main/Main";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapView from "../../components/MapView/MapView";

function AppLayout() {
  // Load maps script => (need after this point since we are in the app)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Include places library instead of loading seperately
  });

  return (
    isLoaded && (
      <div className={styles.app}>
        <Search />
        <Main>
          <Sidebar />
          <MapView />
        </Main>
      </div>
    )
  );
}

export default AppLayout;
