import styles from "./AuthForm.module.css";

function AuthForm({ heading, children }) {
  return (
    <div className={styles.main}>
      <form className={styles.form}>
        <div className={styles.content}>
          <h2>{heading}</h2>
          {children}
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
