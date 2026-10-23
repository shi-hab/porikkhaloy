import { apiSlice } from "../api/apiSlice";

const toQuery = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, v);
  });
  return sp.toString();
};

export const questionBankApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    getQbExamTypes: b.query({
      query: (p) => `exam-types?${toQuery(p)}`,
      transformResponse: (res) => res?.data ?? [],
      keepUnusedDataFor: 600,
    }),

    // একসাথে অনেক লিস্ট: dimensions="year,type,lesson"
    getQbFacets: b.query({
      query: (p) => `facets?${toQuery(p)}`,
      transformResponse: (res) => res?.data ?? {},
      keepUnusedDataFor: 600,
    }),

    // Infinite scroll: page বাদে বাকি args দিয়ে cache key, নতুন page আগেরটার সাথে জোড়া লাগে
    getQbQuestions: b.query({
      query: ({ page = 1, ...rest }) => `questions?${toQuery({ ...rest, page })}`,
      transformResponse: (res) => res?.data ?? { data: [], next_page_url: null },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { page, ...rest } = queryArgs || {};
        return `${endpointName}:${JSON.stringify(rest)}`;
      },
      merge: (current, incoming, { arg }) => {
        if ((arg?.page ?? 1) === 1) return incoming;
        const seen = new Set(current.data.map((q) => q.id));
        current.data.push(...incoming.data.filter((q) => !seen.has(q.id)));
        current.next_page_url = incoming.next_page_url;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      keepUnusedDataFor: 120,
    }),
  }),
});

export const {
  useGetQbExamTypesQuery,
  useGetQbFacetsQuery,
  useGetQbQuestionsQuery,
} = questionBankApi;