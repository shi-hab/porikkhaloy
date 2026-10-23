// Adjust this import to wherever your base RTK Query slice lives
// (the same one examsApi.js / packagesApi.js use with injectEndpoints).
import { apiSlice } from "@/features/api/apiSlice";

const sorted = (ids = []) => [...ids].sort((a, b) => a - b).join(",");

export const mockTestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // subjects + exam types + config: one request, cached for an hour
    getMockBootstrap: builder.query({
      query: (scope) => ({ url: "mock-test/bootstrap", params: { s: scope } }),
    }),

    getMockTree: builder.query({
      query: ({ subjectIds, type, scope }) => ({
        url: "mock-test/tree",
        params: { subject_ids: subjectIds.join(","), type, s: scope },
      }),
    }),

    // live "how many questions exist?" check on the confirm step
    getMockAvailability: builder.query({
      query: ({ type, topicIds, lessonIds, subTopicIds = [], standardIds }) => ({
        url: "/mock-test/availability",
        params: {
          type,
          topic_ids: sorted(topicIds),
          lesson_ids: sorted(lessonIds),
          sub_topic_ids: sorted(subTopicIds),
          exam_type_ids: sorted(standardIds),
        },
      }),
      keepUnusedDataFor: 60,
    }),

  }),
});

export const {
  useGetMockBootstrapQuery,
  useGetMockTreeQuery,
  useGetMockAvailabilityQuery,
  usePrefetch,
} = mockTestApi;