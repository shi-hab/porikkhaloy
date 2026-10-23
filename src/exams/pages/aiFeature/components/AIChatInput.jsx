import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Camera,
  Check,
  ChevronDown,
  ImagePlus,
  Loader2,
  Plus,
  X,
  Mic,
  MicOff,
} from "lucide-react";

const MAX_CHARS = 4000;
const MAX_IMAGES = 3;
const MAX_INPUT_HEIGHT = 200;
const MULTILINE_THRESHOLD = 40; // 1 line = ~36px, 2 lines = ~58px

async function compress(file, max = 1600, quality = 0.82) {
  try {
    const bmp = await createImageBitmap(file);

    try {
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) return file;

      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (result) =>
            result
              ? resolve(result)
              : reject(new Error("Image compression failed")),
          "image/jpeg",
          quality
        );
      });

      return new File([blob], `photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
    } finally {
      bmp.close?.();
    }
  } catch {
    return file;
  }
}

export default function AIChatInput({
  onSend,
  sending = false,
  disabled = false,
  placeholder = "প্রশ্ন করো...",
  autoFocusKey,
  options = [],
  topic = "",
  onTopic,
  topicLabel = "বিষয়",
  assistantType = "education",
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [menu, setMenu] = useState(false);
  const [drag, setDrag] = useState(false);
  const [topicMenu, setTopicMenu] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const taRef = useRef(null);
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const boxRef = useRef(null);
  const recognitionRef = useRef(null);
  const textRef = useRef("");
  const voiceBaseRef = useRef("");
  const filesRef = useRef([]);
  const mountedRef = useRef(false);

  const isHealth = assistantType === "health";

  const theme = isHealth
    ? {
        focus:
          "focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10",
        send: "bg-emerald-600 hover:bg-emerald-700",
        active: "bg-emerald-50 text-emerald-700",
        selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
        drag: "border-emerald-400 bg-emerald-50",
      }
    : {
        focus:
          "focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10",
        send: "bg-blue-600 hover:bg-blue-700",
        active: "bg-blue-50 text-blue-700",
        selected: "border-blue-200 bg-blue-50 text-blue-700",
        drag: "border-blue-400 bg-blue-50",
      };

  useEffect(() => {
    mountedRef.current = true;

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    setVoiceSupported(Boolean(SpeechRecognition));

    return () => {
      mountedRef.current = false;
      recognitionRef.current?.abort();
      recognitionRef.current = null;

      filesRef.current.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, []);

  const resizeTextarea = (el) => {
    if (!el) return 0;

    el.style.height = "auto";

    const height = el.scrollHeight;
    el.style.height = `${Math.min(height, MAX_INPUT_HEIGHT)}px`;
    el.style.overflowY = height > MAX_INPUT_HEIGHT ? "auto" : "hidden";

    return height;
  };

  // text change: resize + multiline mode on/off
  useEffect(() => {
    textRef.current = text;

    const el = taRef.current;
    if (!el) return;

    const height = resizeTextarea(el);

    if (!multiline && height > MULTILINE_THRESHOLD) {
      setMultiline(true);
    } else if (multiline && text === "") {
      setMultiline(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // layout badlale (textarea er width change hoy) abar resize
  useEffect(() => {
    resizeTextarea(taRef.current);
  }, [multiline]);

  useEffect(() => {
    taRef.current?.focus();
  }, [autoFocusKey]);

  useEffect(() => {
    if (!menu && !topicMenu) return;

    const close = (event) => {
      if (!boxRef.current?.contains(event.target)) {
        setMenu(false);
        setTopicMenu(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [menu, topicMenu]);

  const addFiles = async (list) => {
    const available = MAX_IMAGES - filesRef.current.length;
    if (available <= 0) return;

    const picked = Array.from(list || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, available);

    const output = [];

    for (const file of picked) {
      try {
        const small = await compress(file);

        output.push({
          file: small,
          url: URL.createObjectURL(small),
        });
      } catch {
        // Skip unreadable images.
      }
    }

    if (!mountedRef.current || !output.length) {
      output.forEach((file) => URL.revokeObjectURL(file.url));
      return;
    }

    setFiles((previous) => {
      const remaining = Math.max(0, MAX_IMAGES - previous.length);
      const accepted = output.slice(0, remaining);
      const merged = [...previous, ...accepted];

      filesRef.current = merged;

      output
        .filter((file) => !accepted.includes(file))
        .forEach((file) => URL.revokeObjectURL(file.url));

      return merged;
    });
  };

  const removeFile = (index) => {
    setFiles((previous) => {
      const removed = previous[index];

      if (removed) URL.revokeObjectURL(removed.url);

      const next = previous.filter((_, i) => i !== index);
      filesRef.current = next;

      return next;
    });
  };

  const stopVoice = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already have stopped.
    }

    setListening(false);
  };

  const startVoice = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition || disabled || sending) return;

    if (listening) {
      stopVoice();
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = "bn-BD";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      voiceBaseRef.current = textRef.current.trim();
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        if (mountedRef.current) setListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";

        for (let i = 0; i < event.results.length; i++) {
          transcript += `${event.results[i][0].transcript} `;
        }

        const next = [voiceBaseRef.current, transcript.trim()]
          .filter(Boolean)
          .join(" ");

        if (mountedRef.current) {
          setText(next.slice(0, MAX_CHARS));
        }
      };

      recognition.onerror = () => {
        if (mountedRef.current) setListening(false);
      };

      recognition.onend = () => {
        if (mountedRef.current) setListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch {
      setListening(false);
    }
  };

  const canSend =
    !sending && !disabled && Boolean(text.trim() || files.length);

  const submit = () => {
    if (!canSend) return;

    stopVoice();

    onSend({
      text: text.trim(),
      files: files.map((file) => file.file),
      previews: files.map((file) => file.url),
    });

    setText("");
    textRef.current = "";

    setFiles([]);
    filesRef.current = [];

    setMenu(false);
    setTopicMenu(false);
    setMultiline(false);

    if (taRef.current) {
      taRef.current.style.height = "36px";
      taRef.current.style.overflowY = "hidden";
    }
  };

  const onPaste = (event) => {
    const images = Array.from(event.clipboardData?.files || []).filter(
      (file) => file.type.startsWith("image/")
    );

    if (images.length) {
      event.preventDefault();
      addFiles(images);
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDrag(false);
    addFiles(event.dataTransfer?.files);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  const full = files.length >= MAX_IMAGES;

  const renderFilePreviews = () =>
    files.length > 0 && (
      <div className="mb-3 flex gap-2 overflow-x-auto px-1 pt-1">
        {files.map((file, index) => (
          <div key={file.url} className="relative shrink-0">
            <img
              src={file.url}
              alt={`Selected image ${index + 1}`}
              className="h-16 w-16 rounded-xl border border-gray-200 object-cover"
            />

            <button
              type="button"
              aria-label="ছবি বাদ দাও"
              onClick={() => removeFile(index)}
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    );

  const renderAttachmentMenu = () =>
    menu && (
      <div className="ai-fade-up absolute bottom-full left-0 z-30 mb-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
        <button
          type="button"
          disabled={full || disabled}
          onClick={() => {
            cameraRef.current?.click();
            setMenu(false);
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        >
          <Camera size={18} />
          ক্যামেরা
        </button>

        <button
          type="button"
          disabled={full || disabled}
          onClick={() => {
            galleryRef.current?.click();
            setMenu(false);
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
        >
          <ImagePlus size={18} />
          ছবি আপলোড
        </button>
      </div>
    );

  // Same subject e abar click korle deselect (alada button nai)
  const renderTopicSelector = () =>
    options.length > 0 && (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setTopicMenu((previous) => !previous);
            setMenu(false);
          }}
          disabled={disabled}
          className={`flex max-w-[105px] items-center gap-1 rounded-full border px-2 py-1.5 text-xs font-medium transition sm:max-w-[160px] ${
            topic
              ? theme.selected
              : "border-transparent text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span className="truncate">{topic || topicLabel}</span>

          <ChevronDown
            size={14}
            className={`shrink-0 transition ${topicMenu ? "rotate-180" : ""}`}
          />
        </button>

        {topicMenu && (
          <div className="ai-fade-up ai-scroll absolute bottom-full right-0 z-30 mb-2 max-h-64 w-56 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
            {options.map((option) => {
              const selected = option === topic;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    onTopic?.(selected ? "" : option);
                    setTopicMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                    selected ? `font-medium ${theme.active}` : "text-gray-700"
                  }`}
                >
                  {option}
                  {selected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );

  const renderVoiceButton = () => (
    <button
      type="button"
      aria-label={listening ? "কথা বলা বন্ধ করুন" : "কথা বলে লিখুন"}
      title={
        !voiceSupported
          ? "এই ব্রাউজারে voice typing সমর্থিত নয়"
          : listening
            ? "কথা বলা বন্ধ করুন"
            : "কথা বলে লিখুন"
      }
      onClick={startVoice}
      disabled={disabled || sending || !voiceSupported}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-30 ${
        listening
          ? "animate-pulse bg-red-50 text-red-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {listening ? <MicOff size={19} /> : <Mic size={19} />}
    </button>
  );

  const renderSendButton = () => (
    <button
      type="button"
      aria-label="Send"
      onClick={submit}
      disabled={!canSend}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition disabled:bg-gray-200 disabled:text-gray-400 ${theme.send}`}
    >
      {sending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <ArrowUp size={20} />
      )}
    </button>
  );

  return (
    <div className="shrink-0 bg-gradient-to-t from-white via-white to-white/0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div ref={boxRef} className="relative mx-auto w-full max-w-3xl">
        {renderAttachmentMenu()}

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDrag(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setDrag(false);
            }
          }}
          onDrop={onDrop}
          className={`border border-gray-200 bg-white px-2.5 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all ${
            multiline ? "rounded-3xl" : "rounded-[28px]"
          } ${theme.focus} ${drag ? theme.drag : ""}`}
        >
          {renderFilePreviews()}

          <div
            className="grid items-end gap-x-1"
            style={{
              gridTemplateColumns: "auto minmax(0, 1fr) auto",
              gridTemplateAreas: multiline
                ? '"text text text" "plus . right"'
                : '"plus text right"',
              rowGap: multiline ? "4px" : 0,
            }}
          >
            {/* Plus */}
            <button
              type="button"
              aria-label="ছবি বা ফাইল যোগ করুন"
              title="ছবি যোগ করুন"
              style={{ gridArea: "plus" }}
              onClick={() => {
                setMenu((previous) => !previous);
                setTopicMenu(false);
              }}
              disabled={disabled || full}
              className={`mb-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:opacity-40 ${
                menu ? "rotate-45 bg-gray-100" : ""
              }`}
            >
              <Plus size={23} />
            </button>

            {/* Textarea */}
            <div
              style={{ gridArea: "text" }}
              className="flex min-h-9 min-w-0 items-end"
            >
              <textarea
                ref={taRef}
                value={text}
                rows={1}
                maxLength={MAX_CHARS}
                disabled={disabled}
                onChange={(event) => setText(event.target.value)}
                onPaste={onPaste}
                onKeyDown={handleKeyDown}
                placeholder={drag ? "ছবি এখানে ছেড়ে দিন…" : placeholder}
                className={`block max-h-[200px] min-h-[36px] w-full min-w-0 flex-1 resize-none self-center overflow-y-hidden bg-transparent py-[7px] text-base leading-[22px] text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-50 ${
                  multiline ? "px-2.5" : "px-1"
                }`}
              />
            </div>

            {/* Right controls */}
            <div
              style={{ gridArea: "right" }}
              className="mb-0.5 flex shrink-0 items-center gap-0.5"
            >
              {renderTopicSelector()}
              {renderVoiceButton()}
              {renderSendButton()}
            </div>
          </div>

          {listening && (
            <div className="mt-1 flex items-center gap-1.5 px-2 text-xs text-red-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              শুনছি…
            </div>
          )}
        </div>

        <p className="mt-1.5 px-2 text-center text-[10px] leading-relaxed text-gray-400">
          {isHealth
            ? "সাধারণ স্বাস্থ্যতথ্য • চিকিৎসকের বিকল্প নয়"
            : null}
        </p>
      </div>

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}