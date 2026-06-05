import { apiSlice } from "../api/apiSlice";

export const questionMarkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getQuestionMarks: builder.query({
      query: (questionId) => `/question-mark/${questionId}`,
    }),

    getAllMarks: builder.query({
      query: () => `/question-mark`,
    }),

    toggleQuestionMark: builder.mutation({
      query: (data) => ({
        url: "/question-mark/toggle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "QuestionMark", id: data.question_id }
      ],
    }),

  }),
});

export const {
  useGetQuestionMarksQuery,
  useToggleQuestionMarkMutation,
  useGetAllMarksQuery,
} = questionMarkApi;
