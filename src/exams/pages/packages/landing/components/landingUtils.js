// landingUtils.js
// Small, dependency-free helpers that turn the raw package API response
// into the pieces each landing-page section needs to render.

import { useEffect } from "react";

/** Injects the two Bengali-friendly Google Fonts used across the landing page. */
export function useLandingFonts() {
  useEffect(() => {
    if (document.getElementById("landing-fonts")) return;
    const link = document.createElement("link");
    link.id = "landing-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital@0;1&family=Hind+Siliguri:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/** Price after discount, plus display-ready numbers. */
export function getDiscountedPrice(pkg) {
  const price = Number(pkg?.price) || 0;
  const discount = Number(pkg?.discount) || 0;

  if (!discount) {
    return { original: price, final: price, hasDiscount: false, percentOff: 0 };
  }

  const final =
    pkg.discount_type === "percentage" ? price - price * (discount / 100) : price - discount;

  const percentOff =
    pkg.discount_type === "percentage" ? discount : Math.round((discount / price) * 100);

  return { original: price, final: Math.max(final, 0), hasDiscount: true, percentOff };
}

export function formatTaka(amount) {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

export function formatDuration(days) {
  const n = Number(days);
  if (!n) return "";
  if (n % 365 === 0) return `${n / 365} বছর`;
  if (n % 30 === 0) return `${n / 30} মাস`;
  return `${n} দিন`;
}


export function parseDetailsContent(raw) {
  if (!raw) return [];

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => line.replace(/^\*+\s*/, "").trim())
    .map((line) => {
      const match = line.match(/^'([^']+)'\s*(.*)$/);

      if (!match) return null;

      return {
        value: match[1].trim(),
        label: match[2].trim(),
      };
    })
    .filter(Boolean);
}

// full descriptions
export function parseStructuredDetails(raw) {
  if (!raw) {
    return {
      title: "",
      subtitle: "",
      intro: "",
      features: [],
      cta: "",
    };
  }

  const result = {
    title: "",
    subtitle: "",
    intro: "",
    features: [],
    cta: "",
  };

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let currentType = null;

  lines.forEach((line) => {
    if (line.startsWith("#")) {
      currentType = line
        .replace(/^#+\s*/, "")
        .trim()
        .toLowerCase();

      return;
    }

    const content = line.replace(/^\*\s*/, "").trim();

    switch (currentType) {
      case "title":
        result.title += `${content} `;
        break;

      case "subtitle":
        result.subtitle += `${content} `;
        break;

      case "intro":
        result.intro += `${content} `;
        break;

      case "feature":
        if (content) {
          result.features.push(content);
        }
        break;

      case "cta":
        result.cta += `${content} `;
        break;
    }
  });

  return {
    title: result.title.trim(),
    subtitle: result.subtitle.trim(),
    intro: result.intro.trim(),
    features: result.features,
    cta: result.cta.trim(),
  };
}

/**
 * `description` comes as free-form text with "● **[<u>label</u>](url)**"
 * resource links and a "> " note block. This pulls out:
 * - intro: the opening sentence
 * - resources: [{ label, url }]
 * - note: the special-notice block, markdown stripped
 */
export function parseDescriptionContent(raw) {
  if (!raw) return { intro: "", resources: [], note: "" };

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const linkPattern = /\[<u>(.*?)<\/u>\]\((https?:\/\/[^\s)]+)\)/;
  let intro = "";
  const resources = [];
  const noteLines = [];

  lines.forEach((line) => {
    const linkMatch = line.match(linkPattern);
    if (linkMatch) {
      resources.push({ label: linkMatch[1], url: linkMatch[2] });
    } else if (line.startsWith(">")) {
      noteLines.push(line.replace(/^>+\s*/, "").replace(/\*\*/g, ""));
    } else if (!intro && !line.startsWith("●") && !line.startsWith("*")) {
      intro = line.replace(/\*\*/g, "");
    }
  });

  return { intro, resources, note: noteLines.join(" ") };
}

/* ----------------------------------------------------------------------
 * Exam-list helpers (LandingExamListSection)
 * The exact field names inside `mtUnderPkg.data` items weren't shown in
 * the brief, so every item is normalized through EXAM_KEY_MAP below.
 * If the real API uses different keys, this map is the only place you
 * need to edit — nothing else in the component needs to change.
 * ------------------------------------------------------------------- */
const EXAM_KEY_MAP = {
  id: ["id", "exam_id", "model_test_id"],
  title: ["name", "title", "exam_name"],
  startAt: ["start_time", "start_at", "exam_date", "scheduled_at", "date"],
  durationMinutes: ["duration", "duration_minutes", "exam_time", "time_limit"],
  questionCount: ["total_question", "question_count", "no_of_question", "mark"],
  enrolled: ["enrolled_count", "student_count", "total_enrolled", "participant_count"],
  attachUrl: ["attach_url", "attachment_url", "attachment", "file_url"],
  segment: ["segment_name", "category_name", "segment", "category", "section_name"],
};

function pick(obj, keys) {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "") return obj[k];
  }
  return null;
}

/**
 * Whether an exam is free. Two different shapes show up in the API:
 * - `is_free`: a boolean-ish flag where truthy = free
 * - `exam_type`: a numeric flag where 0 = free (NOT boolean-ish!)
 * These can't be merged into one `pick()` lookup because 0 is falsy in JS
 * but means "free" here, so each is resolved explicitly.
 */
function resolveIsFree(raw) {
  const explicitFlag = pick(raw, ["is_free"]);
  if (explicitFlag !== null) return Boolean(Number(explicitFlag));

  const examType = pick(raw, ["exam_type"]);
  if (examType !== null) return Number(examType) === 0;

  return false;
}

/** Turns one raw model-test item into the shape every exam-list piece expects. */
export function normalizeExam(raw) {
  const durationMinutes = Number(pick(raw, EXAM_KEY_MAP.durationMinutes)) || 0;
  const explicitQuestions = Number(pick(raw, EXAM_KEY_MAP.questionCount)) || 0;

  return {
    id: pick(raw, EXAM_KEY_MAP.id) ?? Math.random(),
    title: pick(raw, EXAM_KEY_MAP.title) || "পরীক্ষা",
    startAt: pick(raw, EXAM_KEY_MAP.startAt),
    durationMinutes,
    isFree: resolveIsFree(raw),
    // 2 questions per minute of exam time, unless the API already says otherwise
    questionCount: explicitQuestions || durationMinutes * 2,
    enrolled: Number(pick(raw, EXAM_KEY_MAP.enrolled)) || 0,
    attachUrl: pick(raw, EXAM_KEY_MAP.attachUrl),
    segment: pick(raw, EXAM_KEY_MAP.segment) || "সাধারণ পরীক্ষা",
  };
}

/** "1h 30m" / "1h" / "25m" — matches how exam length is usually talked about. */
export function formatExamDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/** Bengali date + time, e.g. "১২ অক্টোবর, শুক্র · রাত ৮:০০". Falls back to raw text on bad input. */
export function formatExamDateTime(value) {
  if (!value) return "Date will be announced";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${day} ${month} · ${hours}:${minutes} ${period}`;
}

/** "upcoming" | "live" | "ended", based on the exam's start time and duration. */
export function getExamStatus(exam) {
  if (!exam.startAt) return "upcoming";
  const start = new Date(exam.startAt).getTime();
  if (Number.isNaN(start)) return "upcoming";
  const end = start + exam.durationMinutes * 60 * 1000;
  const now = Date.now();
  if (now < start) return "upcoming";
  if (now <= end) return "live";
  return "ended";
}