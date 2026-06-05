import { apiSlice } from "../api/apiSlice";

export const navBarApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllForNavbar: builder.query({
      query: () => "/navbar",
    }),

  }),
});

export const {
  useGetAllForNavbarQuery,
} = navBarApi;
