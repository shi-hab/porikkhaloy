import { apiSlice } from "../api/apiSlice";

export const leaderboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentLeaderboard: builder.query({
      query: () => `/top-leaderboard`, // ✅ No params, just fixed 25 from backend
    }),
  }),
});

export const { useGetStudentLeaderboardQuery } = leaderboardApi;
