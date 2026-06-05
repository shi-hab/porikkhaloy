import PropTypes from "prop-types";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryData } from "../filterquesforexam/useCategoryData";

export default function QuizCategoryForFilter({
  setValue,
  setFormData = null,
}) {
  const {
    categories: subjects,
    isLoading,
  } = useCategoryData("subjects");

  const [expandedSubjects, setExpandedSubjects] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);

  const filteredSubjects =
    subjects?.filter((item) => item.status === true) || [];

  const toggleExpand = (subjectId) => {
    setExpandedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleLessonCheck = (lessonId) => {
    let updatedLessons = [];

    if (selectedLessons.includes(lessonId)) {
      updatedLessons = selectedLessons.filter(
        (id) => id !== lessonId
      );
    } else {
      updatedLessons = [...selectedLessons, lessonId];
    }

    setSelectedLessons(updatedLessons);

    setValue("lesson", updatedLessons);

    setFormData?.((prev) => ({
      ...prev,
      lesson: updatedLessons,
    }));
  };

  const handleSubjectCheck = (subject) => {
    const lessonIds = subject.lessons?.map((l) => l.id) || [];

    const allSelected = lessonIds.every((id) =>
      selectedLessons.includes(id)
    );

    let updatedLessons = [];

    if (allSelected) {
      updatedLessons = selectedLessons.filter(
        (id) => !lessonIds.includes(id)
      );
    } else {
      updatedLessons = [
        ...new Set([...selectedLessons, ...lessonIds]),
      ];
    }

    setSelectedLessons(updatedLessons);

    setValue("lesson", updatedLessons);

    setFormData?.((prev) => ({
      ...prev,
      lesson: updatedLessons,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">
        অধ্যায় নির্বাচন করুন
      </h2>

      {filteredSubjects.map((subject) => {
        const lessons = subject.lessons || [];

        const selectedCount = lessons.filter((lesson) =>
          selectedLessons.includes(lesson.id)
        ).length;

        const allSelected =
          lessons.length > 0 &&
          selectedCount === lessons.length;

        const expanded = expandedSubjects.includes(subject.id);

        return (
          <div
            key={subject.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            {/* Subject Header */}
            <div
              className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-slate-50"
              onClick={() => toggleExpand(subject.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() =>
                    handleSubjectCheck(subject)
                  }
                  onClick={(e) => e.stopPropagation()}
                />

                <span className="font-medium">
                  {subject.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {selectedCount}/{lessons.length}
                </span>

                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Lessons */}
            {expanded && (
              <div className="border-t bg-slate-50">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 px-7 py-4 border-b last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedLessons.includes(
                        lesson.id
                      )}
                      onCheckedChange={() =>
                        handleLessonCheck(lesson.id)
                      }
                    />

                    <span>{lesson.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

QuizCategoryForFilter.propTypes = {
  setValue: PropTypes.func.isRequired,
  setFormData: PropTypes.func,
};