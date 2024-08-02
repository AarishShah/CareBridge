import Dashboard from "../ui/Dashboard";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { isAuthenticated, login } = useAuth();
  const params = new URLSearchParams(location.search);

  const token = params.get("token");
  const role = params.get("role");

  if (token && role === 'patient') {
    login(token);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  }

  return (
    <>{isAuthenticated ? <Dashboard /> : <Navigate to="/" replace={true} />}</>
  );
};

export default PatientDashboard;
