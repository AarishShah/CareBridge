import Dashboard from "../ui/Dashboard";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>{isAuthenticated ? <Dashboard /> : <Navigate to="/" replace={true} />}</>
  );
};

export default PatientDashboard;
