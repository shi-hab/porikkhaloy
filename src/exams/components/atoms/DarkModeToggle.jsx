// src/components/ui/DarkModeToggle.jsx
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // 

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-full flex items-center justify-between p-2 text-base"
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 mr-2" />
          Dark Mode
        </>
      )}
    </button>
  );
};

export default DarkModeToggle;
