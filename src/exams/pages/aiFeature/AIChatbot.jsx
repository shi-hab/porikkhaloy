import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PanelLeft, ArrowDown, Sparkles, Share2 } from "lucide-react";
import AssistantSwitcher from "./components/AssistantSwitcher";
import AIChatInput from "./components/AIChatInput";
import AIMessage from "./components/AIMessage";
import ThinkingSteps from "./components/ThinkingSteps";
import AISidebar from "./components/AISidebar";
import AIRedirectNotice from "./components/AIRedirectNotice";
import {
  useAiChatMutation,
  useAiUsageQuery,
  useAiConversationsQuery,
  useLazyAiConversationQuery,
  useAiDeleteConversationMutation,
  useShareConversationMutation,
  useAiFeedbackMutation,
} from "@/features/aiFeature/aiAssistantApi";
import "./components/ai-chat.css";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CONFIG = {
  education: {
    title: "চলো, শিখি একসাথে",
    sub: "পড়াশোনার যেকোনো প্রশ্ন করো। সহজভাবে বুঝতে সাহায্য করব।",
    placeholder: "এখানে লেখো…",
    topicLabel: "বিষয়",
    options: [
      "Physics",
      "Chemistry",
      "Biology",
      "Higher Math",
      "Mathematics",
      "Bangla",
      "English",
      "ICT",
      "General Knowledge",
      "Other",
    ],
    disclaimer:
      "AI-এর উত্তরে ভুল থাকতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করে নাও।",
  },
  health: {
    title: "সুস্থ থাকতে, জিজ্ঞেস করো",
    sub: "স্বাস্থ্য ও পুষ্টি নিয়ে প্রশ্ন করো। নির্ভরযোগ্য তথ্য বুঝতে সাহায্য করব।",
    placeholder: "এখানে লেখো…",
    topicLabel: "বিষয়",
    options: [
      "General Health",
      "Nutrition",
      "Skin",
      "Fever",
      "Digestive",
      "Respiratory",
      "Mental Wellbeing",
      "First Aid",
      "Medicine Information",
      "Other",
    ],
    disclaimer:
      "আমি চিকিৎসক নই। রোগ নির্ণয় ও চিকিৎসার জন্য চিকিৎসকের পরামর্শ নাও। জরুরি অবস্থায় দ্রুত চিকিৎসাসেবা নাও।",
  },
};

const lsGet = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
};

const mapConv = (conv) => ({
  type: conv.assistant_type || "education",
  messages: (conv.messages || []).map((message) => ({
    id: message.id,
    role: message.role === "user" ? "user" : "assistant",
    content: message.content || "",
    feedback: message.feedback || null,
    images: (message.attachments || []).map((attachment) => attachment.url),
  })),
});

function MessagesSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="লোড হচ্ছে">
      <div className="flex justify-end">
        <div className="h-10 w-2/5 rounded-3xl bg-gray-100" />
      </div>

      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-3.5 w-11/12 rounded bg-gray-100" />
          <div className="h-3.5 w-10/12 rounded bg-gray-100" />
          <div className="h-3.5 w-7/12 rounded bg-gray-100" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="h-10 w-1/3 rounded-3xl bg-gray-100" />
      </div>

      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-3.5 w-9/12 rounded bg-gray-100" />
          <div className="h-3.5 w-6/12 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function AIChatbot() {
  const { uuid: routeUuid } = useParams();
  const navigate = useNavigate();

  const convUuid =
    routeUuid && UUID_RE.test(routeUuid) ? routeUuid : null;

  const [type, setType] = useState("education");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(Boolean(convUuid));
  const [thinking, setThinking] = useState(null);
  const [preview, setPreview] = useState(null);
  const [focusKey, setFocusKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    lsGet(
      "ai_sidebar_open",
      typeof window !== "undefined" && window.innerWidth >= 768
    )
  );
  const [pins, setPins] = useState(() => lsGet("ai_pins", []));
  const [showJump, setShowJump] = useState(false);
  const [topics, setTopics] = useState({
    education: "",
    health: "",
  });
  const [toast, setToast] = useState("");
  const [height, setHeight] = useState(null);

  const rootRef = useRef(null);
  const scrollRef = useRef(null);
  const lastUserMessageRef = useRef(null);

  const stickRef = useRef(true);
  const instantRef = useRef(false);
  const shouldFocusQuestionRef = useRef(false);

  const cacheRef = useRef(new Map());
  const skipLoadRef = useRef(null);
  const reqRef = useRef(0);
  const pendingRef = useRef(null); // vul bibhag theke notun bibhage jawar jonno opekkhaman prosno
  const activeRef = useRef(convUuid);

  activeRef.current = convUuid;

  const [send, { isLoading }] = useAiChatMutation();
  const [loadConv] = useLazyAiConversationQuery();
  const [deleteConv] = useAiDeleteConversationMutation();
  const [shareConv] = useShareConversationMutation();
  const [sendFeedback] = useAiFeedbackMutation();

  const { data: usage } = useAiUsageQuery();
  const { data: convData, isLoading: convLoading } =
    useAiConversationsQuery(type);

  const cfg = CONFIG[type];

  const conversations = useMemo(
    () =>
      (convData?.data?.data ?? []).map((conversation) => ({
        ...conversation,
        id: conversation.uuid,
      })),
    [convData]
  );

  const allowed = useMemo(
    () =>
      usage?.data?.types?.length
        ? usage.data.types
        : ["education", "health"],
    [usage]
  );

  const blocked = usage?.data && !usage.data.enabled;

  useEffect(() => {
    lsSet("ai_sidebar_open", sidebarOpen);
  }, [sidebarOpen]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }, []);

  // Keep the chatbot inside the available viewport.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousOverflow = [
      html.style.overflow,
      body.style.overflow,
    ];

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    window.scrollTo(0, 0);

    const measure = () => {
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;

      setHeight(Math.max(320, Math.round(viewportHeight - top)));
    };

    measure();

    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);

    return () => {
      html.style.overflow = previousOverflow[0];
      body.style.overflow = previousOverflow[1];

      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  // ---------- Scroll helpers ----------
  const toBottom = useCallback((smooth = false) => {
    const container = scrollRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const onScroll = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    const nearBottom =
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      120;

    stickRef.current = nearBottom;
    setShowJump(!nearBottom);
  }, []);

  const onTick = useCallback(() => {
    if (stickRef.current) {
      toBottom();
    }
  }, [toBottom]);

  // When a new question is submitted, position that question near the top
  // of the chat viewport. Otherwise, preserve the usual bottom-following
  // behavior when the user is already following the latest content.
  useLayoutEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    if (shouldFocusQuestionRef.current && thinking) {
      const messageElement = lastUserMessageRef.current;

      if (messageElement) {
        const containerRect = container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();

        const targetTop =
          container.scrollTop +
          messageRect.top -
          containerRect.top -
          16;

        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });

        shouldFocusQuestionRef.current = false;
        stickRef.current = false;
        setShowJump(true);

        instantRef.current = false;
        return;
      }
    }

    if (stickRef.current) {
      toBottom(!instantRef.current);
    }

    instantRef.current = false;
  }, [messages.length, thinking, toBottom]);

  // ---------- Invalid URL ----------
  useEffect(() => {
    if (routeUuid && !convUuid) {
      navigate("/pori-ai", { replace: true });
    }
  }, [routeUuid, convUuid, navigate]);

  // ---------- Load conversation ----------
  useEffect(() => {
    setThinking(null);
    shouldFocusQuestionRef.current = false;

    if (!convUuid) {
      skipLoadRef.current = null;
      reqRef.current++;

      setMessages([]);
      setLoading(false);

      return;
    }

    if (skipLoadRef.current === convUuid) {
      skipLoadRef.current = null;
      return;
    }

    const requestId = ++reqRef.current;
    const cached = cacheRef.current.get(convUuid);

    instantRef.current = true;
    stickRef.current = true;

    if (cached) {
      setType(cached.type);
      setMessages(cached.messages);
      setLoading(false);
    } else {
      setMessages([]);
      setLoading(true);
    }

    loadConv(convUuid, false)
      .unwrap()
      .then((response) => {
        if (requestId !== reqRef.current) return;

        const conversation = mapConv(response.data);

        cacheRef.current.set(convUuid, conversation);

        setType(conversation.type);
        setMessages(conversation.messages);
        setLoading(false);

        requestAnimationFrame(() => toBottom());
        setFocusKey((key) => key + 1);
      })
      .catch(() => {
        if (requestId !== reqRef.current) return;

        setLoading(false);
        navigate("/pori-ai", { replace: true });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convUuid]);

  // ---------- Send message ----------
  const run = async ({ text, files, previews }, retryOf, forceType) => {
    const assistantType = forceType || type;
    const startConv = forceType ? null : convUuid; // notun bibhage jele notun chat
    const idemKey = crypto.randomUUID();

    shouldFocusQuestionRef.current = true;

    if (!retryOf) {
      setMessages((previous) => [
        ...previous,
        {
          id: idemKey,
          role: "user",
          content: text,
          images: previews,
        },
      ]);
    } else {
      setMessages((previous) =>
        previous.filter((message) => !message.error)
      );
    }

    setThinking({
      hasImage: files.length > 0,
      type: assistantType,
    });

    const formData = new FormData();

    formData.append("assistant_type", assistantType);

    if (text) {
      formData.append("message", text);
    }

    if (startConv) {
      formData.append("conversation_uuid", startConv);
    }

    if (topics[assistantType]) {
      formData.append("topic_label", topics[assistantType]);
    }

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const response = await send({
        formData,
        idemKey,
      }).unwrap();

      // Vul bibhage prosno: API call/credit hoyni -- shothik bibhage jawar notice dekhao
      if (response.data?.redirect) {
        if (activeRef.current !== startConv) return;

        setMessages((previous) => [
          ...previous,
          {
            id: `redir-${idemKey}`,
            role: "assistant",
            redirect: response.data.redirect,
            question: { text, files, previews },
          },
        ]);
        return;
      }

      const newUuid = response.data.conversation_uuid;

      if (activeRef.current !== startConv) return;

      const assistantMessage = {
        id: response.data.message.id,
        role: "assistant",
        content: response.data.message.content,
        feedback: null,
        fresh: true,
      };

      setMessages((previous) => {
        const next = [...previous, assistantMessage];

        cacheRef.current.set(newUuid, {
          type: assistantType,
          messages: next
            .filter((message) => !message.redirect)
            .map((message) => ({
              ...message,
              fresh: false,
            })),
        });

        return next;
      });

      if (!startConv) {
        skipLoadRef.current = newUuid;
        navigate(`/pori-ai/${newUuid}`, { replace: true });
      }
    } catch (error) {
      if (activeRef.current !== startConv) return;

      setMessages((previous) => [
        ...previous,
        {
          id: `err-${idemKey}`,
          role: "assistant",
          error: true,
          content:
            error?.data?.message ||
            "উত্তর আনা যায়নি। আবার চেষ্টা করুন।",
          retryArgs: {
            text,
            files,
            previews,
          },
        },
      ]);
    } finally {
      if (activeRef.current === startConv) {
        setThinking(null);
      }
    }
  };

  // ---------- Vul bibhag theke shothik bibhage ----------
  const goTo = (message) => {
    const to = message.redirect.to;
    const question = message.question;

    setType(to);

    if (convUuid) {
      // age notun chat e jai (URL bodlay), tarpor prosno pathai -- nahole load effect messages muche dey
      pendingRef.current = { question, to };
      navigate("/pori-ai");
    } else {
      setMessages([]);
      run(question, false, to);
    }
  };

  useEffect(() => {
    if (!convUuid && pendingRef.current) {
      const { question, to } = pendingRef.current;
      pendingRef.current = null;
      run(question, false, to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convUuid]);

  // ---------- Feedback ----------
  const onFeedback = async (message, value) => {
    const applyFeedback = (list, feedback) =>
      list.map((item) =>
        item.id === message.id
          ? { ...item, feedback }
          : item
      );

    const previousFeedback = message.feedback || null;

    setMessages((previous) => applyFeedback(previous, value));

    const cachedConversation = cacheRef.current.get(convUuid);

    if (cachedConversation) {
      cacheRef.current.set(convUuid, {
        ...cachedConversation,
        messages: applyFeedback(
          cachedConversation.messages,
          value
        ),
      });
    }

    try {
      await sendFeedback({
        id: message.id,
        feedback: value,
      }).unwrap();
    } catch {
      setMessages((previous) =>
        applyFeedback(previous, previousFeedback)
      );

      if (cachedConversation) {
        cacheRef.current.set(convUuid, {
          ...cachedConversation,
          messages: applyFeedback(
            cachedConversation.messages,
            previousFeedback
          ),
        });
      }

      showToast("সেভ করা যায়নি");
    }
  };

  // ---------- Share ----------
  const onShare = async () => {
    if (!convUuid) return;

    if (
      type === "health" &&
      !window.confirm(
        "এটি স্বাস্থ্য-সংক্রান্ত চ্যাট। লিংকটি যার কাছে যাবে সে পুরো চ্যাট পড়তে পারবে। শেয়ার করবে?"
      )
    ) {
      return;
    }

    try {
      const response = await shareConv(convUuid).unwrap();

      const url = `${window.location.origin}/pori-ai/share/${response.data.token}`;

      if (navigator.share && window.innerWidth < 768) {
        try {
          await navigator.share({
            title: "Pori AI চ্যাট",
            url,
          });

          return;
        } catch {
          // User cancelled or share API failed; try clipboard.
        }
      }

      await navigator.clipboard.writeText(url);
      showToast("লিংক কপি হয়েছে");
    } catch {
      showToast("লিংক তৈরি করা যায়নি");
    }
  };

  // ---------- Sidebar ----------
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const newChat = () => {
    navigate("/pori-ai");
    setFocusKey((key) => key + 1);
    closeSidebarOnMobile();
  };

  const openConv = (conversation) => {
    if (conversation.id === convUuid) {
      closeSidebarOnMobile();
      return;
    }

    navigate(`/pori-ai/${conversation.id}`);
    closeSidebarOnMobile();
  };

  const removeConv = async (conversation) => {
    try {
      await deleteConv(conversation.id).unwrap();

      cacheRef.current.delete(conversation.id);

      setPins((previous) => {
        const next = previous.filter(
          (id) => id !== conversation.id
        );

        lsSet("ai_pins", next);

        return next;
      });

      if (conversation.id === convUuid) {
        navigate("/pori-ai", { replace: true });
      }
    } catch {
      // Ignore delete errors.
    }
  };

  const togglePin = (id) =>
    setPins((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [id, ...previous];

      lsSet("ai_pins", next);

      return next;
    });

  const changeType = (nextType) => {
    if (nextType !== type) {
      setType(nextType);

      if (convUuid) {
        navigate("/pori-ai");
      }
    }
  };

  const lastError =
    messages[messages.length - 1]?.error
      ? messages[messages.length - 1]
      : null;

  const empty =
    messages.length === 0 &&
    !thinking &&
    !loading;

  return (
    <div
      ref={rootRef}
      style={{ height: height ?? "100dvh" }}
      className="relative flex w-full overflow-hidden bg-white"
    >
      <AISidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        loading={convLoading}
        activeId={convUuid}
        pins={pins}
        onSelect={openConv}
        onNew={newChat}
        onPin={togglePin}
        onDelete={removeConv}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <PanelLeft size={20} />
            </button>

            <AssistantSwitcher
              value={type}
              onChange={changeType}
              allowed={allowed}
            />
          </div>

          <div className="flex items-center gap-2">
            {toast && (
              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white">
                {toast}
              </span>
            )}

            {convUuid && messages.length > 0 && (
              <button
                onClick={onShare}
                aria-label="চ্যাট শেয়ার করুন"
                title="চ্যাট শেয়ার করুন"
                className="grid h-9 w-9 place-items-center rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <Share2 size={18} />
              </button>
            )}

            {usage?.data?.enabled && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                Credits:{" "}
                <b className="text-gray-900">
                  {usage.data.credits}
                </b>
              </span>
            )}
          </div>
        </header>

        <main
          ref={scrollRef}
          onScroll={onScroll}
          className="ai-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-4">
            {blocked && (
              <div className="mb-4 rounded-2xl border bg-blue-50 p-4 text-sm text-blue-900">
                আপনার বর্তমান প্ল্যানে AI Assistant নেই.{" "}
                <Link
                  to="/subscriptions"
                  className="font-semibold underline"
                >
                  প্ল্যান দেখুন / রিনিউ করুন
                </Link>
              </div>
            )}

            {loading ? (
              <MessagesSkeleton />
            ) : empty ? (
              <div className="ai-fade-up my-auto flex w-full justify-center px-3 py-8 sm:py-12">
                <div className="w-full max-w-xl text-center">
                  <div
                    className={`mx-auto mb-5 flex h-[68px] w-[68px] items-center justify-center rounded-[24px] ${
                      type === "health"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {type === "health" ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-9 w-9"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                        <path d="M12 9v6M9 12h6" />
                      </svg>
                    ) : (
                      <Sparkles size={32} strokeWidth={1.7} />
                    )}
                  </div>

                  <p
                    className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      type === "health"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    PORI AI
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {cfg.title}
                  </h1>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
                    {cfg.sub}
                  </p>

                  <div
                    className={`mx-auto mt-6 inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm ${
                      type === "health"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {type === "health" ? (
                      <span aria-hidden="true">💚</span>
                    ) : (
                      <Sparkles size={15} />
                    )}

                    <span>
                      {type === "health"
                        ? "স্বাস্থ্য নিয়ে তোমার প্রশ্ন করতে পারো"
                        : "লিখে বা ছবি পাঠিয়ে যেকোনো প্রশ্ন করো"}
                    </span>
                  </div>

                  <p className="mx-auto mt-6 max-w-md px-3 text-[11px] leading-5 text-gray-400">
                    {cfg.disclaimer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => {
                  const isLastUserMessage =
                    message.role === "user" &&
                    messages
                      .slice(index + 1)
                      .every((item) => item.role !== "user");

                  return (
                    <div
                      key={message.id}
                      ref={
                        isLastUserMessage
                          ? lastUserMessageRef
                          : null
                      }
                    >
                      {message.redirect ? (
                        <AIRedirectNotice
                          msg={message}
                          allowed={allowed}
                          onGo={goTo}
                        />
                      ) : (
                        <AIMessage
                          msg={message}
                          onImage={setPreview}
                          onTick={onTick}
                          onFeedback={onFeedback}
                          onShare={onShare}
                          onRetry={
                            message === lastError
                              ? () => run(message.retryArgs, true)
                              : undefined
                          }
                        />
                      )}
                    </div>
                  );
                })}

                {thinking && (
                  <ThinkingSteps
                    hasImage={thinking.hasImage}
                    type={thinking.type}
                  />
                )}
              </div>
            )}
          </div>
        </main>

        {showJump && !empty && !loading && (
          <button
            onClick={() => toBottom(true)}
            aria-label="Scroll to bottom"
            className="absolute bottom-40 left-1/2 z-10 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border bg-white shadow-md hover:bg-gray-50"
          >
            <ArrowDown size={18} />
          </button>
        )}

        <AIChatInput
          onSend={run}
          sending={isLoading}
          disabled={blocked || loading}
          placeholder={cfg.placeholder}
          autoFocusKey={focusKey}
          options={cfg.options}
          topic={topics[type]}
          topicLabel={cfg.topicLabel}
          assistantType={type}
          onTopic={(value) =>
            setTopics((previous) => ({
              ...previous,
              [type]: value,
            }))
          }
        />
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-h-full max-w-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}