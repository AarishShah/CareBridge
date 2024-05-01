import Dropdown from "./dropdown/Dropdown";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <div className={styles.landing}>
      <header>
        <h2 style={{ color: "black" }}>CareBridge</h2>
        <Dropdown links={styles.links} />
      </header>
      <main className={styles.content}>
        <p>A Clinical Decision Support System</p>
        <p>
          A streamlined way of managing <br />
          medical records & AI generated diagnosis
        </p>
      </main>
    </div>
  );
}

export default LandingPage;
