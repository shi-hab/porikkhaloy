import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft, Loader2, Camera, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    if (window.confirm("তুমি কি নিশ্চিত তোমার অ্যাকাউন্ট মুছে ফেলতে চাও?")) {
      try {
        await deleteAccount(token).unwrap();
        toast.success("অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে");
      } catch (err) {
        toast.error("অ্যাকাউন্ট মুছতে ব্যর্থ হয়েছে");
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
        // Locked academic fields: kept exactly as returned by the API and
        // never mutated by the UI, so they can never be submitted as empty/null.
        section_id: p.section_id ?? "",
        level_id: p.level_id ?? "",
        group_id: p.group_id ?? "",
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
        setImageError("শুধুমাত্র jpg, jpeg এবং png ফরম্যাট গ্রহণযোগ্য।");
        return;
      }
      if (!isValidSize) {
        setImageError("ফাইলের সাইজ ২ MB এর বেশি হতে পারবে না।");
        return;
      }

      setImageError("");
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const onSubmit = async (formValues) => {
    const payload = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined) payload.append(key, value);
    });
    if (profileImage instanceof File)
      payload.append("profile_image", profileImage);

    try {
      await updateProfile(payload).unwrap();
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.data?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে");
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
        section_id: p.section_id ?? "",
        level_id: p.level_id ?? "",
        group_id: p.group_id ?? "",
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

  // Resolve human-readable labels for the locked academic fields.
  const sectionTitle = sections?.find((s) => s.id == profile?.section_id)?.title;
  const groupTitle = groups
    ?.filter((g) => g.status == true)
    ?.find((g) => g.id == profile?.group_id)?.title;
  const levelTitle = levels
    ?.filter((l) => l.status == true)
    ?.find((l) => l.id == profile?.level_id)?.title;

  const highlightStats = [
    {
      id: 1,
      title: "পজিশন",
      count: self?.position ?? "—",
      link: "/leaderboard",
      icon: "🏆",
      from: "from-amber-400",
      to: "to-orange-500",
    },
    {
      id: 6,
      title: "পয়েন্ট'স",
      count: self?.total_marks || 0,
      link: "/leaderboard",
      icon: "⚡",
      from: "from-indigo-500",
      to: "to-violet-600",
    },
  ];

  const secondaryStats = [
    {
      id: 2,
      title: "যুক্ত হয়েছো",
      count: profile?.subscriptions?.length || 0,
      link: "/user/packages",
      icon: "🏫",
      tint: "bg-sky-50 text-sky-600",
    },
    {
      id: 3,
      title: "মোট পরীক্ষা",
      count: profile?.total_exam_done || 0,
      link: "/user/exam-history",
      icon: "📝",
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 4,
      title: "ডাউট সল্ভ",
      count: profile?.doubt_solve || 0,
      link: "/user/question-feedback",
      icon: "❓",
      tint: "bg-rose-50 text-rose-600",
    },
    {
      id: 5,
      title: "মেন্টরিং",
      count: profile?.mentoring || 0,
      link: "/user/mentor-feedback",
      icon: "👨‍🏫",
      tint: "bg-violet-50 text-violet-600",
    },
  ];

  const academicBadges = [sectionTitle,  levelTitle].filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-10">
      {!isEditing ? (
        <div className="space-y-5">
          {/* Profile header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 shadow-sm ring-1 ring-slate-100">
            {/* Decorative depth */}
            <div className="pointer-events-none absolute -top-12 -right-8 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />

            {/* Tagline as a quiet backdrop, not competing with the user's info */}
            <p className="relative px-6 pt-6 text-center text-xs md:text-sm font-semibold tracking-wide text-white/35">
              যখন ইচ্ছা, যতবার ইচ্ছা, পরীক্ষা দাও "পরীক্ষালয়ে"
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 hover:bg-white/25 transition"
            >
              <Edit size={14} />
              এডিট করো
            </button>

            {/* User info overlays the cover itself */}
            <div className="relative flex sm:flex-row sm:items-end gap-4 px-5 pt-10 pb-6">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl border-4 border-white/90 object-cover shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl font-bold text-white border-4 border-white/90 shadow-lg">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}

              <div className="flex-1 pt-2 sm:pt-0">
                <h3 className="text-xl md:text-2xl font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">
                  {profile?.name || "নাম দেওয়া হয়নি"}
                </h3>
                <p className="text-sm text-white/70 mt-0.5">
                  আইডি : #{String(profile?.id || "০").padStart(6, "0")}
                </p>

                {academicBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {academicBadges.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 ring-1 ring-white/25"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Highlight stats: position & points */}
          <div className="grid grid-cols-2 gap-3">
            {highlightStats.map((s) => (
              <Link
                key={s.id}
                to={s.link}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.from} ${s.to} p-4 shadow-sm text-white transition-transform hover:-translate-y-0.5`}
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="mt-2 text-2xl font-extrabold leading-none">{s.count}</div>
                <div className="text-xs font-medium text-white/85 mt-1">{s.title}</div>
              </Link>
            ))}
          </div>

          {/* Practice streak */}
          <PracticeStreak studentStreakDay={studentStreakDay} />

          {/* Secondary stats */}
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {secondaryStats.map((s) => (
                <Link
                  key={s.id}
                  to={s.link}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-4 hover:bg-slate-50 transition"
                >
                  <div className={`h-11 w-11 rounded-full flex items-center justify-center text-lg ${s.tint}`}>
                    {s.icon}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{s.count}</div>
                  <div className="text-[11px] font-medium text-slate-500 text-center leading-tight">
                    {s.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 transition"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "মুছে ফেলা হচ্ছে..." : "অ্যাকাউন্ট মুছে ফেলো"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="h-9 w-9 grid place-content-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-lg font-bold text-slate-900">প্রোফাইল এডিট করো</h2>
          </div>

          <Card className="rounded-3xl border-0 shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-5 md:p-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-2xl bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
                      {profile?.name?.[0]}
                    </div>
                  )}
                  <label className="absolute -bottom-1.5 -right-1.5 h-8 w-8 grid place-content-center rounded-full bg-indigo-600 text-white shadow-md cursor-pointer hover:bg-indigo-700 transition">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {imageError && (
                  <p className="text-xs text-red-500 mt-2">{imageError}</p>
                )}
              </div>

              {/* Editable personal info */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">
                  ব্যক্তিগত তথ্য
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>তোমার নাম</Label>
                    <Input className="mt-1.5" {...register("name")} />
                  </div>
                  <div>
                    <Label>ইমেইল আইডি</Label>
                    <Input className="mt-1.5" {...register("email")} />
                  </div>
                  <div>
                    <Label>তোমার নাম্বার</Label>
                    <Input className="mt-1.5" {...register("phone")} />
                  </div>
                  <div>
                    <Label>কলেজের নাম</Label>
                    <Input className="mt-1.5" {...register("country")} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>সম্পূর্ণ ঠিকানা</Label>
                    <Input className="mt-1.5" {...register("address")} />
                  </div>
                </div>
              </div>

              {/* Locked academic info — visible, never editable, values pass through untouched */}
              {academicBadges.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      একাডেমিক তথ্য
                    </p>
                    <ShieldCheck size={13} className="text-slate-300" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sectionTitle && (
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
                        <div className="text-[11px] text-slate-400 mb-0.5">ব্যাচ</div>
                        <div className="text-sm font-semibold text-slate-600">{sectionTitle}</div>
                      </div>
                    )}
                  
                    {levelTitle && (
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
                        <div className="text-[11px] text-slate-400 mb-0.5">মাধ্যম</div>
                        <div className="text-sm font-semibold text-slate-600">{levelTitle}</div>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    এই তথ্য পরিবর্তনের প্রয়োজন হলে সাপোর্টে যোগাযোগ করো।
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Lock size={13} className="text-slate-400" />
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    পাসওয়ার্ড পরিবর্তন
                  </p>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  পরিবর্তন করতে না চাইলে খালি রাখো
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Label>নতুন পাসওয়ার্ড</Label>
                    <Input
                      type="password"
                      className="mt-1.5"
                      {...register("password", {
                        minLength: {
                          value: 8,
                          message: "পাসওয়ার্ড কমপক্ষে ৮ ক্যারেক্টার হতে হবে",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Label>পাসওয়ার্ড নিশ্চিত করো</Label>
                    <Input
                      type="password"
                      className="mt-1.5"
                      {...register("password_confirmation", {
                        validate: (value) =>
                          value === watch("password") ||
                          "পাসওয়ার্ড মিলছে না",
                      })}
                    />
                    {errors.password_confirmation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  বাতিল করো
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      আপডেট হচ্ছে...
                    </>
                  ) : (
                    "পরিবর্তন সেভ করো"
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