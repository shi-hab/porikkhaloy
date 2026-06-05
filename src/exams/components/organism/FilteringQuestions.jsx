import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LuFilter } from "react-icons/lu";

import FilterQuestionsByCategory from "../molecules/questionList/FilterQuestionsByCategory";
import { Skeleton } from "antd";

export default function FilteringQuestions({ control, setValue, refetch, handleFilterQuestions, register, handleSubmit, errors, isLoadingGetQuestions }) {

  return (
    <form
      onSubmit={handleSubmit(handleFilterQuestions)}
      className="relative h-full min-h-20 py-2 pt-0 p-5"
    >
      <div className="mb-4 bg-green-300 ">
        <FilterQuestionsByCategory control={control} setValue={setValue} />
      </div>

      <div className="flex gap-5">
        {isLoadingGetQuestions ? (
          <Skeleton.Input className="!w-full !h-12" active />
        ) : (
          <div className="relative mb-4 w-full">
            {/* Search Input */}
            <Input
              placeholder="Search questions..."
              {...register("keyword")}
              className="pr-10 w-full"
            />
            <button type="submit" className="absolute right-5 top-[15px]">
              <Search size={18} className="opacity-70" />
            </button>
          </div>
        )}

        <div className="mb-4 text-end">
          {isLoadingGetQuestions ? (
            <Skeleton.Button active className="!h-12 !w-20" />
          ) : (
            <Button type="submit" className="!py-6 !space-x-6">
              <LuFilter className="mr-2" />
              Filtered
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
