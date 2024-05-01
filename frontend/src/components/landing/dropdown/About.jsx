import React from "react";
import styles from "./About.module.css"; // Make sure the path to your CSS module is correct

function About() {
  return (
    <div className={styles.abtcontainer}>
      <h1 className={styles.abtheader}>About Us</h1>
      <div className={styles["abttext-box"]}>
        <p className={styles.abttext}>
          Welcome to our application, designed to bring quality healthcare
          management directly to your fingertips. Our platform provides a
          seamless experience for managing patient information, medical records,
          and much more.
        </p>
        <p className={styles.abttext}>
          Our team is dedicated to ensuring that healthcare providers can focus
          on delivering care, rather than worrying about the logistics of
          information management. With a focus on security, accessibility, and
          ease of use, our application supports a wide range of healthcare
          activities.
        </p>
        <p className={styles.abttext}>
          For more information or to request features, please contact us at
          <a href="mailto:carebridge56@gmail.com" className={styles.link}>
            {" "}
            carebridge56@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default About;
