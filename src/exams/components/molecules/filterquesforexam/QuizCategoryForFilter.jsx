import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryData } from "../filterquesforexam/useCategoryData";
import { MultipleSelector } from "./MultipleSelector";

export default function QuizCategoryForFilter({
  control,
  setValue,
  forPage = "start",
  setFormData = null,
}) {
  const {
    categories: subjects,
    isLoading: subjectsLoading,
    categoryData: subjectData,
    setCategoryData: setSubjectData,
  } = useCategoryData("subjects");

  const {
    categories: lessons,
    isLoading: lessonsLoading,
    categoryData: lessonData,
    setCategoryData: setLessonData,
  } = useCategoryData("lessons");

  // Filter using status
  const filterByStatus = (categories) =>
    categories?.filter((category) => category.status == true) || [];

  const filteredSubjects = filterByStatus(subjects);
  const filteredLessons = filterByStatus(lessons);

  /** SUBJECT CHANGE */
  const handleSubjectChange = (ids) => {
    const foundData = ids
      .map((id) => filteredSubjects.find((item) => item.id === id))
      .filter(Boolean);

    setSubjectData(foundData);

    const allLessons = foundData.flatMap((subject) => subject.lessons || []);
    setValue("subject", ids);
    setFormData?.((prev) => ({ ...prev, subject: ids }));

    return allLessons;
  };

  /** LESSON CHANGE */
  const handleLessonChange = (ids) => {
    const foundData = ids
      .map((id) => filteredLessons.find((item) => item.id === id))
      .filter(Boolean);

    setLessonData(foundData);

    const allTopics = foundData.flatMap((lesson) => lesson.topics || []);
    setValue("lesson", ids);
    setFormData?.((prev) => ({ ...prev, lesson: ids }));

    return allTopics;
  };

  /** Select Field Renderer */
  const renderSelectField = ({
    label,
    name,
    options,
    onChange,
    defaultValue = [],
    disabled = false,
  }) => {
    if (!options || options.length === 0) return null;

    return (
      <MultipleSelector
        label={label}
        name={name}
        control={control}
        options={options}
        placeholder={`Select ${label}`}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
      />
    );
  };

  /** Skeleton Loader */
  const SelectSkeleton = () => (
    <div className="w-full flex flex-col gap-2">
      <Skeleton className="h-5 w-32 rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );

  return (
    <div className="flex bg-gray-100 p-2 flex-col items-start gap-4 my-6 rounded-md">
      {/* SUBJECT LOADING */}
      {subjectsLoading && lessonsLoading ? (
        <SelectSkeleton />
      ) : (
        filteredSubjects?.length > 0 &&
        renderSelectField({
          label: "বিষয়",
          name: "subject",
          options: filteredSubjects,
          onChange: handleSubjectChange,
          disabled: !filteredSubjects,
        })
      )}

      {/* LESSON LOADING */}
      {lessonsLoading
        ? subjectData?.length > 0 && <SelectSkeleton />
        : subjectData?.length > 0 &&
          renderSelectField({
            label: "অধ্যায়",
            name: "lesson",
            options: subjectData.flatMap((subject) => subject.lessons || []),
            onChange: handleLessonChange,
            disabled: !lessonData,
          })}
    </div>
  );
}

QuizCategoryForFilter.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  forPage: PropTypes.string,
  setFormData: PropTypes.func,
};
