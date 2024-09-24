import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
const api_base_url = import.meta.env.VITE_API_BASE_URL;

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`http://${api_base_url}/auth/check-session`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          // Session has expired or is invalid
          localStorage.removeItem('username'); // Remove username from localStorage
          window.location.href = '/login'; // Redirect to the login page
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []); // Run this effect only once after the component mounts

  const username = localStorage.getItem('username');

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // Properly return children as a React node
}

export default ProtectedRoute;
