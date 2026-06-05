import { apiSlice } from "../api/apiSlice";

export const AdmissionCalenderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCalenderData: builder.query({
      query: () => ({
        url: `/calendar-show`,
        method: "GET",
        invalidatesTags: ["AdmissionCalendar"],
      }),
    }),
    getSingleCalenderData: builder.query({
      query: ({id}) => ({
        url: `/calendar-show/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["AdmissionCalendar"],
    }),
    addFavoriteCalender: builder.mutation({
      query: ({id}) => ({
        url: `/calendar-add-favorite/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["AdmissionCalendar"],
    }),
  }),
});

export const { 
  useGetAllCalenderDataQuery,
  useGetSingleCalenderDataQuery,
  useAddFavoriteCalenderMutation,
} = AdmissionCalenderApi;
