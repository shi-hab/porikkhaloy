export const handleChange = (ids, categories, setCategoryData, setValue, nextCategoryKey) => {
    if (categories) {
        const foundData = ids.map(id => categories.find(item => item.id === id)).filter(Boolean);
        setCategoryData(foundData || null);

        if (nextCategoryKey) {
            const allNextCategories = foundData.flatMap(item => item[nextCategoryKey] || []);
            setValue(nextCategoryKey, allNextCategories);
        } else {
            setValue(categories, ids);
        }
    }
    return [];
};

// const handleSectionChange = (ids) => handleChange(ids, sections, setSectionData, setValue, "exam_types");
// const handleGroupChange = (ids) => handleChange(ids, groups, setGroupData, setValue, "levels");
// Continue for other categories...

