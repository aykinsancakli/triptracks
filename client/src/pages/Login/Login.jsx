import { useState } from "react";
import styles from "./Login.module.scss";
import PageNav from "../../components/PageNav/PageNav";

function Login() {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("123123");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button className={styles.btn}>Login</button>
        </div>
      </form>
    </main>
  );
}

export default Login;
