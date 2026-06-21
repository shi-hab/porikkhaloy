import useAuth from "@/exams/hooks/useAuth";
import { AlignJustify, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Layout } from "../../../templates/Layout";
import Nav from "../../../templates/Nav";
import Logo from "../../atoms/Logo";
import UserNav from "../../organism/UserNav";
import { NavLinks } from "./NavLinks";
import DarkModeToggle from "./DarkModeToggle";
import { useGetAllForNavbarQuery } from "@/features/topNavBar/navBarApi";
import toBanglaNumeral from "@/utils/Tobangla";
import { PiFireSimpleFill } from "react-icons/pi";

export default function Navbar({ className, isCollapsed, setIsCollapsed }) {
  const checkingUser = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [navOpened, setNavOpened] = useState(false);
  const { data: allData, isLoading } = useGetAllForNavbarQuery();

  const streak = allData?.data?.practiceStreak?.current_streak ?? 0;

  const banglaStreak = useMemo(() => toBanglaNumeral(streak), [streak]);

  const prevStreakRef = useRef(streak);

  useEffect(() => {
    if (streak > prevStreakRef.current) {
      const timer = setTimeout(() => { }, 800);
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = streak;
  }, [streak]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  const isActiveCustom = (link) => {
    const currentPath = location.pathname.toLowerCase();
    if (link.href === "/" && currentPath === "/") return true;
    if (link.href !== "/") {
      return link.urlActive?.some((prefix) =>
        currentPath.startsWith(prefix.toLowerCase()),
      );
    }
    return false;
  };

  const hideNavbarRoutes = [
    "/exam-on-going",
    "/exam-ongoing",
    "/quiz-battle-running",
    "/registration",
    "/login",
  ];

  const isHideNavbar = hideNavbarRoutes.some((keyword) =>
    location.pathname.includes(keyword),
  );

  const filteredNavLinks = NavLinks.filter((link) => {
    if (!checkingUser) {
      if (link.title === "মক টেস্ট" || link.title === "তোমার ব্যাচ") {
        return false;
      }
    } else {
      // Login থাকলে লিডারবোর্ড hide
      if (link.title === "লিডারবোর্ড") {
        return false;
      }
    }
    return true;
  });


  // Mobile bottom nav-e khali showInBottomNav: true thaka link gula jabe
  const bottomNavLinks = filteredNavLinks.filter((link) => link.showInBottomNav);


  return (
    <>
      {/* ============ DESKTOP: fixed left sidebar ============ */}
      <aside
        className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:flex-col
          border-r bg-white dark:bg-black dark:border-gray-800`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-3 pt-2 pb-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center px-2 mb-4">
              <Logo />
            </div>

            {/* Streak badge */}
            {checkingUser && (
              <Link to="/user/streak" >
                <div className="flex w-fit bg-gray-100 dark:bg-gray-800 rounded-full px-4 h-6 text-body items-center justify-center">
                  <PiFireSimpleFill className="text-orange-600" />
                  <span className="font-extrabold ml-1 text-orange-500">
                    {isLoading ? "০" : banglaStreak}
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Vertical nav links */}
          <nav className="flex-1 flex flex-col gap-1">
            {filteredNavLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-bold text-sm transition-all duration-200
                  ${isActiveCustom(link)
                    ? "bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-[0_0_8px] shadow-blue-400/70 ring-1 ring-blue-300/60"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.title}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom: auth area */}
          <div className=" pt-4 border-t dark:border-gray-800">
            {checkingUser ? (
              <div className="bg-gray-300 flex justify-between items-center px-2 py-2 rounded-lg">
                <UserNav />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate("/login")}
                  className="h-8 w-full bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                >
                  লগইন
                </Button>
                <Button
                  onClick={() => navigate("/registration")}
                  className="h-8 w-full bg-green-600 font-bold border-b-4 border-green-800 hover:bg-green-700 text-white dark:bg-green-500 dark:border-green-700 dark:hover:bg-green-600"
                >
                  রেজিস্ট্রেশন
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ============ MOBILE / TABLET: top bar + bottom tab nav ============ */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-black border-b shadow-sm lg:hidden">
        <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
          {/* Overlay */}
          <div
            onClick={() => setNavOpened(false)}
            className={`absolute top-14 inset-0 transition-[opacity] delay-100 duration-700 z-50 ${navOpened ? "h-svh opacity-100" : "h-0 opacity-0"
              } w-full bg-black/80 dark:bg-black/90 md:hidden`}
          />

          <Layout
            fixed
            className={`${navOpened ? "h-svh" : ""
              } w-full flex flex-col items-center justify-between md:flex-row`}
          >
            <Layout.Header
              sticky
              className="z-50 flex items-center justify-between w-full sm:h-14 px-3"
            >
              {checkingUser && (
                <div className="flex gap-2">
                  <Link to="/user/streak">
                    <div className="flex bg-gray-100 rounded px-2 h-7 text-[17px] items-center justify-center">
                      <PiFireSimpleFill className="text-orange-600" />
                      <span className="font-extrabold ml-0.5 text-orange-500">
                        {isLoading ? "০" : banglaStreak}
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              <div className={`flex items-center ${!isCollapsed ? "gap-2" : ""}`}>
                <Logo />
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                {checkingUser ? (
                  <UserNav />
                ) : (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
                      className="h-8 px-2 bg-blue-700 font-bold text-white border-blue-900 border-b-4 dark:bg-blue-600 dark:border-blue-800"
                    >
                      লগইন
                    </Button>
                    <Button
                      onClick={() => navigate("/registration")}
                      className="h-8 px-2 bg-green-600 font-bold border-b-4 border-green-800 hover:bg-green-700 text-white dark:bg-green-500 dark:border-green-700 dark:hover:bg-green-600"
                    >
                      রেজিস্ট্রেশন
                    </Button>
                  </>
                )}
              </div>
            </Layout.Header>
          </Layout>

          {/* Mobile Bottom Nav */}
          {!isHideNavbar && (
            <nav className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 border-t border-gray-400 dark:border-gray-700 shadow-lg h-[48px] lg:hidden">
              <ul className="flex items-center justify-between h-full">
                {bottomNavLinks.map((link) => (
                  <li key={link.href} className="flex-1">
                    <NavLink
                      to={link.href}
                      className="flex flex-col items-center justify-center duration-300"
                    >
                      <span
                        className={`transition-all duration-300 px-4 py-[1px] rounded-2xl ease-in-out
                        ${isActiveCustom(link)
                            ? "bg-blue-200 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-[0_0_8px] shadow-blue-400/70 ring-1 ring-blue-300/60"
                            : "text-gray-500 dark:text-gray-400"
                          }`}
                      >
                        {link.icon}
                      </span>
                      <span className="text-[12px] md:text-[18px] font-bold text-gray-700 dark:text-gray-300">
                        {link.title}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </nav>
    </>
  );
}