import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AuthForm from "../AuthForm";
import { useAuth } from "../../context/AuthContext";

const url = "http://localhost:5000";

const forgotPasswordRequest = async ({ email, userType }) => {
  console.log(" is", userType);
  const response = await axios.post(`http://localhost:5000/${userType}/forgot-password`, {email});
  return response.data;
};

function ForgetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const userType = location.pathname.includes("doctor") ? "doctor" : "patient";

  const mutation = useMutation({
    mutationFn: (data) => forgotPasswordRequest(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        login(data.token);
      }

      if (location.pathname.includes("doctor")) {
        navigate("/login/doctor");
      } else {
        navigate("/login/patient");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || "An unexpected error occurred");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ email, userType });
  };

  
  return (
    <AuthForm heading="Forgot Password?" onSubmit={handleSubmit}>
      {error && <div style={{ color: "crimson" }}>Could not authenticate</div>}
      <label htmlFor="email" className="mb-2">
        Username or Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="username/email/phone number"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="border rounded h-10 text-sm placeholder-gray-400 placeholder:ml-5 border-gray-600 mb-6 p-2"
      />
    
     
      <button
        type="submit"
        className="h-10 w-1/3 bg-blue-400 text-white rounded ml-32 mb-8 hover:underline font-semibold"
      >
        Submit
      </button>
      
     
    </AuthForm>
  );
}

export default ForgetPassword;