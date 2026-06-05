import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import TagsTitle from "./TagsTitle";
import { IoIosLock } from "react-icons/io";
import { parseHtmlContent } from "@/utils/parseHtmlContent";

export function ViewModal({ data, tagIds, verified }) {
  const { id, title, is_paid, is_featured, type, mark, mcq_questions } =
    data || {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link variant="outline">
          <Eye size={20} className="text-gray-600" />
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80%] md:max-w-[60%] border border-gray-400 ">
        <DialogHeader>
          <div className="mb-4">
            <p className="my-4 text-lg dark:text-white">
              {parseHtmlContent(title)}
            </p>

            {/* Display Tag Names */}
            <div className="flex flex-wrap justify-end gap-2">
              {tagIds.map((tagId) => (
                <TagsTitle key={tagId} tagId={tagId} />
              ))}
            </div>
          </div>

          <div>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
              {mcq_questions?.map((option, index) => (
                <li
                  key={option.id}
                  className="flex items-center gap-3 p-2 border rounded-sm bg-gray-50"
                >
                  {option?.is_correct ? (
                    <p className="flex items-center justify-center h-8 border rounded-full min-w-8">
                      <Check className="text-green-600" />
                    </p>
                  ) : (
                    <p className="flex items-center justify-center h-8 border rounded-full min-w-8">
                      {index + 1 == 1
                        ? "১"
                        : index + 1 == 2
                        ? "২"
                        : index + 1 == 3
                        ? "৩"
                        : "৪"}
                    </p>
                  )}
                  <p className="font-solaiman-lipi">
                    {parseHtmlContent(option.mcq_question_text)}
                  </p>
                </li>
              ))}
              <p className="col-span-2">
                {verified?.verified == "active" ? (
                  mcq_questions
                    ?.filter(
                      (option) => option?.is_correct && option?.description
                    )
                    ?.map((option) => (
                      <li key={option.id} className="mt-2">
                        <strong>Explanation</strong> - {option.description}
                      </li>
                    ))
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2 text-xl text-green-800 bg-green-200 rounded-md font-hind-siliguri">
                    <IoIosLock />
                    <p>ব্যাখ্যা আনলক করতে এক্সাম পেকেজ ইনরোল করুন</p>
                  </div>
                )}
              </p>
            </ul>
          </div>

          {/* <div>
                        {type === "mcq" ? <div>
                            {<div className="">
                                <ul className="mb-2 space-y-1 text-sm "
                                >
                                    {mcq_questions?.map((option) => <li key={option.id} className="ml-5 list-decimal " >
                                        <p>{index+1} </p>
                                        {parseHtmlContent(option?.mcq_question_text)} </li>)}
                                </ul>
                            </div>}
                        </div>
                            : type === "creative" ? <div>
                                {<div className="">
                                    <ul className="text-sm"
                                    >
                                        {creative_questions?.map((question, index) => <li key={index} className="ml-5 list-decimal " > {parseHtmlContent(question?.creative_question_text)} </li>)}
                                    </ul>
                                </div>}
                            </div> : ""}
                    </div> */}

          {/* <div className="flex items-start gap-2">
                        <span className="font-medium">Description:</span>
                        <span  >
                            {parseHtmlContent(title)}
                        </span>
                    </div> */}

          <div className="flex items-center gap-3 pt-4 text-xs ">
            <p>Que ID: {id}</p>
            <p className="pl-2 border-l border-gray-400">
              {is_paid === 0 ? "Not paid" : "paid"}
            </p>
            <p className="pl-2 border-l border-gray-400">{mark} Marks </p>
            <p className="pl-2 border-l border-gray-400">
              {is_featured === 0 ? "Not featured" : "featured"}
            </p>
            <p className="pl-2 capitalize border-l border-gray-400">
              {" "}
              <span
                className={`${type === "mcq" ? "uppercase" : "capitalize"}`}
              >
                {" "}
                {type}{" "}
              </span>
              question
            </p>
          </div>
          {/* <div className="text-sm ">
                        <div id="section" className="mt-1">
                            <p><span className="font-medium">Section:</span>  &rarr; exam-type &rarr; exam sub-type</p>
                        </div>
                        <div id="group" className="mb-2">
                            <p> <span className="font-medium"> Group: </span> &rarr; level &rarr; subject &rarr; exam topic &rarr; exam sub-topic</p>
                        </div>
                    </div> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
