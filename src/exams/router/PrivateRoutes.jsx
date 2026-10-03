import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { setPostAuthRedirect } from "../components/utils/authRedirect";

export default function PrivateRoutes() {
  const isLoggedIn = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    const returnTo = `${location.pathname}${location.search}`;
    // Same belt-and-suspenders approach as the exam-row click handler:
    // router state for the immediate redirect, sessionStorage as a
    // backup that survives a refresh or a hard navigation to /login.
    setPostAuthRedirect(returnTo);

    return <Navigate to="/login" state={{ from: returnTo }} replace />;
  }

  return <Outlet />;
}