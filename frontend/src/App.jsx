import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SignupPagePatient from './pages/SignupPagePatient';
import Dashboard from './components/ui/Dashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login/patient', element: <LoginPage /> },
  { path: '/login/doctor', element: <LoginPage /> },
  { path: '/signup/doctor', element: <SignupPage /> },
  { path: '/signup/patient', element: <SignupPagePatient /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/patient/dashboard', element: <PatientDashboard /> },
  { path: '/doctor/dashboard', element: <DoctorDashboard /> },
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
