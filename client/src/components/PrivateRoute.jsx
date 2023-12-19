import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { VerifyToken } from '../utils/auth';

export default function PrivateRoute() {
  const location = useLocation();
  const { isAuth } = VerifyToken(location.key);

  return isAuth ? <Outlet /> : <Navigate to='/sign-in' />;
}
