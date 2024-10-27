import Logo from "../Logo/Logo";
import Spinner from "../Spinner/Spinner";
import styles from "./SpinnerFullPage.module.scss";

function SpinnerFullPage() {
  return (
    <div className={styles.spinnerFullPage}>
      <Logo />
      <div>
        <Spinner background="transparent" />
      </div>
    </div>
  );
}

export default SpinnerFullPage;
