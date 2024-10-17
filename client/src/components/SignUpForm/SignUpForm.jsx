import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../LoginForm/LoginForm.module.scss";
import Spinner from "../Spinner/Spinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setSuccessMessage("");

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
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
        setSuccessMessage("Account successfully created!");
        setAccountCreated(true);

        // Simulate server processing time with a slight delay
        const processingTime = Math.random() * 1500 + 500;
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/app");
        }, processingTime);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {!accountCreated ? (
          <>
            <div className={styles.heading}>
              <h2>Create your account</h2>
              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <div className={styles.row}>
              <label htmlFor="email">Email address</label>
              <input
                type="text"
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
          </>
        ) : (
          <div className={styles.redirect}>
            <Spinner message="Hang tight! We're setting up your account..." />
          </div>
        )}
      </form>

      {successMessage && (
        <div className={styles.successPopup}>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default SignUpForm;
