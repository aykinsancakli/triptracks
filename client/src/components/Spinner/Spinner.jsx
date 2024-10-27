import styles from "./Spinner.module.scss";

function Spinner({ message, background }) {
  return (
    <div
      className={styles.spinnerContainer}
      style={{ backgroundColor: background }}
    >
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
