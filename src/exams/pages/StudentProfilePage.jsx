import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaUserCog } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} from "@/features/auth/authApi";
import { useGetCategoryQuery } from "@/features/categories/categoriesApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCategoryData } from "../components/molecules/filterquesforexam/useCategoryData";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetDashboardDataQuery } from "@/features/studentDashboard/dashboardApi";
import PracticeStreak from './studentDashboard/PracticeStreak';

const StudentProfilePage = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetProfileQuery();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
    
    const { data } = useGetDashboardDataQuery();
    
    const self = data?.self || null;
    const studentStreakDay = data?.studentStreakDay || [];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteAccount(token).unwrap();
        alert("Account deleted successfully");
      } catch (err) {
        alert("Failed to delete account");
        console.log(err);
      }
    }
  };

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [preview, setPreview] = useState(null);

  const { data: sectionsData } = useGetCategoryQuery("sections");
  const { categories: groups } = useCategoryData("groups");
  const { categories: levels } = useCategoryData("levels");

  const sections = sectionsData?.data?.data?.filter((s) => s.status == true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      section_id: "",
      group_id: "",
      level_id: "",
    },
  });

  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      reset({
        name: p.name || "",
        email: p.email || "",
        phone: p.phone || "",
        country: p.country || "",
        address: p.address || "",
        section_id: p.section_id || "",
        level_id: p.level_id || "",
        group_id: p.group_id || "",
      });
      if (p.profile_image) setPreview(p.profile_image);
    }
  }, [profileData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const isValidSize = file.size <= 2 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setImageError("Only jpg, jpeg, and png formats are allowed.");
        return;
      }
      if (!isValidSize) {
        setImageError("File size should not exceed 2 MB.");
        return;
      }

      setImageError("");
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const onChange = (name, value) => {
    setValue(name, value);
  };

  const onSubmit = async (data) => {
    const payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) payload.append(key, value);
    });
    if (profileImage instanceof File)
      payload.append("profile_image", profileImage);

    try {
      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageError("");
    setProfileImage(null);
    if (profileData?.data) {
      const p = profileData.data;
      reset({
        name: p.name || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
        country: p.country || "",
        section_id: p.section_id || "",
        level_id: p.level_id || "",
        group_id: p.group_id || "",
      });
      setPreview(p.profile_image);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="grid w-full h-screen place-content-center">
        <Spin />
      </div>
    );
  }

  const profile = profileData?.data;

  const packages = [
    {
      id: 1,
      title: "পজিশন",
      count: self?.position,
      link: "/leaderboard",
      icon: "🏆",
    },
    {
      id: 6,
      title: "পয়েন্ট'স",
      count: self?.total_marks || 0,
      link: "/leaderboard",
      icon: "📦",
    },
    {
      id: 2,
      title: "যুক্ত হয়েছো",
      count: profile?.subscriptions?.length || 0,
      link: "/user/packages",
      icon: "🏫",
    },
    {
      id: 3,
      title: "মোট পরীক্ষা",
      count: profile?.total_exam_done || 0,
      link: "/user/exam-history",
      icon: "📝",
    },
    {
      id: 4,
      title: "ডাউট সল্ভ",
      count: profile?.doubt_solve || 0,
      link: "/user/question-feedback",
      icon: "❓",
    },
    {
      id: 5,
      title: "মেন্টরিং",
      count: profile?.mentoring || 0,
      link: "/user/mentor-feedback",
      icon: "👨‍🏫",
    },
    // {
    //   id: 6,
    //   title: "Affiliate",
    //   link: "/affiliate",
    //   icon: "💰",
    // },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-10 max-w-5xl mx-auto relative">
      {/* Edit Button */}
      <div className="absolute md:top-10 md:left-10 top-4 right-4 z-10">
        <button
          className="bg-blue-600 p-2 text-white md:rounded-br-sm rounded-bl-sm shadow-md hover:bg-blue-700 transition"
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
        >
          {isEditing ? <ArrowLeft size={18} /> : <Edit size={18} />}
        </button>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 gap-4">
          {/* Profile Info */}
          <div className="flex flex-col  bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-full ">
              {/* Cover */}
              <div className="rounded-t-sm h-32 md:h-48 bg-gradient-to-r from-blue-900 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 flex items-center justify-center px-4 text-center">
                <h2 className="text-xl md:text-4xl font-bold text-white">
                  যখন ইচ্ছা, যতবার ইচ্ছা, পরীক্ষা দাও "পরীক্ষালয়ে"
                </h2>
              </div>

              {/* Profile Image + Name + Bio */}
              <div className="flex items-center rounded-b-sm bg-white space-x-4 md:space-x-6 px-4 py-4 relative">
                <div className="relative -mt-16">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="h-20 w-20 md:h-28 md:w-28 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="h-20 w-20 md:h-28 md:w-28 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl md:text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                      {profile?.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.name || "নাম দেওয়া হয়নি"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                    আইডি : #
                    {String(profile?.id || "আইডি দেওয়া হয়নি").padStart(
                      6,
                      "0",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* practice Streak */}
          <div>
            <PracticeStreak studentStreakDay={studentStreakDay} />
          </div>

          {/* Package List */}
          <div className=" bg-white p-4 rounded">
            
            <div>
              <div className="grid grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    to={pkg.link}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-4 bg-blue-50 dark:bg-gray-900 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-800 transition-all shadow-md"
                  >
                    <div className="bg-blue-100 dark:bg-gray-700 p-3 text-2xl rounded-full shadow-inner border border-blue-200 dark:border-gray-600">
                      {pkg?.icon}
                    </div>
                    <h4 className="text-center mt-2 text-[13px] sm:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                      {pkg.title}
                    </h4>
                    <div className="text-sm  font-bold text-indigo-700 dark:text-indigo-300">
                      {pkg?.count}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* <div>
            <BengaliCalendar />
          </div> */}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200
      ${
        isDeleting
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
            >
              {isDeleting ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="pt-6 bg-gray-100 dark:bg-gray-800">
            <CardContent className="space-y-4">
              <div className="relative w-24 h-24 m-auto">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center font-bold text-xl">
                    {profile?.name?.[0]}
                  </div>
                )}

                {/* Upload Icon/Button */}
                <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md cursor-pointer">
                  <FaUserCog size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Error Message */}
              {imageError && (
                <p className="text-sm text-red-500 mt-2">{imageError}</p>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>তোমার নাম</Label>
                  <Input {...register("name")} />
                </div>
                <div>
                  <Label>ইমেইল আইডি</Label>
                  <Input {...register("email")} />
                </div>
                <div>
                  <Label>তোমার নাম্বার</Label>
                  <Input {...register("phone")} />
                </div>
                <div>
                  <Label>কলেজের নাম</Label>
                  <Input {...register("country")} />
                </div>
                <div>
                  <Label>সম্পূর্ণ ঠিকানা</Label>
                  <Input {...register("address")} />
                </div>

                <div className="hidden">
                  <Label>কোন ব্যাচ</Label>
                  <Select
                    value={watch("section_id")}
                    onValueChange={(v) => onChange("section_id", v)}
                  >
                    <SelectTrigger>
                      {sections?.find((s) => s.id == watch("section_id"))
                        ?.title || "Select section"}
                    </SelectTrigger>
                    <SelectContent>
                      {sections?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="hidden">
                  <Label>কোন গ্রুপ</Label>
                  <Select
                    value={watch("group_id")}
                    onValueChange={(v) => onChange("group_id", v)}
                  >
                    <SelectTrigger>
                      {groups
                        ?.filter((g) => g.status)
                        ?.find((g) => g.id == watch("group_id"))?.title ||
                        "Select group"}
                    </SelectTrigger>
                    <SelectContent>
                      {groups
                        ?.filter((g) => g.status == true)
                        ?.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="hidden">
                  <Label>কোন মাধ্যম</Label>
                  <Select
                    value={watch("level_id")}
                    onValueChange={(v) => onChange("level_id", v)}
                  >
                    <SelectTrigger>
                      {levels
                        ?.filter((l) => l.status)
                        ?.find((l) => l.id == watch("level_id"))?.title ||
                        "Select level"}
                    </SelectTrigger>
                    <SelectContent>
                      {levels
                        ?.filter((l) => l.status == true)
                        ?.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full">
                <p className="text-gray-600 dark:text-gray-300 mt-8 mb-2">
                  পাসওয়ার্ড পরিবর্তন করতে না চাইলে খালি রাখো
                </p>

                <div className="grid md:grid-cols-2 gap-4 ">
                  {/* New Password */}
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">নতুন পাসওয়ার্ড</label>
                    <Input
                      type="password"
                      {...register("password", {
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      পাসওয়ার্ড নিশ্চিত করো
                    </label>
                    <Input
                      type="password"
                      {...register("password_confirmation", {
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
};

export default StudentProfilePage;
