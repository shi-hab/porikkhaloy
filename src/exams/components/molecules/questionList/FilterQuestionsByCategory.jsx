import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryData } from "../filterquesforexam/useCategoryData";
import { MultipleSelector } from "./MultipleSelector";

export default function FilterQuestionsByCategory({ control, setValue }) {
  const {
    categories: sections,
    isLoading: isSectionLoading,
    error,
    categoryData: sectionData,
    setCategoryData: setSectionData,
  } = useCategoryData("sections");
  const {
    categories: examTypes,
    categoryData: examTypeData,
    setCategoryData: setExamTypeData,
  } = useCategoryData("exam-types");
  const {
    categories: groups,
    isLoading: isGroupLoading,
    categoryData: groupData,
    setCategoryData: setGroupData,
  } = useCategoryData("groups");
  const {
    categories: levels,
    categoryData: levelData,
    setCategoryData: setLevelData,
  } = useCategoryData("levels");
  const {
    categories: subjects,
    categoryData: subjectData,
    setCategoryData: setSubjectData,
  } = useCategoryData("subjects");
  const {
    categories: lessons,
    categoryData: lessonData,
    setCategoryData: setLessonData,
  } = useCategoryData("lessons");
  const {
    categories: topics,
    categoryData: topicData,
    setCategoryData: setTopicData,
  } = useCategoryData("topics");
  // const { categories: years, isLoading: isYearLoading } = useCategoryData("years");

  const handleSectionChange = (ids) => {
    if (sections) {
      const foundData = ids
        .map((id) => sections.find((item) => item.id === id))
        .filter(Boolean);
      setSectionData(foundData || null);

      const allExamTypes = foundData.flatMap(
        (section) => section.exam_types || []
      );
      setValue("section", ids);

      return allExamTypes;
    }

    return [];
  };

  const handleExamTypeChange = (ids) => {
    if (examTypes) {
      const foundData = ids
        .map((id) => examTypes.find((item) => item.id === id))
        .filter(Boolean);
      setExamTypeData(foundData || null);

      const allExamSubTypes = foundData.flatMap(
        (examType) => examType.exam_sub_types || []
      );
      setValue("exam_type", ids);

      return allExamSubTypes;
    }

    return [];
  };

  const handleExamSubTypeChange = (ids) => {
    setValue("exam_sub_type", ids);
  };

  const handleGroupChange = (ids) => {
    if (groups) {
      const foundData = ids
        .map((id) => groups.find((item) => item.id === id))
        .filter(Boolean);
      setGroupData(foundData || null);

      const allLevels = foundData.flatMap((group) => group.levels || []);
      setValue("group", ids);

      return allLevels;
    }

    return [];
  };

  const handleLevelChange = (ids) => {
    if (levels) {
      const foundData = ids
        .map((id) => levels.find((item) => item.id === id))
        .filter(Boolean);
      setLevelData(foundData || null);

      const allSubjects = foundData.flatMap((level) => level.subjects || []);
      setValue("level", ids);

      return allSubjects;
    }

    return [];
  };

  const handleSubjectChange = (ids) => {
    if (subjects) {
      const foundData = ids
        .map((id) => subjects.find((item) => item.id === id))
        .filter(Boolean);
      setSubjectData(foundData || null);

      const allLessons = foundData.flatMap((subject) => subject.lessons || []);
      setValue("subject", ids);

      return allLessons;
    }

    return [];
  };

  const handleLessonChange = (ids) => {
    if (lessons) {
      const foundData = ids
        .map((id) => lessons.find((item) => item.id === id))
        .filter(Boolean);
      setLessonData(foundData || null);

      const allTopics = foundData.flatMap((lesson) => lesson.topics || []);
      setValue("lesson", ids);

      return allTopics;
    }

    return [];
  };

  const handleTopicChange = (ids) => {
    if (topics) {
      const foundData = ids
        .map((id) => topics.find((item) => item.id === id))
        .filter(Boolean);
      setTopicData(foundData || null);

      const allSubTopics = foundData.flatMap((topic) => topic.sub_topics || []);
      setValue("topic", ids);

      return allSubTopics;
    }

    return [];
  };

  const handleSubTopicChange = (ids) => {
    setValue("sub_topic", ids);
  };

  // const handleYearChange = (ids) => {
  //     setValue("year", ids);
  // };

  if (error) {
    return (
      <div className="py-5">
        Error loading Categories: {error?.data?.message}
      </div>
    );
  }

  const renderSelectField = ({
    label,
    name,
    options,
    onChange,
    defaultValue,
    rules,
    disabled,
  }) => {
    // If no options are available, don't render the selector
    if (!options || options.length === 0) {
      return null;
    }

    return (
      <MultipleSelector
        label={label}
        name={name}
        control={control}
        options={options}
        placeholder={`Select ${label}`}
        onChange={onChange}
        defaultValue={defaultValue}
        rules={rules}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="font-hind-siliguri flex flex-col md:flex-row items-start border gap-4 my-6 rounded-md ">
      {/* Section → Exam Type → Exam Sub Type */}
      <div className="grid grid-cols-1 gap-4 p-4 w-full font-hind-siliguri">
        {isSectionLoading && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-[150px] bg-gray-300" />
            <Skeleton className="h-5 w-[250px] bg-gray-300" />
          </div>
        )}

        {renderSelectField({
          label: "Section",
          name: "section",
          options: sections,
          onChange: handleSectionChange,
        })}

        {sectionData?.length > 0 &&
          renderSelectField({
            label: "Exam Type",
            name: "exam_type",
            options: sectionData.flatMap((section) => section.exam_types || []),
            onChange: handleExamTypeChange,
            disabled: !sectionData,
          })}

        {examTypeData?.length > 0 &&
          renderSelectField({
            label: "Exam Sub Type",
            name: "exam_sub_type",
            options: examTypeData.flatMap(
              (examType) => examType.exam_sub_types || []
            ),
            onChange: handleExamSubTypeChange,
            disabled: !examTypeData,
          })}
      </div>

      {/* Group → Level → Subject → Lesson → Topic → Sub Topic */}
      <div className="grid gap-4 md:border-l py-4 px-4 md:px-8 w-full ">
        {isGroupLoading && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-[150px] bg-gray-300" />
            <Skeleton className="h-5 w-[250px] bg-gray-300" />
          </div>
        )}

        {renderSelectField({
          label: "Group",
          name: "group",
          options: groups,
          onChange: handleGroupChange,
        })}

        {groupData?.length > 0 &&
          renderSelectField({
            label: "Level",
            name: "level",
            options: groupData.flatMap((group) => group.levels || []),
            onChange: handleLevelChange,
            disabled: !groupData,
          })}

        {levelData?.length > 0 &&
          renderSelectField({
            label: "Subject",
            name: "subject",
            options: levelData.flatMap((level) => level.subjects || []),
            onChange: handleSubjectChange,
            disabled: !levelData,
          })}

        {subjectData?.length > 0 &&
          renderSelectField({
            label: "Lesson",
            name: "lesson",
            options: subjectData.flatMap((subject) => subject.lessons || []),
            onChange: handleLessonChange,
            disabled: !subjectData,
          })}

        {lessonData?.length > 0 &&
          renderSelectField({
            label: "Topic",
            name: "topic",
            options: lessonData.flatMap((lesson) => lesson.topics || []),
            onChange: handleTopicChange,
            disabled: !lessonData,
          })}

        {topicData?.length &&
          renderSelectField({
            label: "Sub Topic",
            name: "sub_topic",
            options: topicData.flatMap((topic) => topic.sub_topics || []),
            onChange: handleSubTopicChange,
            disabled: !topicData,
          })}
      </div>

      {/* Year */}
      {/* <div className="w-full p-4">
                {
                    isYearLoading && (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[250px]" />
                        </div>
                    )
                }

                {renderSelectField({
                    label: "Year",
                    name: "year",
                    options: years,
                    onChange: handleYearChange,
                })}
            </div> */}
    </div>
  );
}
