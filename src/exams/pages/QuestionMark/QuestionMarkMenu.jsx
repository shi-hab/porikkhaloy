import { useState, useRef, useEffect } from "react";
import { useToggleQuestionMarkMutation } from "@/features/questionBookMark/questionMarkApi";

const MARKS = [
  { type: "favorite", icon: "💖", label: "Favorite" },
  { type: "hard", icon: "🔥", label: "Hard" },
  { type: "revision", icon: "🔔", label: "Revision" },
  { type: "important", icon: "⭐", label: "Important" },
];

export default function QuestionMarkMenu({ questionId, initialMarks = [] }) {
  const [open, setOpen] = useState(false);
  const [localMarks, setLocalMarks] = useState(initialMarks);

  const ref = useRef(null);
  const [toggleMark] = useToggleQuestionMarkMutation();

  useEffect(() => {
    setLocalMarks(initialMarks);
  }, [initialMarks]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeMain = MARKS.find((m) => localMarks.includes(m.type)) || null;

  const handleToggle = async (type) => {
    const prev = localMarks;

    setLocalMarks(prev.includes(type) ? [] : [type]);

    try {
      await toggleMark({ question_id: questionId, type }).unwrap();
    } catch (err) {
      console.error(err);
      setLocalMarks(prev); // rollback
    }
  };

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      {/* Bookmark icon */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="text-[20px] transition-transform duration-200"
        title="Bookmark"
      >
        <span
          className={`inline-flex   ${
            activeMain
              ? "scale-110 rotate-6  hover:scale-110 duration-300 transition-all"
              : "opacity-70"
          }`}
        >
          {activeMain ? activeMain.icon : "⛉"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 top-full mt-2
            flex gap-1.5
            bg-white/95 backdrop-blur
            shadow-xl rounded-full
            px-2 py-1
            z-[9999]
            animate-[fadeScale_.18s_ease-out]
          "
        >
          {MARKS.map((mark) => {
            const active = localMarks.includes(mark.type);

            return (
              <button
                key={mark.type}
                onClick={() => handleToggle(mark.type)}
                title={mark.label}
                className={`
                  flex items-center justify-center
                  w-7 h-7 rounded-full
                  text-[16px]
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-100 text-blue-600 scale-110 shadow"
                      : " hover:opacity-90 hover:bg-gray-100"
                  }
                  hover:scale-110
                `}
              >
                <span
                  className={`transition-transform duration-300 ${
                    active ? "rotate-12" : ""
                  }`}
                >
                  {mark.icon}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
