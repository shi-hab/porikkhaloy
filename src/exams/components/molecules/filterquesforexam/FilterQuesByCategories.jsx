import SelectField from "./SelectField";
import { useCategoryData } from "./useCategoryData";

// , setSelectedSection, setSelectedExamType, setSelectedExamSubType, setSelectedGroup, setSelectedLesson, setSelectedLevel, setSelectedSubject, setSelectedTopic, setSelectedSubTopic, setSelectedYear

export default function FilterQuesByCategories({ control, setValue }) {

    const { data: sections, isLoading, error, categoryData: sectionData, setCategoryData: setSectionData } = useCategoryData("sections", "selectedSection");
    const { data: examTypes, categoryData: examTypeData, setCategoryData: setExamTypeData } = useCategoryData("exam-types", "selectedExamType");
    // const { selected: selectedExamSubType } = useCategoryData("exam-sub-types", "selectedExamSubType");
    const { data: groups, categoryData: groupData, setCategoryData: setGroupData } = useCategoryData("groups", "selectedGroup");
    const { data: levels, categoryData: levelData, setCategoryData: setLevelData } = useCategoryData("levels", "selectedLevel");
    const { data: subjects, categoryData: subjectData, setCategoryData: setSubjectData } = useCategoryData("subjects", "selectedSubject");
    const { data: lessons, categoryData: lessonData, setCategoryData: setLessonData } = useCategoryData("lessons", "selectedLesson");
    const { data: topics, categoryData: topicData, setCategoryData: setTopicData } = useCategoryData("topics", "selectedTopic");
    // const { selected: selectedSubTopic } = useCategoryData("sub-topics", "selectedSubTopic");
    const { data: years } = useCategoryData("years", "selectedYear");

    const handleSectionChange = (id) => {
        if (sections) {
            const foundData = sections.find(item => item.id == id);
            setSectionData(foundData,  null);
            setValue("section", id)
        }
    }

    const handleExamTypeChange = (id) => {
        if (examTypes) {
            const foundData = examTypes.find(item => item.id == id);
            setExamTypeData(foundData,  null);
            setValue("exam_type", id)
        }
    }

    const handleExamSubTypeChange = (id) => {
        setValue("exam_sub_type", id)
    };

    const handleGroupChange = (id) => {
        if (groups) {
            const foundData = groups.find(item => item.id == id);
            setGroupData(foundData , null);
            setValue("group", id)
        }
    }

    const handleLevelChange = (id) => {
        if (levels) {
            const foundData = levels.find(item => item.id == id);
            setLevelData(foundData,  null);
            setValue("level", id)
        }
    }

    const handleLessonChange = (id) => {
        if (lessons) {
            const foundData = lessons.find(item => item.id == id);
            setLessonData(foundData,  null);
            setValue("lesson", id)
        }
    }

    const handleSubjectChange = (id) => {
        if (subjects) {
            const foundData = subjects.find(item => item.id == id);
            setSubjectData(foundData,  null);
            setValue("subject", id)
        }
    }

    const handleTopicChange = (id) => {
        if (topics) {
            const foundData = topics.find(item => item.id == id);
            setTopicData(foundData || null);
            setValue("topic", id)
        }
    }

    const handleSubTopicChange = (id) => {
        setValue("sub_topic", id)
    };

    const handleYearChange = (id) => {
        setValue("year", id)
    };

    if (isLoading) {
        return <div>Loading sections...</div>;
    }

    if (error) {
        return <div>Error loading sections: {error.message}</div>;
    }

    const renderSelectField = ({ label, name, options, onChange, defaultValue, rules, disabled }) => (
        <SelectField
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
return (
        <div className="space-y-4 mt-4">
            {/* Section → Exam Type → Exam Sub Type */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {renderSelectField({
                    label: "Section",
                    name: "section",
                    options: sections,
                    onChange: handleSectionChange,
                })}

                {sectionData?.exam_types && renderSelectField({
                    label: "Exam Type",
                    name: "exam_type",
                    options: sectionData.exam_types,
                    onChange: handleExamTypeChange,
                    disabled: !sectionData
                })}

                {examTypeData?.exam_sub_types && renderSelectField({
                    label: "Exam Sub Type",
                    name: "exam_sub_type",
                    options: examTypeData.exam_sub_types,
                    onChange: handleExamSubTypeChange,
                    disabled: !examTypeData
                })}
            </div>

            {/* Group → Level → Subject → Lesson → Topic → Sub Topic */}
            <div className="grid md:grid-cols-3 gap-2">
                {renderSelectField({
                    label: "Group",
                    name: "group",
                    options: groups,
                    onChange: handleGroupChange,
                })}

                {groupData?.levels && renderSelectField({
                    label: "Level",
                    name: "level",
                    options: groupData.levels,
                    onChange: handleLevelChange,
                    disabled: !groupData
                })}

                {levelData?.subjects && renderSelectField({
                    label: "Subject",
                    name: "subject",
                    options: levelData.subjects,
                    onChange: handleSubjectChange,
                    disabled: !levelData
                })}

                {subjectData?.lessons && renderSelectField({
                    label: "Lesson",
                    name: "lesson",
                    options: subjectData.lessons,
                    onChange: handleLessonChange,
                    disabled: !subjectData
                })}

                {lessonData?.topics && renderSelectField({
                    label: "Topic",
                    name: "topic",
                    options: lessonData.topics,
                    onChange: handleTopicChange,
                    disabled: !lessonData
                })}

                {topicData?.sub_topics && renderSelectField({
                    label: "Sub Topic",
                    name: "sub_topic",
                    options: topicData.sub_topics,
                    onChange: handleSubTopicChange,
                    disabled: !topicData
                })}
            </div>

            {/* Year */}
            <div className="pt-4">
                {renderSelectField({
                    label: "Year",
                    name: "year",
                    options: years,
                    onChange: handleYearChange,
                })}
            </div>
        </div>
    );
}