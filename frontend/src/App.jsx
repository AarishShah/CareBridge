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
// import ProtectedRoute from "./components/ProtectedRoute";
import UploadFile from "./components/dashboards/medical-files/UploadFile";
import ContactForm from "./components/header-links/ContactForm";
import ReadAllPrescriptions from "./components/dashboards/prescription/ReadAllPrescriptions";
import CreatePrescriptionForm from "./components/dashboards/prescription/CreatePrescriptionForm";
import CreatePrescription from "./components/dashboards/prescription/CreatePrescription";
import Reminder from "./components/dashboards/reminders/Reminder";
import AboutPage from "./components/header-links/AboutPage";
import TeamPage from "./components/header-links/TeamPage";
import DocFormTemp from "./components/auth/signup/DocFormTemp";
import ForgetPassword from "./components/auth/login/ForgetPassword";
import ResetPassword from "./components/auth/login/ResetPassword";
import Enable2FA from "./components/2FA/Enable2FA";
import Features from "./components/Features";
import RequestConnection from "./components/dashboards/connect/RequestConnection";
import IncomingRequests from "./components/dashboards/connect/IncomingRequests";
import OutgoingRequests from "./components/dashboards/connect/OutgoingRequests";

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
  { path: "/patient/all-medical-records", element: <ReadAllRecords /> },
  { path: "/doctor/all-medical-records", element: <ReadAllRecords /> },
  { path: "/medical-record/create", element: <Create /> },
  { path: "/medical-record/create/:id", element: <CreateRecord /> },
  { path: "/doctor/edit", element: <DoctorEdit /> },
  { path: "/patient/edit", element: <PatientEdit /> },
  { path: "/patient/dashboard/medical-files", element: <ViewFiles /> },
  { path: "/doctor/dashboard/medical-files", element: <ViewFiles /> },
  { path: "/patient/dashboard/medical-files/upload", element: <UploadFile /> },
  { path: "/patient/complete-profile", element: <FormTemp /> },
  { path: "/doctor/complete-profile", element: <DocFormTemp /> },
  { path: "/doctor/dashboard/reminder", element: <Reminder /> },
  { path: "/prescription", element: <ReadAllPrescriptions /> },
  { path: "/create-prescription", element: <CreatePrescription /> },
  { path: "/create-prescription/:id", element: <CreatePrescriptionForm /> },
  { path: "/contact", element: <ContactForm /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/team", element: <TeamPage /> },
  { path: "/doctor/forgot-password", element: <ForgetPassword /> },
  { path: "/patient/forgot-password", element: <ForgetPassword /> },
  { path: "/patient/reset-password/:id/:token", element: <ResetPassword /> },
  { path: "/doctor/reset-password/:id/:token", element: <ResetPassword /> },
  { path: "/patient/enable2fa", element: <Enable2FA /> },
  { path: "/doctor/enable2fa", element: <Enable2FA /> },
  { path: "/features", element: <Features /> },
  { path: "assign-patients", element: <RequestConnection /> },
  { path: "assign-doctors", element: <RequestConnection /> },
  { path: "doctor/view-incoming-requests", element: <IncomingRequests /> },
  { path: "/patient/view-incoming-requests", element: <IncomingRequests /> },
  { path: "/doctor/view-outgoing-requests", element: <OutgoingRequests /> },
  { path: "/patient/view-outgoing-requests", element: <OutgoingRequests /> },
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
