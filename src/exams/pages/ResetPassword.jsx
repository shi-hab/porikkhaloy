import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { LoaderSubmit } from "../components/atoms/LoaderSubmit";
import { useResetPasswordMutation } from "@/features/auth/authApi";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Redirect if email or token is missing
  useEffect(() => {
    if (!email || !token) {
      navigate("/");
    }
  }, [email, token, navigate]);

  const userResetPassword = async (data) => {
    try {
      const res = await resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (res.data?.status_code === 200) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.error?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-md lg:max-w-xl">
        <form onSubmit={handleSubmit(userResetPassword)}>
          <div className="grid gap-4">
            {/* Password Field */}
            <div className="grid gap-1 relative">
              <div className="relative">
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
                  placeholder="New password"
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
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="grid gap-1 relative">
              <div className="relative">
                <Input
                  {...register("password_confirmation", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") ||
                      "Passwords do not match",
                  })}
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Confirm password"
                  type={showConfirmPass ? "text" : "password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
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
                  {showConfirmPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-600 text-sm">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button disabled={isLoading}>
              {isLoading ? <LoaderSubmit /> : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;