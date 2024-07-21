import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AuthForm from "../AuthForm";
import { useAuth } from "../../context/AuthContext";

const url = "http://localhost:5000";

const loginRequest = async (user, userType) => {
  const response = await axios.post(`${url}/${userType}/login`, user);
  return response.data;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ user, userType }) => loginRequest(user, userType),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        login(data.token);
      }

      if (location.pathname.includes("doctor")) {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || "An unexpected error occurred");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const userType = location.pathname.includes("doctor")
      ? "doctor"
      : "patient";
    mutation.mutate({ user: { email, password }, userType });
  };

  const handleSignin = () => {
    const userType = location.pathname.includes("doctor") ? "doctor" : "patient";
    const signInUrl = `${url}/${userType}/auth/google`;
    window.location.href = signInUrl;
  };

  return (
    <AuthForm heading="Login to CareBridge" onSubmit={handleSubmit}>
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
      <label
        htmlFor="password"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="border rounded h-10 text-sm placeholder-gray-400 border-gray-600 p-2"
      />
      <div className="flex items-center text-sm mt-2 font-thin mb-6">
        <input type="checkbox" id="rememberMe" className="mr-1" />
        <label htmlFor="rememberMe" className="font-normal text-sm mr-2">
          Remember me
        </label>
        <a
          href="#"
          className="ml-auto font-normal text-sm text-[10px] hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        className="h-10 w-1/3 bg-blue-400 text-white rounded ml-32 mb-8 hover:underline font-semibold"
      >
        Log in
      </button>
      <div className="flex items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-2 text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <button
        type="button"
        className="h-10 w-1/2 border border-gray-400 text-gray-600 rounded mt-8 ml-24 flex items-center justify-evenly font-medium text-sm hover:underline"
        onClick={handleSignin}
      >
        <img
          src="https://img.icons8.com/color/16/000000/google-logo.png"
          alt="Google logo"
          className="mr-1"
        />
        Sign in with Google
      </button>
      <div className="text-center mt-8 font-normal text-sm ml-2">
        <span>Don't have an Account? </span>
        <a href="#" className="text-blue-500 font-semibold hover:underline">
          Sign up
        </a>
      </div>
    </AuthForm>
  );
}

export default LoginPage;
