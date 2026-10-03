import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegistrationMutation, useLoggedInMutation } from "@/features/auth/authApi";
import { useGetCategoryQuery } from "@/features/categories/categoriesApi";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useCategoryData } from "../filterquesforexam/useCategoryData";
import { Select } from "antd";
import { LoaderSubmit } from "../../atoms/LoaderSubmit";
import { getPostAuthRedirect, setPostAuthRedirect } from "../../utils/authRedirect";

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
  const location = useLocation();
  const [ipAddress, setIpAddress] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Where to redirect after auth — GuestRoute will read this and navigate
  const from = getPostAuthRedirect(location.state, "/dashboard");

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

  // Auto-login mutation — called directly after successful registration
  const [loggedIn, { isLoading: loginLoading }] = useLoggedInMutation();

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
    payload.append("active_status", "1");
    payload.append("ip_address", ipAddress);
    payload.append("section_id", formData.section);
    payload.append("group_id", formData.group);
    payload.append("level_id", formData.level || "19");

    registration(payload);
  };

  // Handle registration errors
  useEffect(() => {
    const res = error?.data;
    if (!res) return;

    const errs = res?.errors || {};

    // reset previous server errors first (IMPORTANT)
    Object.keys(errs).forEach((key) => {
      setError(key, {
        type: "server",
        message: Array.isArray(errs[key]) ? errs[key][0] : errs[key],
      });
    });

    if (Object.keys(errs).length === 0 && res.message) {
      setError("root.serverError", {
        type: "server",
        message: res.message,
      });
    }
  }, [error, setError]);

  // After successful registration — auto-login directly (no localStorage hack)
  useEffect(() => {
    if (isSuccess && data?.data) {
      toast.success("রেজিস্ট্রেশন সফল! লগইন হচ্ছে...");

      // Persist the redirect target so GuestRoute can pick it up after
      // the login mutation updates Redux auth state
      setPostAuthRedirect(from);

      // Call login API directly — no page navigation needed
      loggedIn({
        email: watch("email"),
        password: watch("password"),
      });
    }
  }, [isSuccess, data]);

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <input type="hidden" name="active_status" value={1} />

      <div className="grid gap-4 ">
        {/* নাম */}
        <div className="grid gap-1">
          <Input
            {...register("firstName", { required: "Name is Required" })}
            id="firstName"
            name="firstName"
            placeholder="তোমার নাম"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="grid gap-1">
          <Input
            {...register("email", { required: "Email is Required" })}
            id="email"
            name="email"
            type="email"
            placeholder="ইমেইল আইডি"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="grid gap-1">
          <Input
            {...register("phone", { required: "Phone number is Required" })}
            id="phone"
            name="phone"
            type="tel"
            placeholder="ফোন নাম্বার"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* গ্রুপ ও ব্যাচ সিলেক্ট করো */}
        <div className="flex gap-4">
          <div className="grid gap-1 w-full">
            <Select
              placeholder="গ্রুপ নির্বাচন করুন"
              className="
                w-full
                [&_.ant-select-selector]:!h-10
                [&_.ant-select-selector]:!rounded-md
                [&_.ant-select-selector]:!border-input
                [&_.ant-select-selector]:!bg-background
                [&_.ant-select-selector]:!px-3
                [&_.ant-select-selector]:!flex
                [&_.ant-select-selector]:!items-center
                [&_.ant-select-selection-item]:!text-sm
                [&_.ant-select-selection-placeholder]:!text-sm
                [&_.ant-select-selection-placeholder]:!text-muted-foreground
                [&_.ant-select-selection-search-input]:!h-10
              "
              value={watch("group_name")}
              onChange={(value) => setValue("group_name", value)}
              options={[
                { label: "Science", value: "Science" },
                { label: "Arts", value: "Arts" },
                { label: "Commerce", value: "Commerce" },
              ]}
            />
          </div>

          <div className="grid gap-1 w-full">
            <Select
              placeholder="ব্যাচ নির্বাচন করুন"
              className="
                w-full
                [&_.ant-select-selector]:!h-10
                [&_.ant-select-selector]:!rounded-md
                [&_.ant-select-selector]:!border-input
                [&_.ant-select-selector]:!bg-background
                [&_.ant-select-selector]:!px-3
                [&_.ant-select-selector]:!flex
                [&_.ant-select-selector]:!items-center
                [&_.ant-select-selection-item]:!text-sm
                [&_.ant-select-selection-placeholder]:!text-sm
                [&_.ant-select-selection-placeholder]:!text-muted-foreground
                [&_.ant-select-selection-search-input]:!h-10
              "
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
        </div>

        {/* Password Field */}
        <div className="grid gap-1 relative mt-2">
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
              placeholder="নতুন পাসওয়ার্ড"
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
            <p className="text-red-600 text-sm">{errors.password.message}</p>
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

        {/* Root / Server error display */}
        {errors?.root?.serverError?.message && (
          <div className="text-sm text-red-600 text-center">
            {errors.root.serverError.message}
          </div>
        )}
        {errors?.root?.random?.message && (
          <div className="text-sm text-red-600 text-center">
            {errors.root.random.message}
          </div>
        )}

        {/* Submit Button — shows loading during registration OR auto-login */}
        <Button disabled={isLoading || loginLoading} className="mt-10">
          {isLoading ? <LoaderSubmit /> : loginLoading ? <LoaderSubmit /> : "Registration"}
        </Button>
      </div>
    </form>
  );
}