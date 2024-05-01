import { RouterProvider, createBrowserRouter } from "react-router-dom";

import LandingPage from "./components/landing/LandingPage";
import Login from "./components/auth/login/Login";
import PatientSignup from "./components/auth/signup/patient/PatientSignup";
import DoctorSignup from "./components/auth/signup/doctor/DoctorSignup";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import DoctorHome from "./components/dashboard/home/DoctorHome";
import DoctorProfile from "./components/dashboard/profile/DoctorProfile";
import DoctorEdit from "./components/dashboard/profile/DoctorEdit";
import PatientEdit from "./components/dashboard/profile/PatientEdit";
import Create from "./components/dashboard/medical-record/Create";
import CreateRecord from "./components/dashboard/medical-record/create/CreateRecord";
import PatientProfile from "./components/dashboard/profile/PatientProfile";
import ReadAllRecords from "./components/dashboard/medical-record/read/ReadAllRecords";
import ReadSingleRecord from "./components/dashboard/medical-record/read/ReadSingleRecord";
import RemoveDoctor from "./components/dashboard/remove/RemoveDoctor";
import RemovePatient from "./components/dashboard/remove/RemovePatient";
import Assign from "./components/dashboard/assign/Assign";
import About from "./components/landing/dropdown/About";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/patient/login", element: <Login /> },
  { path: "/patient/signup", element: <PatientSignup /> },
  { path: "/doctor/login", element: <Login /> },
  { path: "/doctor/signup", element: <DoctorSignup /> },
  { path: "/doctor/edit", element: <DoctorEdit /> },
  { path: "/patient/edit", element: <PatientEdit isEditing={true} /> },
  { path: "/about", element: <About /> },

  {
    path: "doctor/dashboard",
    element: <DoctorDashboard />,
    children: [{ index: true, element: <DoctorHome /> }],
  },
  { path: "/medical-record/create", element: <Create /> },
  { path: "/medical-record/create/:id", element: <CreateRecord /> },
  { path: "/medicalHistory", element: <ReadAllRecords /> },
  { path: "/medicalHistory/:id", element: <ReadSingleRecord /> },
  { path: "doctor/dashboard/profile", element: <DoctorProfile /> },
  {
    path: "doctor/dashboard/assign-patient",
    element: <Assign user="Patient" />,
  },
  {
    path: "patient/dashboard/assign-doctor",
    element: <Assign user="Doctor" />,
  },
  { path: "patient/dashboard", element: <PatientDashboard /> },
  { path: "/patient/dashboard/profile", element: <PatientProfile /> },
  { path: "/patient/dashboard/remove-doctor", element: <RemoveDoctor /> },
  { path: "/doctor/dashboard/remove-patient", element: <RemovePatient /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
