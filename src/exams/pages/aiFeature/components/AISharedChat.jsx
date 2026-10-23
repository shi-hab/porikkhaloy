import { Link, useParams } from "react-router-dom";
import { useSharedConversationQuery } from "@/features/aiFeature/aiAssistantApi";
import AIMessage from "./AIMessage";
import "./ai-chat.css";

export default function AISharedChat() {
  const { token } = useParams();
  const { data, isLoading, isError } = useSharedConversationQuery(token);
  const conv = data?.data;

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-3 border-b pb-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">PORI AI • শেয়ার করা চ্যাট</p>
          <h1 className="mt-1 truncate text-lg font-semibold text-gray-900">{conv?.title || "চ্যাট"}</h1>
        </div>
        <Link to="/pori-ai" className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          নিজের চ্যাট শুরু করো
        </Link>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-11/12 rounded bg-gray-100" />
          <div className="h-4 w-9/12 rounded bg-gray-100" />
          <div className="h-4 w-6/12 rounded bg-gray-100" />
        </div>
      )}

      {isError && (
        <p className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">
          এই লিংকটি আর কাজ করছে না, অথবা চ্যাটটি শেয়ার বন্ধ করা হয়েছে।
        </p>
      )}

      {conv && (
        <div className="space-y-6">
          {conv.messages.map((m) => (
            <AIMessage
              key={m.id}
              msg={{ id: `s-${m.id}`, role: m.role === "user" ? "user" : "assistant", content: m.content }}
            />
          ))}
        </div>
      )}
    </div>
  );
}