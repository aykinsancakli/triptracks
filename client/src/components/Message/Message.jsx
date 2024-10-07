import styles from "./Message.module.scss";

function Message({ message }) {
  return <p className={styles.message}>{message}</p>;
}

export default Message;
