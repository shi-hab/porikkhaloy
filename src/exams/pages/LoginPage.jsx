import { Link, useLocation } from "react-router-dom";
import LoginForm from "./../components/molecules/auth/LoginForm";
// import { Button } from "@/components/ui/button";
// import { FaFacebookF } from "react-icons/fa";
import { isApp, getAppVersion } from './../../utils/device';
import { getPostAuthRedirect } from "../components/utils/authRedirect";

const LoginPage = () => {
  const location = useLocation();
  // Whatever page the student was trying to reach (an exam, a protected
  // route, etc). Carried forward to the registration link below so that
  // switching from Login -> Register doesn't lose it.
  const from = getPostAuthRedirect(location.state, null);

  // const handleFacebookLogin = () => {
  //   window.location.href =
  //     "https://app.porikkhaloy.com/student/auth/facebook/redirect";
  // };
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 -mb-20">
      <div className="w-full max-w-md lg:max-w-xl">
        {/* Mascot */}
        <div className="flex justify-center">
          <img
            src="https://app.porikkhaloy.com/public/images/id_443_1783973799.png"
            alt="Pori Mascot"
            className="w-64 sm:w-72 md:w-80 lg:w-96 h-auto object-contain"
            draggable={false}
          />
        </div>

        {/* Login Form */}
        <div>
          <LoginForm />
        </div>

        {/* Register */}
        <div className="mt-6 text-center border-t pt-5">
          <span className="text-sm text-gray-600">
            তুমি কি অ্যাপে নতুন?{" "}
            <Link
              to="/registration"
              state={from ? { from } : undefined}
              className="font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2 transition"
            >
              নতুন একাউন্ট খুলো
            </Link>
          </span>
        </div>

        {isApp() && (
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Version {getAppVersion() ?? "1.2.5"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;