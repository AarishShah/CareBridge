import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SignupPagePatient from "./pages/SignupPagePatient";
import Dashboard from "./components/ui/Dashboard";
import PatientDashboard from "./components/dashboards/PatientDashboard";
import DoctorDashboard from "./components/dashboards/DoctorDashboard";
import ReadSingleMedicalRecord from "./components/dashboards/medical-record/read/ReadSingleMedicalRecord";
import ReadAllRecords from "./components/dashboards/medical-record/read/ReadAllRecords";
import Create from "./components/dashboards/medical-record/read/Create";
import CreateRecord from "./components/dashboards/medical-record/read/create/CreateRecord";
import DoctorEdit from "./components/ui/personalInfo/DoctorEdit";
import PatientEdit from "./components/ui/personalInfo/PatientEdit";
import ViewFiles from "./components/dashboards/medical-files/ViewFiles";
import FormTemp from "./components/auth/signup/FormTemp";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadFile from "./components/dashboards/medical-files/UploadFile";
import ContactForm from "./components/header-links/ContactForm";
import ReadAllPrescriptions from "./components/dashboards/prescription/ReadAllPrescriptions";
import CreatePrescriptionForm from "./components/dashboards/prescription/CreatePrescriptionForm";
import CreatePrescription from "./components/dashboards/prescription/CreatePrescription";
import AboutPage from "./components/header-links/AboutPage";
import TeamPage from "./components/header-links/TeamPage";
import DocFormTemp from "./components/auth/signup/DocFormTemp";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login/patient", element: <LoginPage /> },
  { path: "/login/doctor", element: <LoginPage /> },
  { path: "/doctor/signup", element: <SignupPage /> },
  { path: "/patient/signup", element: <SignupPagePatient /> },
  {
    path: "/dashboard",
    element: (
      // <ProtectedRoute>
      <Dashboard />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/patient/dashboard",
    element: (
      // <ProtectedRoute>
      <PatientDashboard />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/doctor/dashboard",
    element: (
      // <ProtectedRoute>
      <DoctorDashboard />
      /* </ProtectedRoute> */
    ),
  },

  { path: "/all-medical-records/:id", element: <ReadSingleMedicalRecord /> },
  { path: "/all-medical-records", element: <ReadAllRecords /> },
  { path: "/medical-record/create", element: <Create /> },
  { path: "/medical-record/create/:id", element: <CreateRecord /> },
  { path: "/doctor/edit", element: <DoctorEdit /> },
  { path: "/patient/edit", element: <PatientEdit /> },
  { path: "/patient/dashboard/medical-files", element: <ViewFiles /> },
  { path: "/doctor/dashboard/medical-files", element: <ViewFiles /> },
  { path: "/patient/dashboard/medical-files/upload", element: <UploadFile /> },
  { path: "/patient/complete-profile", element: <FormTemp /> },
  { path: "/doctor/complete-profile", element: <DocFormTemp /> },
  { path: "/prescription", element: <ReadAllPrescriptions /> },
  { path: "/create-prescription", element: <CreatePrescription /> },
  { path: "/create-prescription/:id", element: <CreatePrescriptionForm /> },
  { path: "/contact", element: <ContactForm /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/team", element: <TeamPage /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
