import { useState } from "react";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({ email: "", password: "" });

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);

      if (data.errors) {
        setErrors(data.errors);
      }

      if (data.user) {
        navigate("/app");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h2>Log in to TripTracks</h2>
        <p>
          Don&apos;t have an account? <Link to="signup">Sign up</Link>
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
