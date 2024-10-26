import { useLoadScript } from "@react-google-maps/api";

import styles from "./AppLayout.module.scss";

import Nav from "../../components/Nav/Nav";
import Main from "../../components/Main/Main";
import Sidebar from "../../components/Sidebar/Sidebar";
import MapView from "../../components/MapView/MapView";
import User from "../../components/User/User";
import Logo from "../../components/Logo/Logo";
import { Link } from "react-router-dom";

function AppLayout() {
  // Load maps script => (need after this point since we are in the app)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Include places library instead of loading seperately
  });

  return (
    isLoaded && (
      <>
        <div className={styles.app}>
          <Nav />
          <Main>
            <Sidebar />
            <MapView />
          </Main>
          <User />
        </div>
        <div className={styles.overlay}>
          <Logo />
          <h2>
            For the best experience, please use TripTracks on a tablet or larger
            screen.
          </h2>
          <Link to="/" className={styles.link}>
            Go back to homepage
          </Link>
        </div>
      </>
    )
  );
}

export default AppLayout;
