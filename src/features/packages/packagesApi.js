import { apiSlice } from "../api/apiSlice";

export const packagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackages: builder.query({
      query: () => "/packages",
    }),
    getAllPayments: builder.query({
      query: () => "/student-payments",
    }),

    getAllHomePageData: builder.query({
      query: (student_id) => `/carousel/${student_id}`,
    }),

    getSinglePackage: builder.query({
      query: (id) => `/packages/${id}`,
    }),

    getModelTestsByPkgId: builder.query({
      query: (id) => `/packages/${id}/model-tests`,
    }),

    getModelTestsExam: builder.query({
      query: (modelTestId) => `/packages/model-tests/${modelTestId}`,
    }),

    getSingleModelTest: builder.query({
      query: (id) => `/model-tests/${id}`,
    }),
    
    myExamsubScriptions: builder.query({
      query: () => `/my-exam-subscriptions`,
    }),

    getExamsUnderMT: builder.query({
      query: (id) => `/model-test-exams/${id}`,
    }),
    getSubjectsNamesUnderMT: builder.query({
      query: (model_test_id) =>
        `/model-test-exams/subject-names/${model_test_id}`,
    }),
    subscribeToPackage: builder.mutation({
      query: (data) => ({
        url: "/pay",
        method: "POST",
        body: data,
      }),
    }),
    examQuotaSubscriptions: builder.mutation({
      query: (data) => ({
        url: "/exam-quota-subscriptions",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllPackagesQuery,
  useGetAllPaymentsQuery,
  useGetAllHomePageDataQuery,
  useGetSinglePackageQuery,
  useGetSingleModelTestQuery,
  useSubscribeToPackageMutation,
  useGetModelTestsByPkgIdQuery,
  useGetSubjectsNamesUnderMTQuery,
  useGetExamsUnderMTQuery,
  useExamQuotaSubscriptionsMutation,
  useMyExamsubScriptionsQuery,
  useGetModelTestsExamQuery,
} = packagesApi;
