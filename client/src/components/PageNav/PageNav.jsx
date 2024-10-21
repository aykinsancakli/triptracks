import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Logo/Logo";
import styles from "./PageNav.module.scss";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function PageNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <Logo />

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

        {isOpen ? (
          <IoClose
            className={styles.menuCloseBtn}
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <IoIosMenu
            className={styles.menuBtn}
            onClick={() => setIsOpen(true)}
          />
        )}
      </nav>

      {/* Mobile nav */}
      <ul
        className={`${styles.mobileNav} ${
          isOpen ? styles.menuOpen : styles.menuClosed
        }`}
        onClick={() => setIsOpen(false)}
      >
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
    </>
  );
}

export default PageNav;
