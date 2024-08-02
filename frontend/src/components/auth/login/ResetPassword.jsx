import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AuthForm from "../AuthForm";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const loginRequest = async ({ id, token, password, userType }) => {
  console.log("user is in reset password", userType);
  const response = await axios.post(`${BASE_URL}/${userType}/reset-password/${id}/${token}`, { password });
  return response.data;
};

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const userType = location.pathname.includes("doctor") ? "doctor" : "patient";

  const mutation = useMutation({
    mutationFn: (data) => loginRequest(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        login(data.token);
      }

      navigate(`/login/${userType}`);
    },
    onError: (error) => {
      setError(error.response?.data?.message || "An unexpected error occurred");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ id, token, password, userType });
  };


  return (
    <AuthForm heading="Reset Password" onSubmit={handleSubmit}>
      {error && <div style={{ color: "crimson" }}>Could not authenticate</div>}
      <label htmlFor="password" className="mb-2">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="border rounded h-10 text-sm placeholder-gray-400 placeholder:ml-5 border-gray-600 mb-6 p-2"
      />
      <button
        type="submit"
        className="h-10 w-1/3 bg-blue-400 text-white rounded ml-32 mb-8 hover:underline font-semibold"
      >
        Update Password
      </button>
    </AuthForm>
  );
}

export default ResetPassword;