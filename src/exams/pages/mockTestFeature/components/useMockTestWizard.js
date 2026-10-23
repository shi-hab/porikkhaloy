import { useReducer } from "react";

export const DEFAULTS = {
  mcq: { count: 25, perQ: 0.5 },
  creative: { count: 3, perQ: 20 },
  normal: { count: 5, perQ: 10 },
};

export const EMPTY_SEL = { topicIds: [], lessonIds: [], subTopicIds: [] };

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const uniq = (a) => [...new Set(a)];
const subIdsOf = (topics) => topics.flatMap((t) => (t.sub_topics || []).map((x) => x.id));

export const pickCount = (sel) =>
  sel ? sel.topicIds.length + sel.lessonIds.length + (sel.subTopicIds?.length || 0) : 0;
const hasPicks = (s) => pickCount(s) > 0;

/*
  Wizard steps: 0 = subject, 1 = topics of ONE subject, 2 = setup
  Selection per subject:
    lessonIds   = whole chapters   (topics / sub topics ignored)
    topicIds    = whole topics     (sub topics ignored)
    subTopicIds = single sub topics of topics that are NOT whole
  All sub topics ticked => whole topic. All topics whole => whole chapter.
*/
const initial = {
  step: 0,
  current: null,
  subjects: [],
  selection: {},
  standardIds: null,
  type: "mcq",
  count: DEFAULTS.mcq.count,
  time: DEFAULTS.mcq.count * DEFAULTS.mcq.perQ,
  timeTouched: false,
  negative: true,
};

export const getActive = (s) => s.subjects.filter((x) => hasPicks(s.selection[x.id]));

export const flatten = (s) => {
  const act = getActive(s);
  return {
    subjectIds: act.map((x) => x.id),
    topicIds: act.flatMap((x) => s.selection[x.id].topicIds),
    lessonIds: act.flatMap((x) => s.selection[x.id].lessonIds),
    subTopicIds: act.flatMap((x) => s.selection[x.id].subTopicIds || []),
  };
};

function reducer(s, a) {
  const id = s.current?.id;
  const cur = (id && s.selection[id]) || EMPTY_SEL;
  const put = (next) => ({ ...s, selection: { ...s.selection, [id]: next } });

  switch (a.type) {
    case "openSubject":
      return {
        ...s,
        current: a.subject,
        subjects: s.subjects.some((x) => x.id === a.subject.id) ? s.subjects : [...s.subjects, a.subject],
        step: 1,
      };

    case "removeSubject": {
      const { [a.id]: _gone, ...rest } = s.selection;
      const removingCurrent = s.current?.id === a.id;
      return {
        ...s,
        selection: rest,
        subjects: s.subjects.filter((x) => x.id !== a.id),
        current: removingCurrent ? null : s.current,
        step: removingCurrent && s.step === 1 ? 0 : s.step,
      };
    }

    case "go":
      return { ...s, step: a.step };

    case "toggleLesson": {
      if (!id) return s;
      const l = a.lesson;
      const own = l.topics.map((t) => t.id);
      const ownSubs = subIdsOf(l.topics);
      return put(
        cur.lessonIds.includes(l.id)
          ? { ...cur, lessonIds: cur.lessonIds.filter((x) => x !== l.id) }
          : {
              topicIds: cur.topicIds.filter((t) => !own.includes(t)),
              subTopicIds: cur.subTopicIds.filter((x) => !ownSubs.includes(x)),
              lessonIds: [...cur.lessonIds, l.id],
            }
      );
    }

    case "toggleTopic": {
      if (!id) return s;
      const { lesson: l, topic: t } = a;
      const own = (t.sub_topics || []).map((x) => x.id);
      const selectable = l.topics.filter((x) => x.count > 0).map((x) => x.id);
      let { topicIds, lessonIds, subTopicIds } = cur;

      if (lessonIds.includes(l.id)) {
        // chapter was whole -> un-tick just this topic
        lessonIds = lessonIds.filter((x) => x !== l.id);
        topicIds = uniq([...topicIds, ...selectable.filter((x) => x !== t.id)]);
      } else if (topicIds.includes(t.id)) {
        topicIds = topicIds.filter((x) => x !== t.id);
      } else {
        // none / partial (some sub topics) -> whole topic
        subTopicIds = subTopicIds.filter((x) => !own.includes(x));
        topicIds = [...topicIds, t.id];
        if (selectable.length && selectable.every((x) => topicIds.includes(x))) {
          topicIds = topicIds.filter((x) => !selectable.includes(x));
          lessonIds = [...lessonIds, l.id];
        }
      }
      return put({ topicIds, lessonIds, subTopicIds });
    }

    case "toggleSubTopic": {
      if (!id) return s;
      const { lesson: l, topic: t, subId } = a;
      const subs = (t.sub_topics || []).filter((x) => x.count > 0).map((x) => x.id);
      const selectable = l.topics.filter((x) => x.count > 0).map((x) => x.id);
      let { topicIds, lessonIds, subTopicIds } = cur;

      if (lessonIds.includes(l.id) || topicIds.includes(t.id)) {
        // parent was whole -> break it down, un-tick only this sub topic
        if (lessonIds.includes(l.id)) {
          lessonIds = lessonIds.filter((x) => x !== l.id);
          topicIds = uniq([...topicIds, ...selectable]);
        }
        topicIds = topicIds.filter((x) => x !== t.id);
        subTopicIds = uniq([...subTopicIds, ...subs.filter((x) => x !== subId)]);
      } else {
        subTopicIds = subTopicIds.includes(subId) ? subTopicIds.filter((x) => x !== subId) : [...subTopicIds, subId];
        if (subs.length && subs.every((x) => subTopicIds.includes(x))) {
          // every sub topic ticked == whole topic
          subTopicIds = subTopicIds.filter((x) => !subs.includes(x));
          topicIds = [...topicIds, t.id];
          if (selectable.every((x) => topicIds.includes(x))) {
            topicIds = topicIds.filter((x) => !selectable.includes(x));
            lessonIds = [...lessonIds, l.id];
          }
        }
      }
      return put({ topicIds, lessonIds, subTopicIds });
    }

    case "toggleLessons": {
      if (!id) return s;
      const eligible = a.lessons.filter((l) => l.count > 0);
      const ids = eligible.map((l) => l.id);
      const own = eligible.flatMap((l) => l.topics.map((t) => t.id));
      const ownSubs = eligible.flatMap((l) => subIdsOf(l.topics));
      const allWhole = eligible.length > 0 && ids.every((x) => cur.lessonIds.includes(x));
      return put(
        allWhole
          ? { ...cur, lessonIds: cur.lessonIds.filter((x) => !ids.includes(x)) }
          : {
              topicIds: cur.topicIds.filter((t) => !own.includes(t)),
              subTopicIds: cur.subTopicIds.filter((x) => !ownSubs.includes(x)),
              lessonIds: uniq([...cur.lessonIds, ...ids]),
            }
      );
    }

    case "setStandards":
      return { ...s, standardIds: a.ids };
    case "setType": {
      const d = DEFAULTS[a.value];
      return { ...s, type: a.value, count: d.count, time: d.count * d.perQ, timeTouched: false };
    }
    case "setCount": {
      const count = clamp(a.value, 1, a.max || 200);
      return { ...s, count, time: s.timeTouched ? s.time : count * DEFAULTS[s.type].perQ };
    }
    case "setTime":
      return { ...s, time: clamp(a.value, 1, 600), timeTouched: true };
    case "setNegative":
      return { ...s, negative: a.value };
    default:
      return s;
  }
}

export const useMockTestWizard = () => useReducer(reducer, initial);