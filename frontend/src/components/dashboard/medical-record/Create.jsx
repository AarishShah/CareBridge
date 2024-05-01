import styles from "./Create.module.css";
import PatientList from "./PatientList";

function Create() {
  return (
    <main className={styles.main}>
      <PatientList />
    </main>
  );
}

export default Create;
