import { useAuth } from "../../contexts/AuthContext";
import styles from "./User.module.scss";
import { FaCircleUser } from "react-icons/fa6";

function User() {
  const { user, logout } = useAuth();
  const userName = user.email.slice(0, user.email.indexOf("@"));

  const handleLogout = async () => {
    await logout();
  };

  return (
    user && (
      <div className={styles.user}>
        <FaCircleUser size={40} />
        <p>
          Welcome, <span className={styles.userName}>{userName}</span>
        </p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  );
}

export default User;
