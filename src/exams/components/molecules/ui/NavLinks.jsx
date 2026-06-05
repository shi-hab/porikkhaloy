import { BsBank2 } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { LuPackagePlus } from "react-icons/lu";
import { MdLeaderboard } from "react-icons/md";
import { IoMdCloudDownload } from "react-icons/io";

export const NavLinks = [
  {
    title: "হোম",
    href: "/",
    icon: <FaHome />,
    urlActive: ["/"],
  },
  // {
  //   title: "মক টেস্ট",
  //   href: "/exams",
  //   icon: <BiSolidMessageSquareEdit />,
  //   urlActive: ["/exams", "/exam/start", "/exam-on-going", "/exam-result"],
  // },
  // {
  //   title: "লিডারবোর্ড",
  //   href: "/leaderboard",
  //   icon: <MdLeaderboard />,
  //   urlActive: ["/leaderboard"],
  // },
  {
    title: "তোমার ব্যাচ",
    href: "/user/packages",
    icon: <IoMdCloudDownload />,
    urlActive: ["/user/packages"],
  },
  {
    title: "প্রশ্নব্যাংক",
    href: "/questions",
    icon: <BsBank2 />,
    urlActive: ["/questions"],
  },
  {
    title: "এক্সাম ব্যাচ",
    href: "/package",
    icon: <LuPackagePlus />,
    urlActive: ["/package", "/model-test"],
  },
];


