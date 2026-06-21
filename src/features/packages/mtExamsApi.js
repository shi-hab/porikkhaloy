import { persistor } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import { submittedMTExamInfo } from "./submittedMTExamSlice";

export const mtExamsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startMTExam: builder.mutation({
      query: (data) => ({
        url: "model-test-exam-start",
        method: "POST",
        body: data,
      }),
    }),

    finishAllMTExam: builder.mutation({
      query: (data) => ({
        url: "/model-test-exam-finish",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const submittedMTExam = result.data;

          localStorage.removeItem("selectedOptionalExam");
          // persistor.purge(["mtExam"]);

          dispatch(submittedMTExamInfo(submittedMTExam));
        } catch (err) {
           (err);
        }
      },
    }),

    getFreeModelTest: builder.query({
      query: () =>
        `/free-exam`,
    }),

    getAllStuResult: builder.query({
      query: (modelTestId) =>
        `/model-test-all-students-exam-result/${modelTestId}`,
    }),
    getStudentsMeritList: builder.query({
      query: (modelTestId) =>
        `/model-test-exam/students-merit-list/${modelTestId}`,
    }),

    getSingleStuResult: builder.query({
      query: ({ studentId, modelTestId }) =>
        `/model-test-exam-result-with-merit/${studentId}/${modelTestId}`,
    }),

    uploadAnswerFile: builder.mutation({
      query: (data) => ({
        url: "/answer-files/upload",
        method: "POST",
        body: data,
      }),
    }),

    getAnsweredFile: builder.query({
      query: ({ id, params }) => {
        const queryString = params
          ? "?" + new URLSearchParams(params).toString()
          : "";
        return {
          url: `/answer-files/${id}${queryString}`,
          method: "GET",
        };
      },
    }),

    submitReview: builder.mutation({
      query: (data) => ({
        url: "/reviews/submit",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useStartMTExamMutation,
  useFinishAllMTExamMutation,
  useGetAllStuResultQuery,
  useGetStudentsMeritListQuery,
  useGetSingleStuResultQuery,
  useUploadAnswerFileMutation,
  useGetAnsweredFileQuery,
  useGetFreeModelTestQuery,
  useSubmitReviewMutation,
} = mtExamsApi;
