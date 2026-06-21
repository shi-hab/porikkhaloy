import { apiSlice } from "../api/apiSlice";
import { saveExamInfo } from "./battleQuizSlice";

export const examsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
        quizBattle: builder.mutation({
        query: (data) => ({
            url: "/quizBattle/start",
            method: "POST",
            body: data,
        }),

        async onQueryStarted(arg, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled;
            const { categories, questions_list, mcqAnswers } = result.data;
  
            dispatch(
              saveExamInfo({
                categories,
                questions_list,
                mcqAnswers,
              })
            );
          } catch (err) {
             (err);
          }
        },
    }),

    submitAnswer: builder.mutation({
        query: (data) => ({
            url: "/quizBattle/answer",
            method: "POST",
            body: data,
        }),
    }),
  }),
});

export const {
  useQuizBattleMutation,
  useSubmitAnswerMutation,
} = examsApi;
