import styles from "./Spinner.module.scss";

function Spinner({ message }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
