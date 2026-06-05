import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => `/dashboard`, // ✅ No params, just fixed 25 from backend
    }),
    getStreakData: builder.query({
      query: () => `/streak`, // ✅ No params, just fixed 25 from backend
    }),
  }),
});

export const { useGetDashboardDataQuery,useGetStreakDataQuery } = dashboardApi;
