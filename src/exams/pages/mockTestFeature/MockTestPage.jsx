import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { toast } from "sonner";

import { useGetMockBootstrapQuery, useGetMockTreeQuery } from "@/features/exams/mockTestApi";
import { useStartExamMutation } from "@/features/exams/examsApi"; // your existing mutation
import { EMPTY_SEL, flatten, getActive, pickCount, useMockTestWizard } from "./components/useMockTestWizard";
import { flattenTree, selectedQuestionCount } from "./components/Utils";
import { DockContext, WizardHeader } from "./components/parts";
import SubjectStep from "./components/SubjectStep";
import TopicStep from "./components/TopicStep";
import SetupStep from "./components/SetupStep";
import ShortageDialog from "./components/ShortageDialog";

/**
 * If the page scrolls even when there is little content, set this to the vertical padding /
 * header height that your layout adds above or below this page (e.g. "2rem").
 */
const PAGE_OFFSET = "0px";

export default function MockTestPage() {
  const navigate = useNavigate();
  const student = useSelector((s) => s.auth?.student);
  const [state, dispatch] = useMockTestWizard();
  const [shortage, setShortage] = useState(null);
  const [dockHost, setDockHost] = useState(null); // where the bottom bar is teleported to

  useEffect(() => {
    if (!student) navigate("/login");
  }, [student, navigate]);

  /* ---------- derived selection ---------- */
  const current = state.current;
  const active = useMemo(() => getActive(state), [state]);
  const flat = useMemo(() => flatten(state), [state]);
  const curSel = (current && state.selection[current.id]) || EMPTY_SEL;
  const others = active
    .filter((a) => a.id !== current?.id)
    .map((a) => ({ ...a, n: pickCount(state.selection[a.id]) }));
  const added = active.map((a) => ({ ...a, n: pickCount(state.selection[a.id]) }));
  const totalPicks = flat.topicIds.length + flat.lessonIds.length + flat.subTopicIds.length;

  /* ---------- data ---------- */
  const scopeKey = [student?.section_id, student?.group_id, student?.level_id].join("-");
  const boot = useGetMockBootstrapQuery(scopeKey);
  const curTree = useGetMockTreeQuery(
    { subjectIds: current ? [current.id] : [], type: state.type, scope: scopeKey },
    { skip: state.step !== 1 || !current }
  );
  const allTree = useGetMockTreeQuery(
    { subjectIds: flat.subjectIds, type: state.type, scope: scopeKey },
    { skip: state.step !== 2 || flat.subjectIds.length === 0 }
  );
  

  const curMaps = useMemo(() => flattenTree(curTree.currentData), [curTree.currentData]);
  const allMaps = useMemo(() => flattenTree(allTree.currentData), [allTree.currentData]);
  const currentPicked = useMemo(() => selectedQuestionCount(curSel, curMaps), [curSel, curMaps]);

  const [startExam, { isLoading: starting }] = useStartExamMutation();

  const allStandardIds = useMemo(() => boot.data?.exam_types?.map((e) => e.id) ?? [], [boot.data]);
  const standardIds = state.standardIds ?? allStandardIds;
  // all standards selected == no filter (also includes questions that have no exam type)
  const standardFilter = standardIds.length === allStandardIds.length ? [] : standardIds;

  const selection = {
    type: state.type,
    topicIds: flat.topicIds,
    lessonIds: flat.lessonIds,
    subTopicIds: flat.subTopicIds,
    standardIds: standardFilter,
  };

  /* ---------- navigation ---------- */
  const prevStep = useRef(state.step);
  const dir = state.step >= prevStep.current ? 1 : -1;
  useEffect(() => {
    prevStep.current = state.step;
  }, [state.step]);

  const back = () => dispatch({ type: "go", step: state.step === 2 && current ? 1 : 0 });
  const openSubject = (subject) => dispatch({ type: "openSubject", subject });

  /* ---------- start ---------- */
  const submit = async ({ expand = false, extraTopicIds = [] } = {}) => {
    const payload = {
      title: "Mock Test",
      description: "",
      is_paid: false,
      type: state.type,
      questions_limit: state.count,
      time_limit: state.time,
      is_negative_mark_applicable: state.negative,
      subject_categories: flat.subjectIds,
      topic_categories: [...new Set([...flat.topicIds, ...extraTopicIds])],
      lesson_categories: flat.lessonIds,
      sub_topic_categories: flat.subTopicIds,
      exam_type_categories: standardFilter,
      expand_to_parent: expand,
    };

    try {
      const res = await startExam(payload).unwrap();
      if (res.exam && res.questions_list) {
        if (res.notice) toast.info(res.notice);
        // keep the same sessionStorage contract the ongoing-exam page already uses
        sessionStorage.setItem("examData", JSON.stringify({ ...payload, questions_limit: res.questions_list.length }));
        sessionStorage.removeItem("data");
        setShortage(null);
        navigate("/exam-on-going");
      }
    } catch (err) {
      if (err?.status === 409 && err?.data?.code === "NEED_MORE_TOPICS") {
        setShortage(err.data);
      } else if (err?.data?.quota_info) {
        toast.error(err.data.error || "ফ্রি পরীক্ষার লিমিট শেষ");
        navigate("/subscriptions");
      } else {
        toast.error(err?.data?.error || err?.data?.message || "কিছু একটা ভুল হয়েছে");
      }
    }
  };

  const header =
    state.step === 1
      ? { title: "অধ্যায় ও টপিক", subtitle: current?.title }
      : { title: "পরীক্ষার সেটআপ", subtitle: `${active.length}টি বিষয় · ${totalPicks}টি নির্বাচন` };

  return (
    <MotionConfig reducedMotion="user">
      <DockContext.Provider value={dockHost}>
        {/* root = full width of the page area (right of the sidebar) */}
        <div
          className="flex  w-full flex-col font-hind-siliguri text-[13px] text-[#0F2340]"
        >
          {/* content stays compact and centred */}
          <div className="mx-auto flex w-full flex-1 flex-col  bg-[#F3F6FB] px-3 pb-4 pt-4 sm:px-5">
            {state.step > 0 && <WizardHeader step={state.step} title={header.title} subtitle={header.subtitle} onBack={back} />}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state.step}
                className="flex flex-1 flex-col"
                initial={{ opacity: 0, x: dir * 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -16 }}
                transition={{ duration: 0.18 }}
              >
                {state.step === 0 && (
                  <SubjectStep
                    boot={boot.data}
                    isLoading={boot.isLoading}
                    isError={boot.isError}
                    refetch={boot.refetch}
                    type={state.type}
                    added={added}
                    onOpen={openSubject}
                    onNext={() => dispatch({ type: "go", step: 2 })}
                  />
                )}

                {state.step === 1 && current && (
                  <TopicStep
                    key={current.id}
                    tree={curTree.currentData}
                    isLoading={!curTree.currentData && curTree.isFetching}
                    isError={curTree.isError}
                    refetch={curTree.refetch}
                    sel={curSel}
                    dispatch={dispatch}
                    others={others}
                    onOpenOther={openSubject}
                    onRemoveOther={(id) => dispatch({ type: "removeSubject", id })}
                    currentPicked={currentPicked}
                    totalPicks={totalPicks}
                    subjectCount={active.length}
                    onAddMore={() => dispatch({ type: "go", step: 0 })}
                    onNext={() => dispatch({ type: "go", step: 2 })}
                  />
                )}

                {state.step === 2 && (
                  <SetupStep
                    state={state}
                    dispatch={dispatch}
                    maps={allMaps}
                    selection={selection}
                    config={boot.data?.config}
                    examTypes={boot.data?.exam_types}
                    examTypesLoading={boot.isLoading}
                    standardIds={standardIds}
                    activeSubjects={active}
                    starting={starting}
                    onStart={submit}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* bottom bar lands here: sticky, bottom-0, full width of the page area */}
          <div ref={setDockHost} className="" />

          <ShortageDialog
            data={shortage}
            loading={starting}
            onClose={() => setShortage(null)}
            onAddTopics={(ids) => submit({ extraTopicIds: ids })}
            onUseChapter={() => submit({ expand: true })}
            onPickAgain={() => {
              setShortage(null);
              dispatch({ type: "go", step: current ? 1 : 0 });
            }}
          />
        </div>
      </DockContext.Provider>
    </MotionConfig>
  );
}