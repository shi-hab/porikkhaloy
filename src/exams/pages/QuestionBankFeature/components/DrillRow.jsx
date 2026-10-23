import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import ChipRow from "./ChipRow";

const LEVELS = [
  { dim: "subject", label: "বিষয়" },
  { dim: "lesson", label: "অধ্যায়" },
  { dim: "topic", label: "টপিক" },
  { dim: "sub_topic", label: "সাব টপিক" },
];

/**
 * একটাই লাইনে বিষয় -> অধ্যায় -> টপিক -> সাব টপিক।
 * একটাতে ট্যাপ করলে ওই জায়গাতেই পরের লেভেল আসে, বাঁদিকে ছোট "‹ আগের নাম" ব্যাক চিপ থাকে।
 */
export default function DrillRow({ levels, sel, data, names, onSelect }) {
  const lv = LEVELS.filter((l) => levels.includes(l.dim));
  if (!lv.length) return null;

  // কোন লেভেলের চিপ এখন দেখাবো?
  let idx = lv.findIndex((l) => sel[l.dim] == null);
  if (idx === -1) idx = lv.length - 1; // সব সিলেক্টেড: শেষ লেভেলই দেখাও
  else if (!data?.[lv[idx].dim]?.length) idx -= 1; // নিচে কিছু নেই: আগের লেভেলে (সিলেক্টেডসহ) থাকো
  if (idx < 0) return null;

  const cur = lv[idx];
  const parent = idx > 0 ? lv[idx - 1] : null;
  const items = data?.[cur.dim];
  if (!items?.length) return null;

  const back =
    parent && sel[parent.dim] != null ? (
      <button
        type="button"
        onClick={() => onSelect(parent.dim, null)}
        className="flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-full border border-blue-900 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-blue-900 dark:border-gray-400 dark:text-white"
      >
        <ChevronLeft size={16} className="shrink-0" />
        <span>{names?.[parent.dim]?.name ?? "পিছনে"}</span>
      </button>
    ) : null;

  return (
    <motion.div
      key={cur.dim}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.14 }}
    >
      <ChipRow
        id={`drill-${cur.dim}`}
        label={cur.label}
        items={items}
        value={sel[cur.dim]}
        showAll={idx === 0}
        lead={back}
        onChange={(v) => onSelect(cur.dim, v === sel[cur.dim] ? null : v)}
      />
    </motion.div>
  );
}