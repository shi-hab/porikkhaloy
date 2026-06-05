import { apiSlice } from "../api/apiSlice";

export const pdfsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Fetch all PDFs
    getPdfs: builder.query({
      query: () => "/pdfs",
      providesTags: ["Pdfs"],
    }),

    // 2. Fetch a single PDF by ID
    getPdfById: builder.query({
      query: (id) => `/pdfs/${id}`,
      providesTags: (result, error, id) => [{ type: "Pdfs", id }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetPdfsQuery, useGetPdfByIdQuery } = pdfsApi;
