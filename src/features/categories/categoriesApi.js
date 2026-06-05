import { apiSlice } from "../api/apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: (category) => `/category/${category}`,
        }),
        
        examFilter: builder.query({
            query: (category) => `${category}`,
        }),
        getCategoryById: builder.query({
            query: ({ category, id }) => {
                if (category === "tags") {
                    return `/tags/${id}`;
                }

                return `/category/${category}/${id}`;
            },
        }),
        getPkgCats: builder.query({
            query: () => "/package-categories",
        }),
        getAllPkgCats: builder.query({
            query: () => "/all-package-categories",
        }),
        fetchLessons: builder.mutation({
            query: (data) => ({
                url: "/lesson",
                method: "POST",
                body: {subject_ids:data},
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        verifyAccount: builder.mutation({
            query: (data) => ({
                url: "/verify-email",
                method: "POST",
                body: data,
            }),
            
        }),
        resendVerifyAccount: builder.mutation({
            query: (data) => ({
                url: "/resend-email-verification",
                method: "POST",
                body: data,
            }),
            
        }),
        fetchTopics: builder.mutation({
            query: (data) => ({
                url: "/topic",
                method: "POST",
                body: {lesson_ids:data},
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.log(err);
                }
            },
        }),
        fetchSubTopics: builder.mutation({
            query: (data) => ({
                url: "/sub-topic",
                method: "POST",
                body: {topic_ids:data},
            }),
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    console.log(err);
                }
            },
        }),
    }),
});

export const {
    useGetCategoryQuery,
    useExamFilterQuery,
    useGetCategoryByIdQuery,
    useGetPkgCatsQuery,
    useGetAllPkgCatsQuery,
    useFetchLessonsMutation,
    useFetchTopicsMutation,
    useFetchSubTopicsMutation,
    useVerifyAccountMutation,
    useResendVerifyAccountMutation
} = categoriesApi;
