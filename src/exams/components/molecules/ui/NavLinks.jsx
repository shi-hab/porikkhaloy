import {
  Home,
  FileText,
  Trophy,
  Package,
  Library,
  GraduationCap,
  User,
  History,
  Bookmark,
  MessageCircleQuestion,
  Users,
  Shield,
  FileCheck,
  LogOut,
} from "lucide-react";
import { FaBookReader } from "react-icons/fa";


export const NavLinks = [
  {
    title: "হোম",
    href: "/",
    icon: <Home size={20} />,
    urlActive: ["/"],
    showInBottomNav: true,

  },
  {
    title: "মক টেস্ট",
    href: "/exams",
    icon: <FileText size={20} />,
    urlActive: ["/exams", "/exam/start", "/exam-on-going", "/exam-result"],
    showInBottomNav: false,

  },
  {
    title: "লিডারবোর্ড",
    href: "/leaderboard",
    icon: <Trophy size={20} />,
    urlActive: ["/leaderboard"],
    showInBottomNav: true,

  },
  {
    title: "তোমার ব্যাচ",
    href: "/user/packages",
    icon: <Package size={20} />,
    urlActive: ["/user/packages"],
    showInBottomNav: true,

  },
  {
    title: "প্রশ্নব্যাংক",
    href: "/questions",
    icon: <FaBookReader size={20} />,
    urlActive: ["/questions"],
    showInBottomNav: true,

  },
  {
    title: "এক্সাম ব্যাচ",
    href: "/package",
    icon: <GraduationCap size={20} />,
    urlActive: ["/package", "/model-test"],
    showInBottomNav: true,

  },

  // User Section
  // {
  //   title: "প্রোফাইল",
  //   href: "/user/profile",
  //   icon: <User size={20} />,
  //   urlActive: ["/user/profile"],
  //   showInBottomNav: false,
  // },
  {
    title: "সাবস্ক্রিপশন",
    href: "/user/subscription",
    icon: <Package size={20} />,
    urlActive: ["/user/subscription"],
    showInBottomNav: false,
  },
  {
    title: "এক্সাম হিস্ট্রি",
    href: "/user/exam-history",
    icon: <History size={20} />,
    urlActive: ["/user/exam-history"],
    showInBottomNav: false,
  },
  {
    title: "বুকমার্ক",
    href: "/user/book-mark",
    icon: <Bookmark size={20} />,
    urlActive: ["/user/book-mark"],
    showInBottomNav: false,
  },
  {
    title: "ডাউট সল্ভ",
    href: "/user/question-feedback",
    icon: <MessageCircleQuestion size={20} />,
    urlActive: ["/user/question-feedback"],
    showInBottomNav: false,
  },
  // {
  //   title: "পার্সোনাল মেন্টরিং",
  //   href: "/user/mentor-feedback",
  //   icon: <Users size={20} />,
  //   urlActive: ["/user/mentor-feedback"],
  //   showInBottomNav: false,
  // },
  // {
  //   title: "Privacy Policy",
  //   href: "/privacy-policy",
  //   icon: <Shield size={20} />,
  //   urlActive: ["/privacy-policy"],
  //   showInBottomNav: false,
  // },
  // {
  //   title: "Terms of Service",
  //   href: "/terms-and-conditions",
  //   icon: <FileCheck size={20} />,
  //   urlActive: ["/terms-and-conditions"],
  //   showInBottomNav: false,
  // },
];