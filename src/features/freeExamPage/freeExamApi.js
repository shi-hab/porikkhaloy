import { apiSlice } from "../api/apiSlice";

export const freeExamApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFreeExam: builder.query({
        query: () => `/exam`,
    }),
    getFreeExamBatch: builder.query({
        query: () => `/free-batch`,
    }),
  }),
});

export const { 
  useGetFreeExamQuery, 
  useGetFreeExamBatchQuery,
} = freeExamApi;
