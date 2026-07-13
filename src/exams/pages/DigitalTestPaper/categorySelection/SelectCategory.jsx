import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useCategoryData } from './../../../../features/hooks/useCategoryData';
import { AutoSearchSelect } from './autosearch-select';

export default function SelectCategory({
  control,
  setValue,
  setSelectedSection,
  setSelectedExamType,
  setSelectedExamSubType,
  setSelectedExamPaper,
  setSelectedGroup = null,
  setSelectedLesson,
  setSelectedLevel,
  setSelectedSubject,
  setSelectedTopic,
  setSelectedSubTopic,
  setSelectedYear,
}) {
  const [visibleFields, setVisibleFields] = useState({
    section: true,
    exam_type: true,
    exam_sub_type: true,
    exam_paper: true,
    group: true,
    level: true,
    subject: true,
    lesson: true,
    topic: true,
    sub_topic: true,
    year: true,
  });


  const {
    data: sections,
    selected: selectedSection,
    isLoading: isSectionLoading,
    error,
    categoryData: sectionData,
    setCategoryData: setSectionData,
  } = useCategoryData("sections", "section");
  const {
    data: examTypes,
    selected: selectedExamType,
    categoryData: examTypeData,
    setCategoryData: setExamTypeData,
  } = useCategoryData("exam-types", "exam_type");

  const { data: examSubTypes, selected: selectedExamSubType, categoryData: examSubTypeData, setCategoryData: setExamSubTypeData } = useCategoryData(
    "exam-sub-types",
    "exam_sub_type"
  );
  const { selected: selectedExamPaper } = useCategoryData(
    "exam-papers",
    "exam_paper"
  );
  const {
    data: groups,
    selected: selectedGroup,
    isLoading: isGroupLoading,
    categoryData: groupData,
    setCategoryData: setGroupData,
  } = useCategoryData("groups", "group");
  const {
    data: levels,
    selected: selectedLevel,
    categoryData: levelData,
    setCategoryData: setLevelData,
  } = useCategoryData("levels", "level");
  const {
    data: subjects,
    selected: selectedSubject,
    categoryData: subjectData,
    setCategoryData: setSubjectData,
  } = useCategoryData("subjects", "subject");
  const {
    data: lessons,
    selected: selectedLesson,
    categoryData: lessonData,
    setCategoryData: setLessonData,
  } = useCategoryData("lessons", "lesson");
  const {
    data: topics,
    selected: selectedTopic,
    categoryData: topicData,
    setCategoryData: setTopicData,
  } = useCategoryData("topics", "topic");
  const { selected: selectedSubTopic } = useCategoryData(
    "sub-topics",
    "sub_topic"
  );
  const {
    data: years,
    selected: selectedYear,
    isLoading: isYearLoading,
  } = useCategoryData("years", "year");

  const handleRemoveField = (fieldName) => {
    setVisibleFields((prev) => ({ ...prev, [fieldName]: false }));

    setValue(fieldName, "");
    clearSelectedState(fieldName);
  };

  const resetters = {
  section: () => {
    setSelectedSection("");
    setSectionData(null);
  },
  exam_type: () => {
    setSelectedExamType("");
    setExamTypeData(null);
  },
  exam_sub_type: () => setSelectedExamSubType(""),
  exam_paper: () => setSelectedExamPaper(""),
  group: () => {
    setSelectedGroup("");
    setGroupData(null);
  },
  level: () => {
    setSelectedLevel("");
    setLevelData(null);
  },
  subject: () => {
    setSelectedSubject("");
    setSubjectData(null);
  },
  lesson: () => {
    setSelectedLesson("");
    setLessonData(null);
  },
  topic: () => {
    setSelectedTopic("");
    setTopicData(null);
  },
  sub_topic: () => setSelectedSubTopic(""),
  year: () => setSelectedYear(""),
};

const dependencies = {
  section: [
    "section",
    "exam_type",
    "exam_sub_type",
    "exam_paper",
    "group",
    "level",
    "subject",
    "lesson",
    "topic",
    "sub_topic",
    "year",
  ],
  exam_type: ["exam_type", "exam_sub_type", "exam_paper"],
  exam_sub_type: ["exam_sub_type", "exam_paper"],
  exam_paper: ["exam_paper"],
  group: ["group", "level", "subject", "lesson", "topic", "sub_topic"],
  level: ["level", "subject", "lesson", "topic", "sub_topic"],
  subject: ["subject", "lesson", "topic", "sub_topic"],
  lesson: ["lesson", "topic", "sub_topic"],
  topic: ["topic", "sub_topic"],
  sub_topic: ["sub_topic"],
  year: ["year"],
};

const clearSelectedState = (fieldName) => {
  dependencies[fieldName]?.forEach((field) => {
    resetters[field]?.();
  });
};

  const handleSectionChange = (id) => {
    if (sections) {
      const foundData = sections.find((item) => item.id == id);
      setSectionData(foundData || null);
      setSelectedSection(id);
      setValue("section", id);
      setVisibleFields((prev) => ({ ...prev, exam_type: true, group : true }));
    }
  };

  const handleExamTypeChange = (id) => {
    if (examTypes) {
      const foundData = examTypes.find((item) => item.id == id);
      setExamTypeData(foundData || null);
      setSelectedExamType(id);
      setValue("exam_type", id);
      setVisibleFields((prev) => ({ ...prev, exam_sub_type: true }));
    }
  };

  const handleExamSubTypeChange = (id) => {
    if (examSubTypes) {
      const foundData = examSubTypes.find((item) => item.id == id);
      setExamSubTypeData(foundData || null);
      setSelectedExamSubType(id);
      setValue("exam_sub_type", id);
      setVisibleFields((prev) => ({ ...prev, exam_paper: true }));
    }
  };

  const handleExamPaperChange = (id) => {
    setSelectedExamPaper(id);
    setValue("exam_paper", id);
  };

  const handleGroupChange = (id) => {
    if (sectionData.groups) {
      const foundData = groups.find((item) => item.id == id);
      setGroupData(foundData || null);
      setSelectedGroup(id);
      setValue("group", id);
      setVisibleFields((prev) => ({ ...prev, level: true }));
    }
  };

  const handleLevelChange = (id) => {
    if (levels) {
      const foundData = levels.find((item) => item.id == id);
      setLevelData(foundData || null);
      setSelectedLevel(id);
      setValue("level", id);
      setVisibleFields((prev) => ({ ...prev, subject: true }));
    }
  };

  const handleSubjectChange = (id) => {
    if (subjects) {
      const foundData = subjects.find((item) => item.id == id);
      setSubjectData(foundData || null);
      setSelectedSubject(id);
      setValue("subject", id);
      setVisibleFields((prev) => ({ ...prev, lesson: true }));
    }
  };

  const handleLessonChange = (id) => {
    if (lessons) {
      const foundData = lessons.find((item) => item.id == id);
      setLessonData(foundData || null);
      setSelectedLesson(id);
      setValue("lesson", id);
      setVisibleFields((prev) => ({ ...prev, topic: true }));
    }
  };

  const handleTopicChange = (id) => {
    if (topics) {
      const foundData = topics.find((item) => item.id == id);
      setTopicData(foundData || null);
      setSelectedTopic(id);
      setValue("topic", id);
      setVisibleFields((prev) => ({ ...prev, sub_topic: true }));
    }
  };

  const handleSubTopicChange = (id) => {
    setSelectedSubTopic(id);
    setValue("sub_topic", id);
  };

  const handleYearChange = (id) => {
    setSelectedYear(id);
    setValue("year", id);
  };


  if (error) {
    return <div>Error loading sections: {error.message}</div>;
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
      visibleFields[name] && (
        <AutoSearchSelect
          label={label}
          name={name}
          control={control}
          options={options}
          placeholder={`Select ${label}`}
          onChange={onChange}
          defaultValue={defaultValue}
          rules={rules}
          disabled={disabled}
          onRemove={() => handleRemoveField(name)}
        />
      )
    );
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Section → Exam Type → Exam Sub Type */}
      <div className="grid w-full gap-2 md:grid-cols-3 pt-8">
        {isSectionLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}

        {renderSelectField({
          label: "Section",
          name: "section",
          options: sections,
          onChange: handleSectionChange,
          defaultValue: selectedSection,
        })}

        {sectionData?.exam_types &&
          renderSelectField({
            label: "Exam Type",
            name: "exam_type",
            options: sectionData.exam_types,
            onChange: handleExamTypeChange,
            defaultValue: selectedExamType,
            disabled: !sectionData,
          })}

        {examTypeData?.exam_sub_types &&
          renderSelectField({
            label: "Exam Sub Type",
            name: "exam_sub_type",
            options: examTypeData.exam_sub_types,
            onChange: handleExamSubTypeChange,
            defaultValue: selectedExamSubType,
            disabled: !examTypeData,
          })}

        {examSubTypeData?.exam_papers &&
          renderSelectField({
            label: "Exam Paper",
            name: "exam_paper",
            options: examSubTypeData?.exam_papers,
            onChange: handleExamPaperChange,
            defaultValue: selectedExamPaper,
            disabled: !examSubTypeData,
          })}
      </div>

      {/* Group → Level → Subject → Lesson → Topic → Sub Topic */}
      <div className="grid w-full gap-2 md:grid-cols-3 pt-8">
        {isGroupLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}

        {sectionData?.groups &&
          renderSelectField({
            label: "Group",
            name: "group",
            options: sectionData.groups,
            onChange: handleGroupChange,
            defaultValue: selectedGroup,
          })}

        {groupData?.levels &&
          renderSelectField({
            label: "Level",
            name: "level",
            options: groupData.levels,
            onChange: handleLevelChange,
            defaultValue: selectedLevel,
            disabled: !groupData,
          })}

        {levelData?.subjects &&
          renderSelectField({
            label: "Subject",
            name: "subject",
            options: levelData.subjects,
            onChange: handleSubjectChange,
            defaultValue: selectedSubject,
            disabled: !levelData,
          })}

        {subjectData?.lessons &&
          renderSelectField({
            label: "Lesson",
            name: "lesson",
            options: subjectData.lessons,
            onChange: handleLessonChange,
            defaultValue: selectedLesson,
            disabled: !subjectData,
          })}

        {lessonData?.topics &&
          renderSelectField({
            label: "Topic",
            name: "topic",
            options: lessonData.topics,
            onChange: handleTopicChange,
            defaultValue: selectedTopic,
            disabled: !lessonData,
          })}

        {topicData?.sub_topics &&
          renderSelectField({
            label: "Sub Topic",
            name: "sub_topic",
            options: topicData.sub_topics,
            onChange: handleSubTopicChange,
            defaultValue: selectedSubTopic,
            disabled: !topicData,
          })}
      </div>

      {/* Year */}
      <div className="py-4">
        {isYearLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}

        {renderSelectField({
          label: "Year",
          name: "year",
          options: years,
          onChange: handleYearChange,
          defaultValue: selectedYear,
        })}
      </div>
    </div>
  );
}
