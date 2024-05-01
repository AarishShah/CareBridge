import { Link } from "react-router-dom";

import styles from "./Dropdown.module.css";

function Dropdown({ links }) {
  return (
    <nav>
      <div className={styles.dropdown}>
        <span>Signup</span>
        <div className={styles["dropdown-content"]}>
          <Link className={links} to="patient/signup">
            As Patient
          </Link>
          <Link className={links} to="doctor/signup">
            As Doctor
          </Link>
        </div>
      </div>
      <div className={styles.dropdown}>
        <span>Login</span>
        <div className={styles["dropdown-content"]}>
          <Link className={links} to="patient/login">
            As Patient
          </Link>
          <Link className={links} to="doctor/login">
            As Doctor
          </Link>
        </div>
      </div>
      <Link className={styles.about} to="about">
        About Us
      </Link>
    </nav>
  );
}

export default Dropdown;
