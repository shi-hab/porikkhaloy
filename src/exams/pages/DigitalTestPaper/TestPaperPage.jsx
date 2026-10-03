import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import SubjectWithChapterSelect from "./categorySelection/SubjectWithChapterSelect";
import TestPaperTypeSelect from "./categorySelection/TestPaperTypeSelect";
import QuestionTypeWithYear from "./categorySelection/QuestionTypeWithYear";
import { useForm, FormProvider } from "react-hook-form";

function TestPaperPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const {
    handleSubmit,
    control,
    setValue,
    formState:{errors},

  } = useForm();


  const steps = useMemo(
    () => [
      {
        title: "বিষয় ও অধ্যায় নির্বাচন",
        component: <SubjectWithChapterSelect control={control} setValue={setValue}/>,
      },
      {
        title: "প্রশ্নের ধরন নির্বাচন",
        component: <TestPaperTypeSelect control={control} setValue={setValue}/>,
      },
      {
        title: "বছর ও প্রশ্ন নির্বাচন",
        component: <QuestionTypeWithYear control={control} setValue={setValue}/>,
      },
    ],
    []
  );

  const totalSteps = steps.length;

  const handleNext = () => {
    console.log("Current Step:", currentStep);

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFilterQuestions = (data) => {
    console.log(data);

    // navigate("/testpaper-que");
  };


  return (
    <div className="min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit(handleFilterQuestions)}>
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b">
            <div className="max-w-6xl mx-auto px-4 py-5">

              <div className="flex items-center justify-between">

                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handlePrevious}
                  className="flex items-center gap-2 font-regular"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  {currentStep}/{totalSteps} স্টেপ
                </div>

              </div>
              <p className="mt-2 text-gray-500 text-center">
                {steps[currentStep - 1].title}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="rounded-2xl bg-white shadow-sm border p-5">
              {steps[currentStep - 1].component}
            </div>
          </div>

        </form>
        {/* Bottom Navigation */}
        <div className="sticky bottom-0 bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="w-40"
            >
              পিছনে
            </Button>

            {currentStep === totalSteps ? (
              <Button
                type="submit"
                className="flex-1"
                onClick={handleSubmit(handleFilterQuestions)}
              >
                পরীক্ষা শুরু করুন
              </Button>
            ) : (
              <Button
                type="button"
                variant="green"
                onClick={handleNext}
                className="flex-1"
              >
                এগিয়ে যান
              </Button>
            )}
          </div>
        </div>
    </div>
  );
}

export default TestPaperPage;