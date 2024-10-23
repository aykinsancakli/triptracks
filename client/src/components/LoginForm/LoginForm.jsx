import { useEffect, useState } from "react";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { usePlaces } from "../../contexts/PlacesContext";
import { useAuth } from "../../contexts/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, errors, dispatch } = useAuth();
  const { fetchPlaces } = usePlaces();

  async function handleSubmit(e) {
    e.preventDefault();

    const user = await login(email, password);

    if (user) {
      navigate("/app");
      fetchPlaces();
    }
  }

  // Clear the errors on first mount
  useEffect(() => {
    dispatch({ type: "login/error", payload: { email: "", password: "" } });
  }, [dispatch]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h2>Log in to TripTracks</h2>
        <p>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <div className={styles.row}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
        />
        <span className={styles.error}>
          {errors.email && <p>{errors.email}</p>}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
        />
        <span className={styles.error}>
          {errors.password && <p>{errors.password}</p>}
        </span>
      </div>

      <div>
        <button className={styles.btn}>Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
