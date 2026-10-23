import { Edit, Loader2, Trash2, Phone, Mail, User, CalendarDays, MapPin, School, Building2, GraduationCap, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery, useDeleteAccountMutation } from "@/features/auth/authApi";
import { useGetDashboardDataQuery } from "@/features/studentDashboard/dashboardApi";
import PracticeStreak from "./studentDashboard/PracticeStreak";
import StudentEditProfile from "./studentDashboard/components/StudentEditProfile";
import { GENDER_LABEL, TARGET_LABEL } from "./studentDashboard/components/Academicconfig";

const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d) ? "" : d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
};

const StudentProfilePage = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const { data } = useGetDashboardDataQuery();
  const [isEditing, setIsEditing] = useState(false);

  const self = data?.self || null;
  const studentStreakDay = data?.studentStreakDay || [];

  const handleDelete = async () => {
    if (!window.confirm("তুমি কি নিশ্চিত তোমার অ্যাকাউন্ট মুছে ফেলতে চাও?")) return;
    try {
      await deleteAccount(token).unwrap();
      toast.success("অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে");
    } catch {
      toast.error("অ্যাকাউন্ট মুছতে ব্যর্থ হয়েছে");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="grid h-screen w-full place-content-center">
        <Spin />
      </div>
    );
  }

  const profile = profileData?.data;

  if (isEditing) {
    return (
      <div className="p-2">
        <StudentEditProfile
          key={profile?.updated_at} // remount with fresh defaults after a save
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // StudentResource already returns section / group / level titles
  const academicBadges = [profile?.section, profile?.group, profile?.level].filter(Boolean);
  const p = profile?.profile;

  const infoItems = [
    { icon: Phone, label: "ফোন", value: profile?.phone },
    { icon: Mail, label: "ইমেইল", value: profile?.email },
    { icon: User, label: "লিঙ্গ", value: GENDER_LABEL[p?.gender] },
    { icon: CalendarDays, label: "জন্ম তারিখ", value: formatDate(p?.date_of_birth) },
    { icon: Target, label: "লক্ষ্য", value: TARGET_LABEL[p?.target] },
    { icon: GraduationCap, label: "ব্যাচ", value: p?.hsc_batch || p?.ssc_batch },
    { icon: School, label: "স্কুল", value: p?.school_name },
    { icon: Building2, label: "কলেজ", value: p?.college_name },
    { icon: MapPin, label: "ঠিকানা", value: profile?.address },
  ].filter((i) => i.value);

  const highlightStats = [
    { id: 1, title: "পজিশন", count: self?.position ?? "—", link: "/leaderboard", icon: "🏆", from: "from-amber-400", to: "to-orange-500" },
    { id: 6, title: "পয়েন্ট'স", count: self?.total_marks || 0, link: "/leaderboard", icon: "⚡", from: "from-indigo-500", to: "to-violet-600" },
  ];

  const secondaryStats = [
    { id: 2, title: "যুক্ত হয়েছো", count: profile?.subscriptions?.length || 0, link: "/user/packages", icon: "🏫", tint: "bg-sky-50 text-sky-600" },
    { id: 3, title: "মোট পরীক্ষা", count: profile?.total_exam_done || 0, link: "/user/exam-history", icon: "📝", tint: "bg-emerald-50 text-emerald-600" },
    { id: 4, title: "ডাউট সল্ভ", count: profile?.doubt_solve || 0, link: "/user/question-feedback", icon: "❓", tint: "bg-rose-50 text-rose-600" },
    { id: 5, title: "মেন্টরিং", count: profile?.mentoring || 0, link: "/user/mentor-feedback", icon: "👨‍🏫", tint: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="mx-auto p-2">
      <div className="space-y-5">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-900 shadow-sm ring-1 ring-slate-100">
          <div className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-indigo-400/20 blur-3xl" />

          <p className="relative px-6 pt-6 text-center text-xs font-semibold tracking-wide text-white/35 md:text-sm">
            যখন ইচ্ছা, যতবার ইচ্ছা, পরীক্ষা দাও "পরীক্ষালয়ে"
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
          >
            <Edit size={14} />
            এডিট করো
          </button>

          <div className="relative flex gap-4 px-5 pb-6 pt-10 sm:items-end">
            {profile?.profile_image ? (
              <img src={profile.profile_image} alt="Profile" className="h-24 w-24 rounded-2xl border-4 border-white/90 object-cover shadow-lg" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white/90 bg-white/15 text-2xl font-bold text-white shadow-lg backdrop-blur">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
              </div>
            )}

            <div className="flex-1 pt-2 sm:pt-0">
              <h3 className="text-xl font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.25)] md:text-2xl">
                {profile?.name || "নাম দেওয়া হয়নি"}
              </h3>
              <p className="mt-0.5 text-sm text-white/70">আইডি : #{String(profile?.id || "০").padStart(6, "0")}</p>
              {academicBadges.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {academicBadges.map((b) => (
                    <span key={b} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlight stats */}
        <div className="grid grid-cols-2 gap-3">
          {highlightStats.map((s) => (
            <Link
              key={s.id}
              to={s.link}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.from} ${s.to} p-4 text-white shadow-sm transition-transform hover:-translate-y-0.5`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div className="mt-2 text-2xl font-extrabold leading-none">{s.count}</div>
              <div className="mt-1 text-xs font-medium text-white/85">{s.title}</div>
            </Link>
          ))}
        </div>

        {/* About */}
        {infoItems.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-900">আমার তথ্য</h2>
              <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-blue-600 hover:underline">
                বদলাও
              </button>
            </div>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[11px] text-slate-400">{label}</dt>
                    <dd className="break-words text-sm font-semibold text-slate-800">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        )}

        <PracticeStreak studentStreakDay={studentStreakDay} />

        {/* Secondary stats */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {secondaryStats.map((s) => (
              <Link key={s.id} to={s.link} className="flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-4 transition hover:bg-slate-50">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${s.tint}`}>{s.icon}</div>
                <div className="text-sm font-bold text-slate-800">{s.count}</div>
                <div className="text-center text-[11px] font-medium leading-tight text-slate-500">{s.title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 transition hover:text-red-600 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {isDeleting ? "মুছে ফেলা হচ্ছে..." : "অ্যাকাউন্ট মুছে ফেলো"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;