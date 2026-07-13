import { useState } from "react";
import { ChevronDown, SquareCheck, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoryData } from "@/features/hooks/useCategoryData";
import { Skeleton } from "@/components/ui/skeleton";

function SubjectWithChapterSelect({
  control,
  setValue,
}) {
  const {
    data: subjects,
    isLoading,
    setCategoryData: setSubjectData,
  } = useCategoryData({ type: "subjects", context: "test-paper" });

  const [openSubjects, setOpenSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);

  const toggleSubject = (id) => {
    setOpenSubjects((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSubjectCheck = (subject) => {
    const lessonIds = subject.lessons?.map((lesson) => lesson.id) || [];

    const isSelected = selectedSubjects.includes(subject.id);

    let updatedSubjects;

    if (isSelected) {
      updatedSubjects = selectedSubjects.filter((id) => id !== subject.id);

      setSelectedLessons((prev) =>
        prev.filter((id) => !lessonIds.includes(id))
      );
    } else {
      updatedSubjects = [...selectedSubjects, subject.id];

      setSelectedLessons((prev) => [
        ...new Set([...prev, ...lessonIds]),
      ]);
    }

    // Local state update
    setSelectedSubjects(updatedSubjects);

    // React Hook Form update
    setValue("subject_id", updatedSubjects);

    setSubjectData(subject);
  };

  const handleLessonCheck = (lessonId, subject) => {
    const lessonIds = subject.lessons?.map((lesson) => lesson.id) || [];

    const isChecked = selectedLessons.includes(lessonId);

    let updatedLessons;
    let updatedSubjects = [...selectedSubjects];

    if (isChecked) {
      // Lesson Uncheck
      updatedLessons = selectedLessons.filter((id) => id !== lessonId);

      // Subject-ও Uncheck হবে
      updatedSubjects = updatedSubjects.filter((id) => id !== subject.id);
    } else {
      // Lesson Check
      updatedLessons = [...selectedLessons, lessonId];

      // সব lesson select হলে subject select হবে
      const allSelected = lessonIds.every((id) => updatedLessons.includes(id));

      if (allSelected && !updatedSubjects.includes(subject.id)) {
        updatedSubjects.push(subject.id);
      }
    }

    // Local state
    setSelectedLessons(updatedLessons);
    setSelectedSubjects(updatedSubjects);

    // React Hook Form state
    setValue("lesson_id", updatedLessons);
    setValue("subject_id", updatedSubjects);
  };

  return (
    <div className="w-full mx-auto">
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {subjects?.map((subject) => {
            const opened = openSubjects.includes(subject.id);
            const isSubjectSelected = selectedSubjects.includes(subject.id);
            const selectedChaptersCount = subject.lessons?.filter((lesson) =>
              selectedLessons.includes(lesson.id)
            ).length || 0;
            const totalChapters = subject.lessons?.length || 0;

            return (
              <div
                key={subject.id}
                className="group rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-300 overflow-hidden"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between px-4 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Custom Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleSubjectCheck(subject)}
                      className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg transition-transform active:scale-95"
                    >
                      {isSubjectSelected ? (
                        <SquareCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                      )}
                    </button>

                    {/* Subject Info */}
                    <div onClick={() => toggleSubject(subject.id)} className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm font-siliguri">
                          {subject.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div
                    onClick={() => toggleSubject(subject.id)}
                    className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:text-blue-600 transition-all active:scale-95"
                  >
                    <span className="text-sm">
                      {selectedLessons.length}/{totalChapters} টি অধ্যায়
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        opened && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                {/* Lessons Container */}
                <div
                  className={cn(
                    "transition-all duration-300 overflow-hidden",
                    opened ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-1">
                    {subject.lessons?.length > 0 ? (
                      subject.lessons.map((lesson) => {
                        const isLessonSelected = selectedLessons.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => handleLessonCheck(lesson.id, subject)}
                            className="w-full flex items-center gap-2 rounded-lg border-b px-4 py-3 text-left transition-all duration-200 hover:border-blue-300 hover:shadow-sm  active:scale-98 group/lesson"
                          >
                            {/* Lesson Checkbox */}
                            <div className="flex-shrink-0">
                              {isLessonSelected ? (
                                <SquareCheck className="w-3 h-3 text-blue-600" />
                              ) : (
                                <Square className="w-3 h-3 text-gray-300 group-hover/lesson:text-gray-400 transition-colors" />
                              )}
                            </div>

                            {/* Lesson Number and Title */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                  {lesson.title}
                                </p>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            {isLessonSelected && (
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">কোন অধ্যায় পাওয়া যায়নি</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {totalChapters > 0 && (
                  <div className="h-1 bg-gray-100">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{
                        width: `${(selectedChaptersCount / totalChapters) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubjectWithChapterSelect;