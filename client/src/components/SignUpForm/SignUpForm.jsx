import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../LoginForm/LoginForm.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { usePlaces } from "../../contexts/PlacesContext";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, errors, dispatch } = useAuth();
  const { fetchPlaces } = usePlaces();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "signup/error", payload: { email: "", password: "" } }); // Clear previous errors

    const user = await signup(email, password);
    console.log(user);
    if (user) {
      navigate("/app");
      fetchPlaces();
    }
  }

  // Clear the errors on first mount
  useEffect(() => {
    dispatch({ type: "signup/error", payload: { email: "", password: "" } });
  }, [dispatch]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <h2>Create your account</h2>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
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
        <button className={styles.btn}>Sign Up</button>
      </div>
    </form>
  );
}

export default SignUpForm;
