import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import LoginForm from "./../components/molecules/auth/LoginForm";
// import { Button } from "@/components/ui/button";
// import { FaFacebookF } from "react-icons/fa";

const LoginPage = () => {
  // const handleFacebookLogin = () => {
  //   window.location.href =
  //     "https://app.porikkhaloy.com/student/auth/facebook/redirect";
  // };
  return (
    <div className=" flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="p-6 border-b bg-blue-200 rounded-t-lg border-gray-200">
          <div className="flex justify-center items-center">
            <CardTitle className="text-2xl  font-bold text-blue-900">
              লগইন করো!
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <LoginForm />

      
        </CardContent>

        <div className="text-center py-4 border-t rounded-b-lg bg-blue-200 border-gray-200">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="underline font-bold text-blue-800"
            >
              Register
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
