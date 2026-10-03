import { apiSlice } from "../api/apiSlice";

export const studentLeaderboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: ({ myClass, page = 1, perPage = 50 } = {}) => ({
        url: '/leaderboard',
        params: { my_class: myClass ? 1 : 0, page, per_page: perPage },
      }),
    }),
    getMyLeaderboardStatus: builder.query({
      query: () => '/leaderboard/me',
    }),
  }),
});

export const {
  useGetLeaderboardQuery,
  useGetMyLeaderboardStatusQuery,
} = studentLeaderboardApi;
