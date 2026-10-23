import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { History, Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useGetQbExamTypesQuery, useGetQbFacetsQuery } from "@/features/questionBankFeature/questionBankApi";
import { DIM, getBrowseOrder, getBrowseTitle , yearLabel } from "@/features/questionBankFeature/qbConfig";
import useQbParams from "@/features/questionBankFeature/useQbParams";
import useDebounced from "@/features/questionBankFeature/useDebounced";
import useStudentProfile from "@/features/questionBankFeature/Usestudentprofile";
import Breadcrumbs from "./components/Breadcrumbs";
import BrowseList from "./components/BrowseList";
import ChipRow from "./components/ChipRow";
import ExamTypeGrid from "./components/ExamTypeGrid";
import QuestionFeed from "./components/QuestionFeed";
import { ListSkeleton } from "./components/QbSkeletons";
import DrillRow from "./components/DrillRow";


const LAST_KEY = "qb:last";

const readLast = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY));
  } catch {
    return null;
  }
};
const writeLast = (rec) => {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(rec));
  } catch {
    /* ignore */
  }
};

export default function QuestionBankPage() {
  const profile = useStudentProfile(); // redux: section / group / level
  const { sel, select, restore } = useQbParams();
  const { search } = useLocation();

  const [keywordInput, setKeywordInput] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const keyword = useDebounced(keywordInput, 400);
  const [last, setLast] = useState(readLast);
  const namesRef = useRef({});

  /* ---------- ১. Exam type ---------- */
  const { data: examTypes = [], isLoading: etLoading } = useGetQbExamTypesQuery(profile);
  const examType = examTypes.find((e) => e.id === sel.exam_type);
  const browse = getBrowseOrder(examType);

  /* ---------- ২. সিলেকশন থেকে API filter ---------- */
  const filters = useMemo(() => {
    const f = {};
    Object.keys(DIM).forEach((d) => {
      if (sel[d] != null) f[DIM[d].param] = sel[d];
    });
    return f;
  }, [sel]);

  const unselected = browse.filter((d) => sel[d] == null);

  /* ---------- ৩. Browse ধাপ: যে ধাপে কিছু নেই সেটা নিজে skip হয় ---------- */
  const { currentData: browseData } = useGetQbFacetsQuery(
    { ...profile, ...filters, dimensions: unselected.join(",") },
    { skip: !sel.exam_type || unselected.length === 0 }
  );

  let stage = "home";
  let browseDim = null;
  if (sel.exam_type) {
    if (unselected.length === 0) stage = "questions";
    else if (!browseData) stage = "loading";
    else {
      browseDim = unselected.find((d) => browseData[d]?.length) ?? null;
      stage = browseDim ? "browse" : "questions";
    }
  }

  /* ---------- ৪. প্রশ্নের পেজের চিপ গুলো ---------- */
  const pageDims = useMemo(() => {
    const d = ["type"];
    if (!browse.includes("subject")) d.push("subject");
    if (sel.subject) d.push("lesson");
    if (sel.lesson) d.push("topic");
    if (sel.topic) d.push("sub_topic");
    return d;
  }, [browse, sel.subject, sel.lesson, sel.topic]);

  const { data: pageData } = useGetQbFacetsQuery(
    { ...profile, ...filters, dimensions: pageDims.join(",") },
    { skip: stage !== "questions" }
  );

  /* ---------- ৫. Breadcrumb ---------- */
  // সালের লেখা: "DU-A Unit (25-26)"
  const browseItems = useMemo(() => {
    const list = browseData?.[browseDim] ?? [];
    if (browseDim !== "year") return list;
    return list.map((it) => ({ ...it, name: yearLabel(browseData?._selected, it.name) }));
  }, [browseData, browseDim]);

  const fresh = (stage === "questions" ? pageData?._selected : browseData?._selected) || null;
  if (fresh) namesRef.current = fresh;
  const names = namesRef.current;

  const crumbs = [{ label: "প্রশ্নব্যাংক", onClick: () => select("exam_type", null) }];
  if (examType) {
    crumbs.push({ label: examType.name, onClick: () => select(browse[0], null, { browse }) });
    browse.forEach((d) => {
      if (sel[d] != null)
        crumbs.push({ label: names[d]?.name ?? "…", onClick: () => select(d, null, { browse }) });
    });
  }

  // শেষ দেখা জায়গা: প্রতিটি ধাপ বদলালেই সাথে সাথে সেভ হয় (সবচেয়ে গভীর জায়গা পর্যন্ত)
  useEffect(() => {
    if (stage !== "browse" && stage !== "questions") return;
    if (crumbs.some((c) => c.label === "…")) return;
    writeLast({ search, label: crumbs.slice(1).map((c) => c.label).join(" › "), dismissed: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, search, names, examType?.name]);

  // হোমে ফিরলে সবসময় সর্বশেষ সেভ করা জায়গা পড়ো
  useEffect(() => {
    if (stage === "home") setLast(readLast());
  }, [stage]);

  const dismissLast = (e) => {
    e.stopPropagation();
    const rec = { ...last, dismissed: true }; // জায়গা মনে থাকে, কার্ড আর আসে না (নতুন জায়গায় গেলে আবার আসবে)
    writeLast(rec);
    setLast(rec);
  };

  const feedArgs = useMemo(() => ({ ...profile, ...filters, keyword }), [profile, filters, keyword]);
  const setChip = (dim, v) => select(dim, v, { browse, replace: true });
  const setType = (v) => setChip("type", v);
  // drill লাইনে কোন কোন লেভেল থাকবে (subject browse ধাপে থাকলে এখানে আসে না)
  const drillLevels = browse.includes("subject")
    ? ["lesson", "topic", "sub_topic"]
    : ["subject", "lesson", "topic", "sub_topic"];

  return (
    <div className="mx-auto w-full  px-3 pb-24 pt-3">
      {stage !== "home" && <Breadcrumbs crumbs={crumbs} />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${stage}-${browseDim}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="mt-3"
        >
           {stage === "home" && (
            <>
              <ExamTypeGrid
                items={examTypes}
                loading={etLoading}
                onPick={(id) => select("exam_type", id)}
              />
            </>
          )}

          {stage === "loading" && <ListSkeleton />}

          {stage === "browse" && (
            <BrowseList
              title={getBrowseTitle(browseDim, examType)}
              items={browseItems}
              onPick={(id) => select(browseDim, id, { browse })}
            />
          )}

          {stage === "questions" && (
            <>
              {/* চিপ বার: কম জায়গায় — উপরে সার্চ + ধরন, নিচে একটাই drill লাইন */}
              <div className="sticky top-0 z-20 rounded-xl  mb-3 border-b border-slate-200 bg-white/90 px-3 pb-1.5 pt-2 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
                <DrillRow
                  levels={drillLevels}
                  sel={sel}
                  data={pageData}
                  names={names}
                  onSelect={setChip}
                />
              </div>

              <QuestionFeed key={JSON.stringify(feedArgs)} args={feedArgs} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}