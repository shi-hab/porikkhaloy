import { apiSlice } from "../api/apiSlice";

export const affiliateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAffiliateCoupon: builder.mutation({
      query: (body) => ({
        url: `/create`,
        method: "POST",
        body,
      }),
    }),
    getAffiliateData: builder.query({
      query: () => ({
        url: `/affiliate-data`,
        method: "GET",
      }),
    }),

    sentWithdrawRequest: builder.mutation({
      query: ({ affiliate_id,amount, payment_method, payment_number }) => ({
        url: `/affiliate/withdraw`,
        method: "POST",
        body: {
          affiliate_id,
          amount,
          payment_method,
          payment_number,
        },
      }),
    }),

    getWithdrawHistory: builder.query({
      query: () => ({
        url: `/affiliate/withdraw-list`,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useCreateAffiliateCouponMutation,
  useGetAffiliateDataQuery ,
  useSentWithdrawRequestMutation,
  useGetWithdrawHistoryQuery,
} = affiliateApi;
