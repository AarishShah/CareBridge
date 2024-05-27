// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SignupPagePatient from './pages/SignupPagePatient';

// const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login/patient', element: <LoginPage /> },
  { path: '/login/doctor', element: <LoginPage /> },
  { path: '/signup/doctor', element: <SignupPage /> },
  { path: '/signup/patient', element: <SignupPagePatient /> }
]);

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    // </QueryClientProvider>
  );
}

export default App;
