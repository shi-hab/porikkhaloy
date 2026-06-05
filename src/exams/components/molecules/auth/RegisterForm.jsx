import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistrationMutation } from "@/features/auth/authApi";
import { useGetCategoryQuery } from "@/features/categories/categoriesApi";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCategoryData } from "../filterquesforexam/useCategoryData";
import { Select } from "antd";

const fetchUserIP = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return null;
  }
};

export default function RegisterForm() {
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState("");
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm();

  const {
    data: sections,
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useGetCategoryQuery("sections");

  const { categories: groups } = useCategoryData("groups");
  const { categories: levels } = useCategoryData("levels");

  const [registration, { data, isSuccess, isLoading, error }] =
    useRegistrationMutation();

  // Fetch user IP on component mount
  useEffect(() => {
    const getUserIP = async () => {
      const ip = await fetchUserIP();
      setIpAddress(ip);
    };
    getUserIP();
  }, []);

  // Set default values for Select fields
  useEffect(() => {
    if (sections?.data?.data?.length) {
      setValue("section", sections.data.data[0]?.id);
    }
    if (groups?.length) {
      setValue("group", groups[0]?.id);
    }
    if (levels?.length) {
      setValue("level", levels[0]?.id);
    }
  }, [sections, groups, levels, setValue]);

  // Password দিলে Confirm Password অটো সেট হবে
  useEffect(() => {
    setValue("password_confirmation", watch("password"));
  }, [watch("password"), setValue]);

  const handleRegister = (formData) => {
    const payload = new FormData();
    payload.append("name", formData.firstName);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("password_confirmation", formData.password_confirmation);
    payload.append("phone", formData.phone);
    payload.append("group_name", formData.group_name);
    payload.append("hsc_batch", formData.hsc_batch);
    payload.append("active_status", 1);
    payload.append("ip_address", ipAddress);
    payload.append("section_id", formData.section);
    payload.append("group_id", formData.group);
    payload.append("level_id", formData.level);

    registration(payload);
  };

  // Handle errors and success messages
  useEffect(() => {
    if (error?.data) {
      toast.error(error?.data?.message);

      if (error.data.errors) {
        Object.entries(error?.data?.errors).forEach(([field, messages]) => {
          setError(field, {
            type: "manual",
            message: messages[0],
          });
        });
      } else {
        setError("root.random", {
          type: "random",
          message: `Something went wrong: ${error?.data?.message}`,
        });
      }
    }

    if (isSuccess && data?.data) {
      // Email & Password localStorage তে রাখি
      localStorage.setItem("login_email", watch("email"));
      localStorage.setItem("login_password", watch("password"));

      toast.success("You’ve logged in successfully!");
      navigate("/user/profile");
    }
  }, [error, setError, isSuccess, data, navigate]);

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <input type="hidden" name="active_status" value={1} />

      <div className="grid gap-4 space-y-1 text-left">
        <div className="grid gap-1">
          <Label className="mb-0.5">তোমার নাম</Label>
          <Input {...register("firstName", { required: "Name is Required" })} />
        </div>

        {/* Email Field */}
        <div className="grid gap-1">
          <Label className="mb-0.5">ইমেইল আইডি</Label>
          <Input
            {...register("email", { required: "Email is Required" })}
            id="email"
            name="email"
            type="email"
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="grid gap-1">
          <Label className="mb-0.5">ফোন নাম্বার</Label>
          <Input
            {...register("phone", { required: "Phone number is Required" })}
            name="phone"
            type="tel"
          />
          {errors.phone && (
            <span className="text-red-600">{errors.phone.message}</span>
          )}
        </div>

        {/* গ্রুপ সিলেক্ট করো */}
        <div className="grid gap-1">
          <Label className="mb-0.5">গ্রুপ সিলেক্ট করো</Label>

          <Select
            placeholder="গ্রুপ নির্বাচন করুন"
            className="border rounded-md"
            value={watch("group_name")}
            onChange={(value) => setValue("group_name", value)}
            options={[
              { label: "Science", value: "Science" },
              { label: "Arts", value: "Arts" },
              { label: "Commerce", value: "Commerce" },
            ]}
          />
        </div>

        {/* ব্যাচ সিলেক্ট করো */}
        <div className="grid gap-1">
          <Label className="mb-0.5">ব্যাচ সিলেক্ট করো</Label>

          <Select
            placeholder="ব্যাচ নির্বাচন করুন"
            className="border rounded-md "
            value={watch("hsc_batch")}
            onChange={(value) => setValue("hsc_batch", value)}
            options={[
              { label: "HSC-24", value: "HSC-24" },
              { label: "HSC-25", value: "HSC-25" },
              { label: "HSC-26", value: "HSC-26" },
              { label: "HSC-27", value: "HSC-27" },
            ]}
          />
        </div>

        {/* Password Field */}
        <div className="grid gap-1 relative">
          <Label className="mb-0.5">নতুন পাসওয়ার্ড</Label>
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
            <span className="text-red-600">{errors.password.message}</span>
          )}
        </div>

        {/* Hidden Confirm Password Field */}
        <input
          type="hidden"
          {...register("password_confirmation", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />

        {/* Submit Button */}
        <Button
          className="bg-green-600  font-bold border-b-4 border-green-800 hover:bg-green-700 text-white dark:bg-green-500 dark:border-green-700 dark:hover:bg-green-600"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              অপেক্ষা করো...
            </>
          ) : (
            "রেজিস্ট্রেশন করো"
          )}
        </Button>
      </div>
    </form>
  );
}
