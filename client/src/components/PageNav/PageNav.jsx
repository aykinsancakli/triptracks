import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import styles from "./PageNav.module.scss";
import { IoIosMenu } from "react-icons/io";

function PageNav() {
  return (
    <div>
      <nav className={styles.nav}>
        <Logo />

        {/* Menu icon */}
        <IoIosMenu className={styles.hamburgerMenu} />

        {/* Desktop nav */}
        <ul>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageNav;
