import PropTypes from "prop-types";
import { useCategoryData } from "../filterquesforexam/useCategoryData";
import { MultipleSelector } from "./MultipleSelector";
import { Input } from "@/components/ui/input";

export default function FilterQuestionsByCategory({
  control,
  setValue,
  forPage = "start",
  setFormData = null,
}) {
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


  // Filter categories to exclude those with status = 0
  const filterByStatus = (categories) => {
    return (
      categories?.filter((category) => category.status == true) || []
    );
  };

  // Filtered subjects, lessons, and topics
  const filteredSubjects = filterByStatus(subjects);
  const filteredLessons = filterByStatus(lessons);
  const filteredTopics = filterByStatus(topics);

  /**
   * Handle subject selection change.
   * @param {Array} ids - Selected subject IDs.
   */
  const handleSubjectChange = (ids) => {
    if (!filteredSubjects) return [];

    const foundData = ids
      .map((id) => filteredSubjects.find((item) => item.id === id))
      .filter(Boolean);
    setSubjectData(foundData);

    const allLessons = foundData.flatMap((subject) => subject.lessons || []);
    setValue("subject", ids);
    setFormData?.((prevFormData) => ({ ...prevFormData, subject: ids }));

    return allLessons;
    
  };

  /**
   * Handle lesson selection change.
   * @param {Array} ids - Selected lesson IDs.
   */
  const handleLessonChange = (ids) => {
    if (!filteredLessons) return [];

    const foundData = ids
      .map((id) => filteredLessons.find((item) => item.id === id))
      .filter(Boolean);
    setLessonData(foundData);

    const allTopics = foundData.flatMap((lesson) => lesson.topics || []);
    setValue("lesson", ids);
    setFormData?.((prevFormData) => ({ ...prevFormData, lesson: ids }));

    return allTopics;
  };

  /**
   * Handle topic selection change.
   * @param {Array} ids - Selected topic IDs.
   */
  const handleTopicChange = (ids) => {
    if (!filteredTopics) return [];

    const foundData = ids
      .map((id) => filteredTopics.find((item) => item.id === id))
      .filter(Boolean);
    setTopicData(foundData);

    const allSubTopics = foundData.flatMap((topic) => topic.sub_topics || []);
    setValue("topic", ids);
    setFormData?.((prevFormData) => ({ ...prevFormData, topic: ids }));

    return allSubTopics;
  };

  /**
   * Handle subtopic selection change.
   * @param {Array} ids - Selected subtopic IDs.
   */
  const handleSubTopicChange = (ids) => {
    setValue("sub_topic", ids);
  };


  /**
   * Render a select field with options.
   * @param {Object} params - Parameters for the select field.
   * @param {string} params.label - Label for the field.
   * @param {string} params.name - Name of the field.
   * @param {Array} params.options - Options for the field.
   * @param {Function} params.onChange - Change handler.
   * @param {Array} params.defaultValue - Default selected values.
   * @param {boolean} params.disabled - Whether the field is disabled.
   */
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

  return (
    <div className="flex bg-gray-100 p-2 flex-col items-start gap-4 my-6 rounded-md">
      {/* Subjects */}
      {filteredSubjects?.length > 0 &&
        renderSelectField({
          label: "বিষয়",
          name: "subject",
          options: filteredSubjects,
          onChange: handleSubjectChange,
          disabled: !filteredSubjects,
        })}

      {/* Lessons */}
      {subjectData?.length > 0 &&
        renderSelectField({
          label: "অধ্যায়",
          name: "lesson",
          options: subjectData.flatMap((subject) => subject.lessons || []),
          onChange: handleLessonChange,
          disabled: !subjectData,
        })}

      {/* Topics */}
      {lessonData?.length > 0 &&
        renderSelectField({
          label: "টপিক",
          name: "topic",
          options: lessonData.flatMap((lesson) => lesson.topics || []),
          onChange: handleTopicChange,
          disabled: !lessonData,
        })}

      {/* Subtopics */}
      {topicData?.length > 0 &&
        renderSelectField({
          label: "সাব টপিক",
          name: "sub_topic",
          options: topicData.flatMap((topic) => topic.sub_topics || []),
          onChange: handleSubTopicChange,
          disabled: !topicData,
        })}

      {/* Question and Time Limits */}
      {forPage === "start" && (
        <div className="grid min-w-full grid-cols-2 gap-4">
          <div>
            <p>মোট প্রশ্ন</p>
            <Input
              defaultValue={20}
              className="py-2"
              onChange={(e) =>
                setFormData?.((prevFormData) => ({
                  ...prevFormData,
                  questions_limit: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <p>মোট সময়</p>
            <Input
              defaultValue={10}
              className="py-2"
              onChange={(e) =>
                setFormData?.((prevFormData) => ({
                  ...prevFormData,
                  time_limit: e.target.value,
                }))
              }
            />
          </div>
          {/* <div>
            <p>নেগেটিভ মার্ক</p>
            <Input
              defaultValue={0.5}
              className="py-2"
              onChange={(e) =>
                setFormData?.((prevFormData) => ({
                  ...prevFormData,
                  negative_mark: e.target.value,
                }))
              }
            />
          </div> */}
        </div>
      )}
    </div>
  );
}

// PropTypes for type checking
FilterQuestionsByCategory.propTypes = {
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  forPage: PropTypes.string,
  setFormData: PropTypes.func,
};
