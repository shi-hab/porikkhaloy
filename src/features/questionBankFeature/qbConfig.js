import { BookOpen, GraduationCap, Stethoscope, Cog, FileText, Layers } from "lucide-react";

// প্রতিটি category: API param নাম + URL এ ছোট key
export const DIM = {
  exam_type: { param: "exam_type_id", url: "et" },
  exam_sub_type: { param: "exam_sub_type_id", url: "st" },
  exam_paper: { param: "exam_paper_id", url: "ep" },
  subject: { param: "subject_id", url: "sj" },
  year: { param: "year_id", url: "yr" },
  type: { param: "type", url: "ty" },
  lesson: { param: "lesson_id", url: "ls" },
  topic: { param: "topic_id", url: "tp" },
  sub_topic: { param: "sub_topic_id", url: "sb" },
};
export const ALL_DIMS = Object.keys(DIM);

// প্রশ্নের পেজের উপরের চিপ গুলো
export const PAGE_FILTERS = ["type", "subject", "lesson", "topic", "sub_topic"];

const CLEARS = {
  subject: ["lesson", "topic", "sub_topic"],
  lesson: ["topic", "sub_topic"],
  topic: ["sub_topic"],
};

/**
 * Browse ধাপের ক্রম। এটাই পুরো সিস্টেমের "কনফিগ"।
 * - ডিফল্ট: sub type -> paper -> year (যে ধাপে কিছু নেই, সেটা নিজে নিজে skip হয়)
 * - অনুশীলনী: আগে subject, তারপর exam_sub_type (এখানে exam_sub_type = লেখকের নাম)
 * ভবিষ্যতে exam type এর API থেকে `browse_order` এলে সেটাই অগ্রাধিকার পাবে।
 */
export const DEFAULT_BROWSE = ["exam_sub_type", "exam_paper", "year"];
const BROWSE_BY_NAME = {
  "অনুশীলনী": ["subject", "exam_sub_type"],
};

export const getBrowseOrder = (examType) =>
  examType?.browse_order ?? BROWSE_BY_NAME[examType?.name?.trim()] ?? DEFAULT_BROWSE;


export const getBrowseTitle = (dim, examType) =>
  examType?.name?.trim() === "অনুশীলনী" && dim === "exam_sub_type"
    ? "লেখক বেছে নাও" : null;

// কোন ডাইমেনশন সিলেক্ট করলে কোনগুলো মুছে যাবে
export const clearList = (dim, browse) => {
  if (dim === "exam_type") return ALL_DIMS.filter((d) => d !== "exam_type");
  const i = browse.indexOf(dim);
  if (i >= 0) return [...browse.slice(i + 1), ...PAGE_FILTERS].filter((d) => d !== dim);
  return CLEARS[dim] ?? [];
};

export const examIcon = (name = "") => {
  if (name.includes("অনুশীলনী")) return BookOpen;
  if (name.includes("ভার্সিটি")) return GraduationCap;
  if (name.includes("মেডিকেল")) return Stethoscope;
  if (name.includes("ইঞ্জিনিয়ারিং")) return Cog;
  if (name.includes("টেস্ট")) return FileText;
  return Layers;
};

export const FREE_QUESTION_LIMIT = 20;

// exam type কার্ডের নিচের লাইন: sub type গুলোকে কী বলে ডাকা হবে (ইচ্ছামতো বদলান)
const SUB_TYPE_NOUN = {
  "ভার্সিটি": "ভার্সিটি",
  "মেডিকেল": "পরীক্ষা",
  "ইঞ্জিনিয়ারিং": "ইউনিভার্সিটি",
  "টেস্ট পেপার": "সেগমেন্ট",
};

/**
 * কার্ডে কী দেখাবে:
 * - অনুশীলনীর মতো (আগে subject আসে) অথবা sub type না থাকলে -> সরাসরি প্রশ্নের সংখ্যা
 * - ভার্সিটি/টেস্ট পেপার ইত্যাদি -> "৫ টি ভার্সিটি"
 */
export const getCardMeta = (item) => {
  const browse = getBrowseOrder(item);
  if (browse[0] === "subject" || !item.sub_types) return { n: item.count, unit: "প্রশ্ন" };
  return { n: item.sub_types, unit: SUB_TYPE_NOUN[item.name?.trim()] ?? "ক্যাটাগরি" };
};

// সালের তালিকার লেখা: "DU-A Unit (25-26)" = exam sub type - exam paper (সাল)
export const yearLabel = (names = {}, year) => {
  const left = [names.exam_sub_type?.name, names.exam_paper?.name].filter(Boolean).join("-");
  return left ? `${left} (${year})` : year;
};