import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const getLoginPath = () => {
    if (location.pathname.includes('doctor')) {
      return '/login/doctor';
    } else if (location.pathname.includes("/patient")) {
      return "/login/patient";
    }
    return "/login"; 
  };

  if (!isAuthenticated) {
    return <Navigate to={getLoginPath()} state={{ from: location }} replace />;
  }

  return children; 
}

export default ProtectedRoute;
