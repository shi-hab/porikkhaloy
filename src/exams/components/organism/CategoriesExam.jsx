import { useEffect, useState } from "react";
import MultiSelectCategory from "../molecules/ui/MultiSelectCategory";

export default function CategoriesExam() {
    const [selectedSections, setSelectedSections] = useState({});

    const sectionsTitle = ["Title-1", "Title-2", "Title-3", "Title-4", "Title-5",]

    const sections = sectionsTitle?.map((section) => section)


    const handleCategoryChange = (selectedCategories, label) => {
        setSelectedSections(prevSelectedSections => ({
            ...prevSelectedSections,
            [label]: selectedCategories
        }));
    };


    return (
      <div className="h-full min-h-20 pb-20">
        <div className="flex flex-wrap items-center justify-center w-full gap-4 mx-auto md:w-2/3 ">
          <MultiSelectCategory
            options={sections}
            label="Questions Category"
            onChange={(selected) => handleCategoryChange(selected, "Category")}
          />
          <MultiSelectCategory
            options={sections}
            label="Sections"
            onChange={(selected) => handleCategoryChange(selected, "Sections")}
          />
          <MultiSelectCategory
            options={sections}
            label="Exam"
            onChange={(selected) => handleCategoryChange(selected, "Exam")}
          />
          <MultiSelectCategory
            options={sections}
            label="Subjects"
            onChange={(selected) => handleCategoryChange(selected, "Subjects")}
          />
          <MultiSelectCategory
            options={sections}
            label="Chapter"
            onChange={(selected) => handleCategoryChange(selected, "Chapter")}
          />
          <MultiSelectCategory
            options={sections}
            label="Topic"
            onChange={(selected) => handleCategoryChange(selected, "Topic")}
          />
        </div>
      </div>
    );
}
