import { Link, useLocation } from "react-router-dom";
import RegisterForm from "./../components/molecules/auth/RegisterForm";
import Logo from "../components/atoms/Logo";
import { getPostAuthRedirect } from "../components/utils/authRedirect";

const RegisterPage = () => {
  const location = useLocation();
  // Same idea, mirrored: carry `from` forward to the "Log In" link so a
  // student who lands on Register first (then decides to log in instead)
  // still gets sent back to the exam/page they originally wanted.
  const from = getPostAuthRedirect(location.state, null);

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-md lg:max-w-xl">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="">
          <RegisterForm />
        </div>

        <div className="text-center py-4">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              state={from ? { from } : undefined}
              className="underline font-bold text-blue-800"
            >
              Log In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;