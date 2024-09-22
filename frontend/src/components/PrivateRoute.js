import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, children }) => {
  const location = useLocation(); // Get the current location

  return isLoggedIn ? (
    children
  ) : (
    // Pass the current location as state when redirecting to the login page
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
