// c:/Users/CODEWEEAVER/Desktop/react-wp-app/patrick-cavanni/src/router/guards/GuestGuard.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const GuestGuard = () => {
  const { user, token } = useAuth();

  // If user is already logged in, redirect to home
  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
