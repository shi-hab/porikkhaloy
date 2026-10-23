import { useEffect, useState } from "react";

const BN = "০১২৩৪৫৬৭৮৯";
export const toBn = (n) => String(n ?? 0).replace(/\d/g, (d) => BN[d]);
export const fromBn = (s) => String(s).replace(/[০-৯]/g, (d) => BN.indexOf(d));

export function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

/** Lookup maps built from the tree response. */
export function flattenTree(tree) {
  const topics = new Map();
  const lessons = new Map();
  const subTopics = new Map();
  tree?.subjects?.forEach((s) =>
    s.lessons.forEach((l) => {
      lessons.set(l.id, l);
      l.topics.forEach((t) => {
        topics.set(t.id, { ...t, lessonId: l.id });
        (t.sub_topics || []).forEach((st) => subTopics.set(st.id, { ...st, topicId: t.id }));
      });
    })
  );
  return { topics, lessons, subTopics };
}

export const groupByPaper = (lessons) => {
  const m = new Map();
  lessons.forEach((l) => {
    const k = l.paper || "";
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(l);
  });
  return [...m].map(([title, items]) => ({ title, lessons: items }));
};

/** Sum of questions in the current selection. */
export function selectedQuestionCount(sel, maps) {
  let n = 0;
  sel.topicIds.forEach((id) => (n += maps.topics.get(id)?.count || 0));
  sel.lessonIds.forEach((id) => (n += maps.lessons.get(id)?.count || 0));
  (sel.subTopicIds || []).forEach((id) => (n += maps.subTopics?.get(id)?.count || 0));
  return n;
}

/** one topic: none | some (some sub topics) | all (whole topic / whole chapter) */
export function topicStats(topic, lesson, sel) {
  const subs = (topic.sub_topics || []).filter((s) => s.count > 0);
  if (sel.lessonIds.includes(lesson.id) || sel.topicIds.includes(topic.id)) {
    return { state: "all", picked: topic.count, subs };
  }
  const p = subs.filter((s) => (sel.subTopicIds || []).includes(s.id));
  return { state: p.length ? "some" : "none", picked: p.reduce((n, s) => n + s.count, 0), subs };
}

/** What a lesson / paper group looks like: none | some | all, plus counts. */
export function lessonStats(lesson, sel) {
  const lessonOnly = lesson.topics.length === 0;
  const selectable = lesson.topics.filter((t) => t.count > 0);

  if (sel.lessonIds.includes(lesson.id)) {
    return { state: "all", picked: lesson.count, lessonOnly, selectable };
  }

  const stats = selectable.map((t) => topicStats(t, lesson, sel));
  return {
    state: stats.some((x) => x.state !== "none") ? "some" : "none",
    picked: stats.reduce((n, x) => n + x.picked, 0),
    lessonOnly,
    selectable,
  };
}

/** true when the viewport matches the media query (used for desktop vs. mobile topic layout). */
export function useMediaQuery(query) {
  const get = () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}