import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useToggleQuestionMarkMutation } from "@/features/questionBookMark/questionMarkApi";

export default function QuestionMarkMenu({ questionId, initialMarks = [] }) {
  const [localMarks, setLocalMarks] = useState(initialMarks);
  const [toggleMark] = useToggleQuestionMarkMutation();

  useEffect(() => {
    setLocalMarks(initialMarks);
  }, [initialMarks]);

  const isFavorite = localMarks.includes("favorite");

  const handleClick = async () => {
    const prev = localMarks;

    setLocalMarks(isFavorite ? [] : ["favorite"]);

    try {
      await toggleMark({ question_id: questionId, type: "favorite" }).unwrap();
    } catch (err) {
      console.error(err);
      setLocalMarks(prev); // rollback
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleClick}
        className="transition-transform duration-200 active:scale-90"
        title="Favorite"
      >
        <Heart
          className={`h-5 w-5 transition-all duration-300 ${
            isFavorite
              ? "fill-red-500 text-red-500 scale-110"
              : "fill-none text-slate-400 hover:text-red-400"
          }`}
        />
      </button>
    </div>
  );
}