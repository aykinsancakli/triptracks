import styles from "./Login.module.scss";
import PageNav from "../../components/PageNav/PageNav";
import { Outlet } from "react-router-dom";

function Login() {
  return (
    <main className={styles.login}>
      <PageNav />

      <Outlet />
    </main>
  );
}

export default Login;
