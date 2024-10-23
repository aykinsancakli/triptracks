import styles from "./Login.module.scss";
import PageNav from "../../components/PageNav/PageNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";

function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <section className={styles.formContainer}>
        <LoginForm />
      </section>
    </main>
  );
}

export default Login;
