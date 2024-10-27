import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Account.module.scss";
import { MdManageAccounts } from "react-icons/md";
import { useLocation } from "react-router-dom";

function Account({ isOpen, onToggle }) {
  const { user, deleteAccount } = useAuth();

  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  async function handleDeleteAccount() {
    await deleteAccount();
  }

  // Use location from React Router to check if the current URL contains '/form'
  const location = useLocation();
  const isFormPage = location.pathname.includes("/form");

  return (
    <div
      className={`${styles.account} ${
        isFormPage ? `${styles.accountDisabled}` : ""
      }`}
    >
      <button
        className={`${styles.statsBtn} ${isOpen ? styles.active : ""} ${
          isFormPage ? styles.accountDisabled : ""
        }`}
        onClick={onToggle}
      >
        <MdManageAccounts className={styles.icon} />
        <p>Account</p>
      </button>

      {isOpen && (
        <div className={styles.accountBox}>
          {/* BTN */}
          <div className={styles.times} onClick={onToggle}>
            <span>&times;</span>
          </div>
          <h2>My Account</h2>

          <div className={styles.row}>
            <p>Registered Email</p>
            <span>{user.email}</span>
          </div>

          <div className={styles.row}>
            <button
              className={styles.deleteBtn}
              onClick={() => setIsDeleteClicked((prev) => !prev)}
            >
              Delete my account
            </button>
            {isDeleteClicked && (
              <div>
                <p>Your all data will be lost?</p>
                <div className={styles.buttons}>
                  <button onClick={handleDeleteAccount}>Confirm</button>
                  <button onClick={() => setIsDeleteClicked(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
