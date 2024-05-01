import { useState } from "react";
import axios from "axios";

import styles from "./Assign.module.css";

function Assign(props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAssignment = async (event) => {
    event.preventDefault();
    try {
      let response = {};
      if (props.user == "Patient") {
        response = await axios.post(
          "http://localhost:5000/doctor/assignDoctor",
          { email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/patient/assignDoctor",
          { email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (response.status === 201) {
        setSuccess(true);
        setError(false);
      }
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <div className={styles.main}>
      <form className={styles.form} onSubmit={handleAssignment}>
        {error && (
          <p className={styles.error}>{props.user} not found or already assigned.</p>
        )}
        {success && (
          <p className={styles.success}>{props.user} assigned successfully</p>
        )}
        <div className={styles.content}>
          <input
            type="email"
            value={email}
            placeholder={`Add ${props.user} email`}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit">Assign {props.user}</button>
        </div>
      </form>
    </div>
  );
}

export default Assign;
