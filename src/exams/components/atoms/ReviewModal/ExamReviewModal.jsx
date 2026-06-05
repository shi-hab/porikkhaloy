import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ExamReviewModal({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}) {
  const [rating, setRating] = useState("");
  const [questionQuality, setQuestionQuality] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    onSubmit({
      rating,
      question_quality: questionQuality,
      review_text: reviewText,
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="dark:bg-gray-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Exam Review
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          {/* Rating */}
          <select
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Overall Rating</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          {/* Question Quality */}
          <select
            className="w-full border p-2 rounded"
            value={questionQuality}
            onChange={(e) => setQuestionQuality(e.target.value)}
          >
            <option value="">Question Quality</option>
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3">Average</option>
            <option value="2">Poor</option>
            <option value="1">Very Poor</option>
          </select>

          {/* Feedback */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write your feedback"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            Submit Review
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
