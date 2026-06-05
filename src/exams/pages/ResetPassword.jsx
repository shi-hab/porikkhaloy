import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderSubmit } from "../components/atoms/LoaderSubmit";
import { useResetPasswordMutation } from "@/features/auth/authApi";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { register, handleSubmit, formState: { errors } } = useForm();

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
    <form
      className="py-10 xl:pt-20 h-[80vh]"
      onSubmit={handleSubmit(userResetPassword)}
    >
      <div className="grid gap-4 max-w-xl mx-auto bg-white rounded-md p-5 xl:p-10 shadow border">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold text-gray-600">Reset Password</h1>
          <span className="text-base">Enter your new password below</span>
        </div>

        {/* Password Field */}
        <div className="grid gap-1">
          <Label htmlFor="password" className="text-base">
            Password
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
            type="password"
            placeholder="New password"
          />
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="grid gap-1">
          <Label htmlFor="password_confirmation" className="text-base">
            Confirm Password
          </Label>
          <Input
            {...register("password_confirmation", {
              required: "Confirm password is required",
              minLength: {
                value: 8,
                message: "Your password must be at least 8 characters",
              },
            })}
            id="password_confirmation"
            type="password"
            placeholder="Confirm password"
          />
          {errors.password_confirmation && (
            <p className="text-red-600">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          className="!py-6 bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
          disabled={isLoading}
        >
          {isLoading ? <LoaderSubmit /> : "Change Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
