import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AuthForm from "../AuthForm";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const loginRequest = async (user, userType) => {
  const response = await axios.post(`${BASE_URL}/${userType}/login`, user);
  return response.data;
};

const verify2FARequest = async ({ userType, userId, code }) => {
  const payload = {
    [`${userType}Id`]: userId,
    code,
  };
  console.log("payload is", payload); // Debug payload
  const response = await axios.post(`${BASE_URL}/${userType}/verify2FA`, payload);
  console.log("verify2FA response", response); // Debug response
  return response.data;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const userType = location.pathname.includes("doctor") ? "doctor" : "patient";

  const mutation = useMutation({
    mutationFn: ({ user, userType }) => loginRequest(user, userType),
    onSuccess: (data) => {
      console.log("login response data:", data); // Debug the response
      if (data.twoFactorRequired) {
        setTwoFactorRequired(true);
        setUserId(data[`${userType}Id`]);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        login(data.token);
        navigate(userType === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login error:", error); // Add error logging
      setError(error.response?.data?.message || "An unexpected error occurred");
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: ({ userType, userId, code }) => verify2FARequest({ userType, userId, code }),
    onSuccess: (data) => {
      console.log("verify2FA success:", data); // Debug success response
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        login(data.token);
        navigate(userType === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
      }
    },
    onError: (error) => {
      console.error("verify2FA error:", error); // Add error logging
      setError(error.response?.data?.message || "Invalid 2FA code");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ user: { email, password }, userType });
  };

  const handleVerify2FA = (event) => {
    event.preventDefault();
    console.log("userId is", userId); // Debug userId
    console.log("code is", code); // Debug code
    verify2FAMutation.mutate({ userType, userId, code });
  };

  const handleSignin = () => {
    const signInUrl = `${BASE_URL}/${userType}/auth/google`;
    window.location.href = signInUrl;
  };

  const forgotPasswordUrl = `/${userType}/forgot-password`;

  const handleSignUp = () => {
    navigate(`/${userType}/signup`);
  };

  return (
    <AuthForm heading="Login to CareBridge" onSubmit={handleSubmit}>
      {error && <div style={{ color: "crimson" }}>Could not authenticate</div>}
      {!twoFactorRequired ? (
        <>
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
            <Link
              to={forgotPasswordUrl}
              className="ml-auto font-normal text-sm text-[10px] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="h-10 w-1/3 bg-blue-400 text-white rounded ml-32 mb-8 hover:underline font-semibold"
          >
            Log in
          </button>
        </>
      ) : (
        <>
          <label htmlFor="2fa" className="mb-2">
            2FA Code
          </label>
          <input
            id="2fa"
            type="text"
            placeholder="Enter 2FA code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="border rounded h-10 text-sm placeholder-gray-400 placeholder:ml-5 border-gray-600 mb-6 p-2"
          />
          <button
            type="submit"
            onClick={handleVerify2FA}
            className="h-10 w-1/3 bg-blue-400 text-white rounded ml-32 mb-8 hover:underline font-semibold"
          >
            Verify
          </button>
        </>
      )}
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
        <button
      onClick={handleSignUp}
      className="text-blue-500 font-semibold hover:underline"
    >
      Sign up
    </button>
      </div>
    </AuthForm>
  );
}

export default LoginPage;