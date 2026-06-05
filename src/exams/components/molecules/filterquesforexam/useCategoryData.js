import { useExamFilterQuery, useGetCategoryQuery } from "@/features/categories/categoriesApi";
import { useState } from "react";

 const useCategoryData = (category) => {
  const {data: categoriesData, isLoading, error} = useGetCategoryQuery(category);
  const [categoryData, setCategoryData] = useState(null); 

  return {
    categories: categoriesData?.data?.data,
    categoryData,
    setCategoryData,
    isLoading,
    error,
  };
};
const useExamFilter = (category) => {
  const {data: categoriesData, isLoading, error} = useExamFilterQuery(category);
  const [categoryData, setCategoryData] = useState(null); 
  return {
    categories: categoriesData?.data,
    categoryData,
    setCategoryData,
    isLoading,
    error,
  };
};

export { useCategoryData, useExamFilter };