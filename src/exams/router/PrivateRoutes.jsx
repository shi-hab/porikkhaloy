import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({ children }) => {
  const isLoggedIn = useAuth();

  // Render children if logged in; otherwise, redirect to the login page
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;
