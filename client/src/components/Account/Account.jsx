import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Account.module.scss";
import { MdManageAccounts } from "react-icons/md";

function Account() {
  const { user, deleteAccount } = useAuth();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  async function handleDeleteAccount() {
    await deleteAccount();
  }

  return (
    <div className={styles.account}>
      <button
        className={`${styles.statsBtn} ${isAccountOpen ? styles.active : ""}`}
        onClick={() => setIsAccountOpen((isStatsOpen) => !isStatsOpen)}
      >
        <MdManageAccounts className={styles.icon} />
        <p>Account</p>
      </button>

      {isAccountOpen && (
        <div className={styles.accountBox}>
          {/* BTN */}
          <div className={styles.times} onClick={() => setIsAccountOpen(false)}>
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
