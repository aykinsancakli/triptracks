import { Outlet } from "react-router-dom";

import styles from "./Sidebar.module.scss";
import Weather from "../Weather/Weather";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Weather />
      <Outlet />
    </div>
  );
}

export default Sidebar;
