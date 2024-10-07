import styles from "./Main.module.scss";

function Main({ children }) {
  return <main className={styles.main}>{children}</main>;
}

export default Main;
