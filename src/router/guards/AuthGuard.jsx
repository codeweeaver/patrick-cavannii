import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthGuard = ({ allowedRoles, loginPath = '/login' }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  console.log(user);

  if (!user && !token) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
