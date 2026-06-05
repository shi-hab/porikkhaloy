import { apiSlice } from "../api/apiSlice";

export const CouponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyCoupon: builder.mutation({
      query: ({ pkgID, coupon_code,discountedPrice }) => ({
        url: `/applyCoupon/${pkgID}`,
        method: "POST",
        body: { coupon_code , discountedPrice},
      }),
    }),
  }),
});

export const { useApplyCouponMutation } = CouponApi;
