import { apiSlice } from "../api/apiSlice";

export const testPaperCategoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
         getTestPaperCategory: builder.query({
            query: ({ type, context } = {}) => {

                let url = `/category/${type}`;

                if (context) {
                    url += `?context=${context}`;
                }

                return url;
            },

            providesTags: ["TestPaper"],
        }),
    }),
});

export const { 
    useGetTestPaperCategoryQuery,
} = testPaperCategoryApi;