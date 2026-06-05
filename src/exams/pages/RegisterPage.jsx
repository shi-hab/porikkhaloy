import { Link } from "react-router-dom";
import RegisterForm from "./../components/molecules/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center px-2 pt-4">
      <div className="w-full max-w-lg bg-white py-4 rounded-md">
          <div className="flex justify-center  items-center">
            <div className="text-2xl font-bold text-red-900">
              নিজের নতুন একাউন্ট খুলো!
            </div>
          </div>

        <div className="p-6">
          <RegisterForm />
        </div>

        <div className="text-center py-4">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="underline font-bold text-blue-800">
              Log In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
