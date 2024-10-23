import PageNav from "../../components/PageNav/PageNav";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import styles from "../Login/Login.module.scss";

function Signup() {
  return (
    <main className={styles.login}>
      <PageNav />
      <section className={styles.formContainer}>
        <SignUpForm />
      </section>
    </main>
  );
}

export default Signup;
