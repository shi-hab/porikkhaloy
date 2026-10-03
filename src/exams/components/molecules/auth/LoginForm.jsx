import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Input } from "../../../../components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import { useLoggedInMutation } from "@/features/auth/authApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { useResendVerifyAccountMutation } from "@/features/categories/categoriesApi";
import { getPostAuthRedirect } from "../../utils/authRedirect";

const LoginForm = () => {
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);

  // Prefers router state (location.state.from); falls back to
  // sessionStorage, which is what actually survives a refresh, a new
  // tab, or a link elsewhere in the app (e.g. a Header "Login" button)
  // that jumped straight to /login without passing state.
  const from = getPostAuthRedirect(location.state, "/dashboard");

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

      // GuestRoute detects the new auth state and redirects to `from`
      // automatically — no need to navigate here.
    }
  }, [data, error, setError]);

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
          <Input
            {...register("email", { required: true })}
            id="email"
            name="email"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1 relative">
          <div className="relative">
            <Input
              {...register("password", {
                required: true,
                minLength: {
                  value: 8,
                  message: "Your password must be at least 8 characters",
                },
              })}
              id="password"
              name="password"
              placeholder="Password"
              type={showPass ? "text" : "password"}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                flex
                items-center
                justify-center
                text-muted-foreground
                hover:text-foreground
                transition-colors
              "
            >
              {showPass ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}

          <Link
            to="/forgot-password"
            state={{ from }}
            className="text-sm text-right underline text-gray-500 hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছো?
          </Link>
        </div>

        {/* Root / Server error display */}
        {errors?.root?.serverError?.message && (
          <div className="text-sm text-red-600 text-center">
            {errors.root.serverError.message === "Email Not Verified" ? (
              <>
                <span>ইমেইল ভেরিফাই করা হয়নি।</span>{" "}
                <button
                  type="button"
                  onClick={resendEmail}
                  className="text-red-500 underline ml-2"
                >
                  পুনরায় ভেরিফিকেশন পাঠাও
                </button>
              </>
            ) : (
              errors.root.serverError.message
            )}
          </div>
        )}

        <Button
          disabled={isLoading}
          className="mt-10"
        >
          {isLoading ? <LoaderSubmit /> : "লগইন করো"}
        </Button>

        {/* If this form sits on a shared login/register page or has a
            separate "create account" link, carry `from` along so the
            student lands back on the same page after registering too:
            <Link to="/register" state={{ from }}>নতুন অ্যাকাউন্ট খুলুন</Link> */}
      </div>
    </form>
  );
};

export default LoginForm;