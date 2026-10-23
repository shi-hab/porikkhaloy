// Bangla formatting helpers used across the landing page.
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const BN_MONTHS = [
  "জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে",
];

export const bn = (v) => String(v ?? "").replace(/\d/g, (d) => BN_DIGITS[d]);

/** minutes -> "১ ঘণ্টা ৩০ মি." */
export function formatBnDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${bn(h)} ঘণ্টা ${bn(m)} মি.`;
  if (h) return `${bn(h)} ঘণ্টা`;
  return `${bn(m)} মিনিট`;
}

/** ISO/date string -> { day: "১২", month: "অক্টো", time: "রাত ৮:০০" } or null */
export function getExamDateParts(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const h = d.getHours();
  const period =
    h >= 4 && h < 12 ? "সকাল" : h < 16 ? "দুপুর" : h < 18 ? "বিকাল" : h < 20 ? "সন্ধ্যা" : "রাত";

  return {
    day: bn(d.getDate()),
    month: BN_MONTHS[d.getMonth()],
    time: `${period} ${bn(h % 12 || 12)}:${bn(String(d.getMinutes()).padStart(2, "0"))}`,
  };
}