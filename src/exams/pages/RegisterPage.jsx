import { Link, useLocation } from "react-router-dom";
import RegisterForm from "./../components/molecules/auth/RegisterForm";
import Logo from "../components/atoms/Logo";
import { getPostAuthRedirect } from "../components/utils/authRedirect";

const RegisterPage = () => {
  const location = useLocation();
  const from = getPostAuthRedirect(location.state, null);

  return (
    <div className="  lg:flex lg:items-center lg:justify-center lg:px-6 lg:py-10 ">
      <div className="w-full">
        <div className="flex justify-center py-5 lg:pb-6 lg:pt-0">
          <Logo />
        </div>

        <RegisterForm />

        <p className="py-5 text-center text-sm text-slate-600">
          আগে থেকেই একাউন্ট আছে?{" "}
          <Link
            to="/login"
            state={from ? { from } : undefined}
            className="font-bold text-[#0E7C7B] underline-offset-4 hover:underline"
          >
            লগইন করো
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;