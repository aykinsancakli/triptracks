import styles from "./Login.module.scss";
import PageNav from "../../components/PageNav/PageNav";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />

      <Outlet />
    </main>
  );
}

export default Login;
