import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReverseCountdownTimer from "@/features/timeCountdown/TimeReverseCounteDown";
export const MTExamActions = ({
  isLoading,
  onExamsSubmit,
  allExamsSubmitted,
  modelTestId,
}) => {
  const navigate = useNavigate();

  const handleResultShow = () => {
    if (!allExamsSubmitted) {
      toast.error("You can not view results before the end time of the exam.");
    } else {
      navigate(`/model-test/${modelTestId}/mtexam-result`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 px-2 mx-auto my-4 bottom-2 max-w-7xl">
      {allExamsSubmitted ? (
        <Button
          onClick={handleResultShow}
          className="w-full "
        >
          View Result
        </Button>
      ) : (
        <>
          {!isLoading && (
            <span className="fixed top-[57px] md:top-16 px-2 py-1 w-[70px] rounded-l text-white right-0 bg-blue-800 z-[999]">
              <ReverseCountdownTimer />
            </span>
          )}
          <Button
            onClick={() => {
              onExamsSubmit();
            }}
            disabled={isLoading}
          >
            <p className="flex  justify-center gap-5 text-center ">
              <span>{isLoading ? "Please Wait..." : "submit"}</span>
            </p>
          </Button>
        </>
      )}
    </div>
  );
};
