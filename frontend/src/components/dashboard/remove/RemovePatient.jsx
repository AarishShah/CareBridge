import { useState } from "react";
import axios from "axios";
import styles from "./RemoveDoctor.module.css";

function RemoveDoctor() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoval = async (event) => {
    event.preventDefault();
    setError(false);
    setSuccess(false);
    setErrorMessage("");

    try {
      const response = await axios.delete(
        "http://localhost:5000/doctor/removeDoctor",
        {
          data: { email },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage(error.response?.data?.error || "Patient removal failed");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.messageContainer}></div>
      <form className={styles.form} onSubmit={handleRemoval}>
        <div className={styles.content}>
          {error && <p className={styles.error}>{errorMessage}</p>}
          {success && (
            <p className={styles.success}>Patient removed successfully</p>
          )}
          <input
            className={styles.input}
            type="email"
            value={email}
            placeholder="Enter Patient's email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Remove Patient
          </button>
        </div>
      </form>
    </div>
  );
}

export default RemoveDoctor;
