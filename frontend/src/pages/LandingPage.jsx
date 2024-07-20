import Header from "../components/Header";
import Moto from "../components/Moto";
import DynamicSection from "../components/DynamicSection";
import GetStarted from "../components/GetStarted";
import Footer from "../components/Footer";
import { useAuth } from "../components/context/AuthContext";
import DoctorDashboard from "../components/dashboards/DoctorDashboard";
import PatientDashboard from "../components/dashboards/PatientDashboard";

function LandingPage() {
  const { isAuthenticated } = useAuth();

  const Dashboard = () => {
    const role = localStorage.getItem("role");
    return role === "patient" ? <PatientDashboard /> : <DoctorDashboard />;
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <Header />
          <Moto />
          <DynamicSection />
          <GetStarted />
          <Footer />
        </>
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default LandingPage;
