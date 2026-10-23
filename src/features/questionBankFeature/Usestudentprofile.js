import { shallowEqual, useSelector } from "react-redux";

// section / group / level সরাসরি redux (state.auth.student) থেকে।
// updateStudent dispatch হলেই এখানকার মান বদলায় এবং সব তালিকা নিজে নিজে নতুন করে লোড হয়।
export default function useStudentProfile() {
  return useSelector((state) => {
    const s = state.auth?.student;
    return {
      section_id: s?.section_id ?? undefined,
      group_id: s?.group_id ?? undefined,
      level_id: s?.level_id ?? undefined,
    };
  }, shallowEqual);
}