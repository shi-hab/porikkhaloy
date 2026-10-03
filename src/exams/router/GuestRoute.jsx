import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getPostAuthRedirect, clearPostAuthRedirect } from "../components/utils/authRedirect";

export default function GuestRoute() {
    const isLoggedIn = useAuth();
    const location = useLocation();

    if (isLoggedIn) {
        const redirectTo = getPostAuthRedirect(location.state, "/dashboard");
        clearPostAuthRedirect();
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}