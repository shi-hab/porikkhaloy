import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import { useLoggedInMutation } from "@/features/auth/authApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { useResendVerifyAccountMutation } from "@/features/categories/categoriesApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm();

  const [loggedIn, { data, isLoading, error }] = useLoggedInMutation();
  const [resendVerifyAccount] = useResendVerifyAccountMutation();

  const handleLogin = (formData) => {
    loggedIn(formData);
  };

  useEffect(() => {
    const res = error?.data;
    if (!res) return;

    const errors = res?.errors || {};

    // reset previous server errors first (IMPORTANT)
    Object.keys(errors).forEach((key) => {
      setError(key, {
        type: "server",
        message: errors[key],
      });
    });

    if (!errors.email && !errors.password && res.message) {
      setError("root.serverError", {
        type: "server",
        message: res.message,
      });
    }
  }, [error, setError]);


  useEffect(() => {
    if (data?.data?.token) {

      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        user_id: null,
        user_email: null,
        user_phone: null,
      });

      window.dataLayer.push({
        event: "user_login",
        user_id: data?.data?.student?.id,
        user_email: data?.data?.student?.email,
        user_phone: data?.data?.student?.phone,
      });

      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  }, [data, error, navigate, setError]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("login_email");
    const savedPass = localStorage.getItem("login_password");

    if (savedEmail) setValue("email", savedEmail);
    if (savedPass) setValue("password", savedPass);

    // একবার ব্যবহার হয়ে গেলে মুছে ফেলুন
    localStorage.removeItem("login_email");
    localStorage.removeItem("login_password");


    setTimeout(() => {
      handleSubmit(handleLogin)();
    }, 0);

  }, [setValue]);

  const resendEmail = async () => {
    const res = await resendVerifyAccount({ email: watch("email") });
    if (res.data?.status_code == 200) {
      toast.success(res?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="email" className="text-base">
            ইমেইল আইডি
          </Label>
          <Input
            {...register("email", { required: "Email is Required" })}
            id="email"
            name="email"
            type="email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1 relative">
          <Label htmlFor="password" className="text-base">
            পাসওয়ার্ড
          </Label>
          <Input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Your password must be at least 8 characters",
              },
            })}
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
          />
          {showPass ? (
            <EyeOff
              onClick={() => setShowPass(!showPass)}
              size={18}
              className="absolute right-3 top-[35px] cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShowPass(!showPass)}
              size={18}
              className="absolute right-3 top-[35px] cursor-pointer"
            />
          )}

          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}

          <Link
            to="/forgot-password"
            className="text-sm text-right text-gray-500 hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছো?
          </Link>
        </div>

        {/* Root / Server error display */}
        {errors?.root?.serverError?.message && (
          <div className="text-sm text-red-600 text-center">
            {errors.root.serverError.message === "Email Not Verified" ? (
              <>
                <span>ইমেইল ভেরিফাই করা হয়নি।</span>{" "}
                <button
                  type="button"
                  onClick={resendEmail}
                  className="text-red-500 underline ml-2"
                >
                  পুনরায় ভেরিফিকেশন পাঠাও
                </button>
              </>
            ) : (
              errors.root.serverError.message
            )}
          </div>
        )}

        <Button
          disabled={isLoading}
          className="bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
        >
          {isLoading ? <LoaderSubmit /> : "লগইন করো"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
