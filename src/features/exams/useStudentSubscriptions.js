import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useExamSubscriptionsQuery } from "@/features/exams/examsApi.js";


const PROFILE_KEYS = {
  section: ["section_id", "section"],
  group: ["group_id", "group"],
  level: ["level_id", "level"],
  target: ["target", "target_category", "student_target", "category"],
};

const pick = (student, keys, objectKeys = ["id", "value", "slug", "name"]) => {
  for (const k of keys) {
    let v = student?.[k];
    if (Array.isArray(v)) v = v[0];
    if (v && typeof v === "object") {
      for (const ok of objectKeys) {
        if (v[ok] !== undefined && v[ok] !== null && v[ok] !== "") {
          v = v[ok];
          break;
        }
      }
      if (typeof v === "object") continue;
    }
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return String(v).trim();
    }
  }
  return undefined;
};

// query params for the backend (undefined values are not sent)
export const getStudentCategoryParams = (student) => ({
  section_id: pick(student, PROFILE_KEYS.section),
  group_id: pick(student, PROFILE_KEYS.group),
  level_id: pick(student, PROFILE_KEYS.level),
  target: pick(student, PROFILE_KEYS.target, ["value", "slug", "name", "id"]),
});


export function useStudentSubscriptions() {
  const student = useSelector((state) => state.auth?.student);
  const params = useMemo(() => getStudentCategoryParams(student), [student]);

  const query = useExamSubscriptionsQuery(params, {
    refetchOnMountOrArgChange: 30, // offers are time based, don't serve very old cache
  });

  const rows = useMemo(() => query.data?.data ?? [], [query.data]);

  return { ...query, rows, params };
}