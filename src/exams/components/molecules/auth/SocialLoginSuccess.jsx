import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/features/auth/authSlice"; // তোমার auth slice import

function SocialLoginSuccess() {
  const navigate = useNavigate(); // <-- এটা declare করা লাগবে
  const dispatch = useDispatch(); // <-- এটা declare করা লাগবে
  const query = new URLSearchParams(useLocation().search);

  const token = query.get("token");
  const name = query.get("name");
  const email = query.get("email");
  const id = query.get("id");

  useEffect(() => {
    if (token) {
      // token localStorage-এ save করা
      localStorage.setItem("authToken", token);

      // Redux state update
      dispatch(
        loggedIn({
          status: "success",
          message: "Logged in via Facebook",
          token,
          student: { id, name, email }, // student info set করা
        })
      );

      // Profile page এ redirect
      navigate("/user/profile");
    }
  }, [token, id, name, email, dispatch, navigate]);

  return <p>Logging in...</p>;
}

export default SocialLoginSuccess;
