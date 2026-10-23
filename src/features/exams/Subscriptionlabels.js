import toBanglaNumeral from "@/utils/Tobangla.jsx";

// ⚠️ Admin form e duration er jei number dao seta koy mash? Dine hole "দিন" koro.
export const DURATION_UNIT = "মাস";

const MONTH_EN = { 1: "Monthly", 3: "Quarterly", 6: "Half-Yearly", 12: "Yearly" };
const LEGACY_EN = {
  "১ মাস": "Monthly",
  "৩ মাস": "Quarterly",
  "৬ মাস": "Half-Yearly",
  "১২ মাস": "Yearly",
};

// "১ মাস" - old plans keep their own text label, new plans are built from `duration`
export const durationLabel = (v) =>
  v?.duration_label || `${toBanglaNumeral(v?.duration)} ${DURATION_UNIT}`;

// small english hint under the label ("Monthly", "Quarterly" ...)
export const durationSubLabel = (v) => {
  if (v?.is_legacy) return LEGACY_EN[v.duration_label] || "";
  return DURATION_UNIT === "মাস" ? MONTH_EN[Number(v?.duration)] || "" : "";
};

// "১৫ নভেম্বর"
export const formatOfferEnd = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long" })
    : "";

// rows (flat, from the API) -> [{ key, head, variants, isLegacy }]
export const groupPlans = (rows) => {
  const map = new Map();
  rows.forEach((r) => {
    const key = r.plan_key || "legacy";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return [...map.entries()].map(([key, variants]) => ({
    key,
    head: variants[0],
    variants,
    isLegacy: !!variants[0].is_legacy,
  }));
};