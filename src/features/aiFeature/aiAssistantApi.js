import { apiSlice } from "../api/apiSlice"; // ager file er import line

export const aiAssistantApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    aiChat: b.mutation({
      query: ({ formData, idemKey }) => ({
        url: "/ai/chat",
        method: "POST",
        body: formData,
        headers: { "Idempotency-Key": idemKey },
      }),
      invalidatesTags: ["AIUsage", "AIConversations"],
    }),
    aiUsage: b.query({ query: () => "/ai/usage", providesTags: ["AIUsage"] }),
    aiConversations: b.query({
      query: (type) =>
        `/ai/conversations${type ? `?assistant_type=${type}` : ""}`,
      providesTags: ["AIConversations"],
    }),
    aiConversation: b.query({ query: (uuid) => `/ai/conversations/${uuid}` }),
    aiDeleteConversation: b.mutation({
      query: (uuid) => ({ url: `/ai/conversations/${uuid}`, method: "DELETE" }),
      invalidatesTags: ["AIConversations"],
    }),
    shareConversation: b.mutation({
      query: (uuid) => ({
        url: `/ai/conversations/${uuid}/share`,
        method: "POST",
      }),
    }),
    unshareConversation: b.mutation({
      query: (uuid) => ({
        url: `/ai/conversations/${uuid}/share`,
        method: "DELETE",
      }),
    }),
    sharedConversation: b.query({ query: (token) => `/ai/shared/${token}` }),
    aiFeedback: b.mutation({
      query: ({ id, feedback }) => ({
        url: `/ai/messages/${id}/feedback`,
        method: "PATCH",
        body: { feedback },
      }),
    }),

    // attachment route e login lage, tai <img src> e sorasori dewa jay na -- apnar auth diye blob nibo
    aiAttachment: b.query({
      query: (url) => ({ url, responseHandler: (r) => r.blob() }),
      transformResponse: (blob) => URL.createObjectURL(blob),
    }),
  }),
});

export const {
  useAiChatMutation,
  useAiUsageQuery,
  useAiConversationsQuery,
  useLazyAiConversationQuery,
  useAiDeleteConversationMutation,
  useShareConversationMutation,
  useUnshareConversationMutation,
  useSharedConversationQuery,
  useAiFeedbackMutation,
  useAiAttachmentQuery,
} = aiAssistantApi;
