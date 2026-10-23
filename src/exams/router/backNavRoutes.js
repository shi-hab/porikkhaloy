// src/config/backNavRoutes.js
import { matchPath } from "react-router-dom";

// NOTE: upor theke niche order e match hoy, tai specific route age rakho
export const backNavRoutes = [
  // ---------- User dashboard ----------
  { path: "/user/profile", title: "প্রোফাইল" },
  { path: "/user/streak", title: "স্ট্রিক" },
  { path: "/user/exam-history", title: "পরীক্ষার ইতিহাস" },
  { path: "/user/packages", title: "আমার প্যাকেজ" },
  { path: "/user/subscription", title: "সাবস্ক্রিপশন" },
  { path: "/user/question-feedback", title: "প্রশ্ন ফিডব্যাক" },
  { path: "/user/mentor-feedback", title: "মেন্টর ফিডব্যাক" },
  { path: "/user/book-mark", title: "বুকমার্ক" },

  // ---------- Exam ----------
  { path: "/exam/start", title: "পরীক্ষা শুরু" },
  { path: "/exam-result", title: "ফলাফল" },
  { path: "/exam-history/:id", title: "উত্তরপত্র" },
  { path: "/questions", title: "প্রশ্ন তালিকা" },
//   { path: "/mock-test", title: "মক পরীক্ষা" },

  // ---------- Leaderboard ----------
  { path: "/leaderboard", title: "লিডারবোর্ড" },

  // ---------- Packages ----------
  { path: "/package/:id/enroll", title: "এনরোলমেন্ট" }, // /package/:a/:b er age thakte hobe
  { path: "/package/:id", title: "প্যাকেজ বিস্তারিত" },
  { path: "/package/:packageIdurl/:modelTestIdurl", title: "মডেল টেস্ট" },
  { path: "/package/:packageId/model-test/:modelTestId", title: "মডেল টেস্ট বিস্তারিত" },
  { path: "/package/:packageId/model-test-merit-list/:modelTestId", title: "মেরিট লিস্ট" },
  { path: "/model-test/:modelTestId/mtexam-result", title: "মডেল টেস্ট ফলাফল" },
  { path: "/model-test/:modelTestId/mtexam-result/:studentId/:attemptId", title: "উত্তর দেখুন" },

  // ---------- Subscriptions ----------
  { path: "/subscriptions", title: "সাবস্ক্রিপশন" },
  { path: "/subscriptions/view/:id", title: "সাবস্ক্রিপশন বিস্তারিত" },
  { path: "/subscriptions/:checkoutId", title: "চেকআউট" },
  { path: "/buy-quota", title: "কোটা কিনুন" },

  // ---------- Affiliate ----------
  { path: "/affiliate", title: "অ্যাফিলিয়েট" },
  { path: "/affiliate/dashboard", title: "অ্যাফিলিয়েট ড্যাশবোর্ড" },
  { path: "/affiliate/coupon", title: "কুপন তৈরি" },
  { path: "/affiliate/withdraw-history", title: "উইথড্র হিস্ট্রি" },

  // ---------- Admission calendar ----------
  { path: "/admission-calender/:id", title: "ভর্তি ক্যালেন্ডার" },
];

export const getBackNavRoute = (pathname) =>
  backNavRoutes.find((r) => matchPath({ path: r.path, end: true }, pathname));