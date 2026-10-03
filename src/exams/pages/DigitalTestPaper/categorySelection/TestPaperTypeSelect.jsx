import { useState } from "react";
import {
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoryData } from "@/features/hooks/useCategoryData";
import { Skeleton } from 'antd';

function TestPaperTypeSelect() {
  const {
    data: examTypes,
    isLoading,
    setCategoryData: setExamTypeData,
  } = useCategoryData({
    type: "exam-sub-types",
    context: "test-paper",
  });

  const [openTypes, setOpenTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPapers, setSelectedPapers] = useState([]);

  const toggleType = (id) => {
    setOpenTypes((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleTypeCheck = (type) => {
    const paperIds = type.exam_papers?.map((paper) => paper.id) || [];
    const isSelected = selectedTypes.includes(type.id);

    if (isSelected) {
      setSelectedTypes((prev) => prev.filter((id) => id !== type.id));

      setSelectedPapers((prev) =>
        prev.filter((id) => !paperIds.includes(id))
      );
    } else {
      setSelectedTypes((prev) => [...prev, type.id]);

      setSelectedPapers((prev) => [
        ...new Set([...prev, ...paperIds]),
      ]);
    }

    setExamSubTypeData(type);
  };

  const handlePaperCheck = (paperId, type) => {
    const paperIds = type.exam_papers?.map((paper) => paper.id) || [];

    setSelectedPapers((prev) => {
      const checked = prev.includes(paperId);

      let updated = [];

      if (checked) {
        updated = prev.filter((id) => id !== paperId);

        setSelectedTypes((types) =>
          types.filter((id) => id !== type.id)
        );
      } else {
        updated = [...prev, paperId];

        const allSelected = paperIds.every((id) =>
          updated.includes(id)
        );

        if (allSelected) {
          setSelectedTypes((types) =>
            types.includes(type.id)
              ? types
              : [...types, type.id]
          );
        }
      }

      return updated;
    });
  };

  if (isLoading) {
    return <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">

      {examTypes.map((type) => {

        const opened = openTypes.includes(type.id);
        const typeSelected = selectedTypes.includes(type.id);

        const selectedCount =
          type.exam_papers?.filter((paper) =>
            selectedPapers.includes(paper.id)
          ).length || 0;

        const totalCount = type.exam_papers?.length || 0;

        return (
          <div
            key={type.id}
            className="rounded-xl border bg-white overflow-hidden shadow-sm"
          >
            {/* Header */}

            <div className="flex items-center justify-between px-5 py-4 bg-blue-50">

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() => handleTypeCheck(type)}
                >
                  {typeSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                <BookOpen className="w-5 h-5 text-blue-600" />

                <h3 className="font-bold">
                  {type.title}
                </h3>

              </div>

              <button
                type="button"
                onClick={() => toggleType(type.id)}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-gray-500">
                  {selectedCount}/{totalCount}
                </span>

                <ChevronDown
                  className={cn(
                    "transition-transform",
                    opened && "rotate-180"
                  )}
                />
              </button>

            </div>

            {/* Papers */}

            <div
              className={cn(
                "transition-all overflow-hidden",
                opened
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >

              <div className="p-4 bg-gray-50 space-y-2">

                {type.exam_sub_types?.map((paper) => {

                  const checked =
                    selectedPapers.includes(paper.id);

                  return (
                    <button
                      type="button"
                      key={paper.id}
                      onClick={() =>
                        handlePaperCheck(paper.id, type)
                      }
                      className="w-full flex items-center gap-3 rounded-lg border bg-white px-4 py-3 hover:border-blue-400 transition"
                    >
                      {checked ? (
                        <CheckCircle2 className="text-green-600 w-5 h-5" />
                      ) : (
                        <Circle className="text-gray-400 w-5 h-5" />
                      )}

                      <span>{paper.title}</span>

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Progress */}

            <div className="h-1 bg-gray-200">

              <div
                className="h-full bg-green-600 transition-all"
                style={{
                  width: `${(selectedCount / totalCount) * 100}%`,
                }}
              />

            </div>

          </div>
        );
      })}
    </div>
  );
}

export default TestPaperTypeSelect;