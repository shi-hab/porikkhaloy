import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/exams/hooks/useAuth";
import UserNav from "../components/organism/UserNav";

export default function BackHeader({ title }) {
  const navigate = useNavigate();
  const checkingUser = useAuth();

  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center rounded-b-lg gap-3 border-b bg-white px-3 dark:bg-black dark:border-gray-800">
      <button
        onClick={handleBack}
        aria-label="Back"
        className="-ml-2 rounded-full p-2 hover:bg-muted"
      >
        <ArrowLeft size={22} />
      </button>

      <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>

      {/* desktop e sidebar e already UserNav ache, tai shudhu mobile e */}
      {checkingUser && (
        <div className="lg:hidden">
          <UserNav />
        </div>
      )}
    </header>
  );
}