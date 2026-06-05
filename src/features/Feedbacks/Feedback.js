import { apiSlice } from "../api/apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQuestionFeedback: builder.query({
            query: ({ page, perPage }) =>
                `/feedback/question?page=${page}&per_page=${perPage}`,
        }),
        getMentorFeedback: builder.query({
            query: ({ page, perPage }) =>
                `/feedback/mentor?page=${page}&per_page=${perPage}`,
        }),
        addFeedback: builder.mutation({
            query: (data) => ({
                url: `/feedback`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useAddFeedbackMutation,useGetMentorFeedbackQuery,useGetQuestionFeedbackQuery } = feedbackApi;
