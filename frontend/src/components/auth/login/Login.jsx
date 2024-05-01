import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AuthForm from "../AuthForm";
import axios from "axios";

let url = "http://localhost:5000";

function Login() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${url}${pathname}`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (pathname.includes("doctor")) {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <AuthForm heading="Login">
      {error && <div style={{ color: "crimson" }}>Could not authenticate</div>}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </AuthForm>
  );
}

export default Login;
