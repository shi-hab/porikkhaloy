import { Badge } from "@/components/ui/badge";
import { useGetCategoryByIdQuery } from "@/features/categories/categoriesApi";

const TagsTitle = ({ tagId }) => {
  const { data: tagData } = useGetCategoryByIdQuery({
    category: "tags",
    id: tagId,
  });

  return (
    <Badge variant="outline outline-green-200">{tagData?.data?.title}</Badge>
  );
};

export default TagsTitle;
