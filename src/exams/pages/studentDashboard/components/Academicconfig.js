import { BookOpen, Cog, Landmark, School, Stethoscope } from "lucide-react";

/* Shared between RegisterForm and StudentEditProfile — single source of truth */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^01[3-9]\d{8}$/;
export const normalizePhone = (p = "") => p.replace(/[\s-]/g, "").replace(/^(\+?88)/, "");

export const label = (x) => x?.title ?? x?.name ?? "";

// group.section_id / level.group_id are JSON arrays on the backend
export const toIds = (v) => {
  if (v == null || v === "") return [];
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      return JSON.parse(v).map(String);
    } catch {
      return [];
    }
  }
  return [String(v)];
};

export const isActive = (x) => x?.status == null || x.status == true;

export const sectionKind = (s) => {
  const t = label(s).toLowerCase();
  if (t.includes("hsc")) return "hsc";
  if (t.includes("ssc")) return "ssc";
  return "other";
};

export const TARGETS = {
  hsc: [
    { v: "medical", l: "মেডিকেল", d: "MBBS / BDS ভর্তি পরীক্ষা", icon: Stethoscope },
    { v: "engineering", l: "ইঞ্জিনিয়ারিং", d: "BUET, CUET, RUET, KUET", icon: Cog },
    { v: "varsity", l: "বিশ্ববিদ্যালয়", d: "DU, JU, RU ও অন্যান্য", icon: Landmark },
    { v: "academic", l: "একাডেমিক", d: "HSC পরীক্ষার প্রস্তুতি", icon: BookOpen },
  ],
  ssc: [
    { v: "academic", l: "একাডেমিক", d: "SSC পরীক্ষার প্রস্তুতি", icon: BookOpen },
    { v: "college_admission", l: "কলেজ ভর্তি", d: "নামকরা কলেজে ভর্তির প্রস্তুতি", icon: School },
  ],
  other: [{ v: "academic", l: "একাডেমিক", d: "পরীক্ষার প্রস্তুতি", icon: BookOpen }],
};

export const TARGET_LABEL = {
  medical: "মেডিকেল",
  engineering: "ইঞ্জিনিয়ারিং",
  varsity: "বিশ্ববিদ্যালয়",
  academic: "একাডেমিক",
  college_admission: "কলেজ ভর্তি",
};

export const GENDERS = [
  { v: "male", l: "ছেলে" },
  { v: "female", l: "মেয়ে" },
  { v: "other", l: "অন্যান্য" },
];
export const GENDER_LABEL = Object.fromEntries(GENDERS.map((g) => [g.v, g.l]));

export const makeBatches = (kind, current = "") => {
  const yy = new Date().getFullYear() % 100;
  const prefix = kind === "ssc" ? "SSC" : "HSC";
  const list = [yy - 1, yy, yy + 1, yy + 2].map((n) => `${prefix}-${n}`);
  // keep an already-saved value visible even if it's outside the current window
  if (current && !list.includes(current)) list.unshift(current);
  return list;
};

/* ---- group-aware target logic ---- */

// Bangla/English dui-ei group name e kaj korbe
export const groupKind = (g) => {
  const t = label(g).toLowerCase();
  if (/science|বিজ্ঞান/.test(t)) return "science";
  if (/commerce|business|ব্যবসায়|বাণিজ্য/.test(t)) return "commerce";
  if (/arts|humanities|মানবিক|কলা/.test(t)) return "arts";
  return "other";
};

// HSC te Arts/Commerce hole medical & engineering bad
export const getTargetOptions = (kind, gKind) => {
  const all = TARGETS[kind] ?? TARGETS.other;
  if (kind === "hsc" && (gKind === "arts" || gKind === "commerce")) {
    return all.filter((t) => ["varsity", "academic"].includes(t.v));
  }
  return all;
};

/* ---- profile completeness ---- */

// Academic info jara ekhono dey ni tader chinhito kore
export const getMissingAcademic = (p) => {
  const missing = [];
  if (!p?.section_id) missing.push("সেকশন");
  if (!p?.group_id) missing.push("গ্রুপ");
  if (!p?.profile?.target) missing.push("লক্ষ্য");
  return missing;
};