import { Badge } from "@/components/ui/badge";
import { useGetCategoryByIdQuery } from "@/features/categories/categoriesApi";

const TagsTitle = ({ tagId }) => {
  const { data: tagData } = useGetCategoryByIdQuery({
    category: "tags",
    id: tagId,
  });

  const title = tagData?.data?.title;

  if (!title || title.toLowerCase() === "uncategorized") {
    return null;
  }

  return <Badge variant="outline">{title}</Badge>;
};

export default TagsTitle;