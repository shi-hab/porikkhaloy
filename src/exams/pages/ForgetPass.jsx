import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useResendEmailVerificationMutation } from "@/features/auth/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderSubmit } from "../components/atoms/LoaderSubmit";

const ForgetPass = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm();
	const navigate = useNavigate();
	const [resendEmailVerification, { data, isLoading, error }] = useResendEmailVerificationMutation();

	const handleLogin = async(formData) => {
		const res = await resendEmailVerification(formData);

		if (res.data.status_code == 200) {
			toast.success(res.data.message);
		}
	}

	useEffect(() => {
		if (error?.data) {
			setError("root.random", {
				type: "random",
				message: error.data?.message,
			});

			toast.error(error.data?.message);
		}

		if (data && data?.data?.token) {
			navigate("/exams");
		}
	}, [data, error, navigate, setError]);
	return (
    <form
      className="py-10 xl:pt-20 h-[80vh]"
      onSubmit={handleSubmit(handleLogin)}
    >
      <div className="grid gap-4 max-w-xl mx-auto bg-white rounded-md p-5 xl:p-10 shadow border">
        <div className="grid gap-2 ">
          <h1 className="text-2xl font-bold text-gray-600">
            Forgotten Password
          </h1>
          <span className="text-base">
            Enter Your Email to fix your password
          </span>
        </div>
        <div className="grid gap-1">
          <div className="flex items-center">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
          </div>
          <Input
            {...register("email", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Your email must be at least 8 characters",
              },
            })}
            id="email"
            name="email"
            type="email"
            placeholder="email"
          />
          <Link
            to={"/login"}
            className="text-right text-sm hover:underline text-gray-500"
          >
            Remember Password?
          </Link>
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
        </div>
        <p className="text-red-600">{errors?.root?.random?.message}</p>
        <Button
          className="!py-6 bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
          disabled={isLoading}
        >
          {isLoading ? <LoaderSubmit /> : "Change Password"}
        </Button>
      </div>
    </form>
  );
}

export default ForgetPass