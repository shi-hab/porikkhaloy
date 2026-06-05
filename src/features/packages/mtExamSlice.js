import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attemptId: null,
    allMTExams: [],
    activeExam: null,
    activeExamId:[],
    activeExamsTotalTimes: null,
    endTimes : null,
};

const mtExamSlice = createSlice({
    name: "mtExam",
    initialState,
    reducers: {
        saveMTExamInfo: (state, action) => {
            const exams = action.payload; 


            exams.forEach((examData) => {
                const existingExamIndex = state.allMTExams.findIndex(
                    (item) => item.exam.id === examData.exam.id
                );

                if (existingExamIndex === -1) {
                    // Add a new exam if it doesn't exist
                    state.allMTExams.push({
                        ...examData,
                        mcqAnswers: examData.mcqAnswers || [],
                        fileUrl: examData.fileUrl || null, // Add fileUrl
                    });
                } else {
                    // Update the existing exam's mcqAnswers if it exists
                    state.allMTExams[existingExamIndex].mcqAnswers = [
                        ...(state.allMTExams[existingExamIndex].mcqAnswers || []),
                        ...(examData.mcqAnswers || []),
                    ];
                    state.allMTExams[existingExamIndex].fileUrl =
                        examData.fileUrl || null; // Update fileUrl
                }

                // Add to activeExamId and calculate total time
                if (!state.activeExamId?.includes(examData.exam.id)) {
                    state.activeExamId?.push(examData?.exam?.id);
                    
                }
            });

            // Set the active exam to the last one in the array
            const lastExam = exams[exams.length - 1];
            state.activeExam = {
                ...lastExam,
                mcqAnswers: lastExam.mcqAnswers || [],
                fileUrl: lastExam.fileUrl || null, // Add fileUrl
                remainingTime: lastExam.exam.time_limit * 60,
            };
        },
        switchActiveExam: (state, action) => {
            const existingExam = state.allMTExams.find(
                (item) => item?.exam.id === action.payload.exam?.id
            );

            if (existingExam) {
                // Persist existing mcqAnswers to the exam before switching
                if (state.activeExam) {
                    const activeExamIndex = state.allMTExams.findIndex(
                        (item) => item.exam.id === state.activeExam.exam.id
                    );

                    if (activeExamIndex !== -1) {
                        state.allMTExams[activeExamIndex].mcqAnswers =
                            state.activeExam.mcqAnswers;
                        state.allMTExams[activeExamIndex].fileUrl =
                            state.activeExam.fileUrl; // Persist fileUrl
                    }
                }

                // Switch to the new active exam
                state.activeExam = {
                    ...existingExam,
                    mcqAnswers: [...existingExam.mcqAnswers],
                    fileUrl: existingExam.fileUrl || null, // Set fileUrl
                };
            }
        },
        updateMTMcqAnswer: (state, action) => {
    const { examId, question_id, mcq_question_id, submitted_mcq_option } = action.payload;

    // Find exam in allMTExams
    const examIndex = state.allMTExams.findIndex((item) => item.exam.id === examId);
    if (examIndex === -1) return; // Exam not found

    const examData = state.allMTExams[examIndex];

    // Utility to update answers array
    const updateAnswersArray = (answersArray) => {
        const idx = answersArray.findIndex(ans => ans.question_id === question_id);
        if (idx !== -1) {
            answersArray[idx] = { question_id, mcq_question_id, submitted_mcq_option };
        } else {
            answersArray.push({ question_id, mcq_question_id, submitted_mcq_option });
        }
        return [...answersArray];
    };

    // Update mcqAnswers in allMTExams
    examData.mcqAnswers = updateAnswersArray(examData.mcqAnswers || []);

    // Optional: If this exam is the activeExam, update it too
    if (state.activeExam?.exam.id === examId) {
        state.activeExam.mcqAnswers = [...examData.mcqAnswers];
    }
},

        updateFileUrl: (state, action) => {
            const { examId, fileUrl } = action.payload;

            const validFileUrl = {
                cdn_url: fileUrl.cdn_url || null,
                file_name: fileUrl.file_name || null,
                file_size: fileUrl.file_size || null,
            };

            if (state.activeExam?.exam.id === examId) {
                state.activeExam.fileUrl = validFileUrl;
            }

            const examIndex = state.allMTExams.findIndex(
                (item) => item.exam.id === examId
            );

            if (examIndex !== -1) {
                state.allMTExams[examIndex].fileUrl = validFileUrl;
            }
        },

        // updateRemainingTime: (state, action) => {
        //     const { decrementBy } = action.payload;
        //     state.activeExamsTotalTimes -= decrementBy;
        // },
        addTimes: (state, action) => {
            const { times } = action.payload;
            state.activeExamsTotalTimes = times*60;
        },
       setAttemptId: (state, action) => {
            state.attemptId = action.payload;
        },
       endTimes: (state) => {
            const totalTimes = state.activeExamsTotalTimes;
            const endTime = Date.now() + totalTimes * 1000;
            
            state.endTimes = endTime;

            localStorage.setItem("end_time", endTime);
        },

        clearMTExamInfo: (state) => {
            state.allMTExams = [];
            state.activeExam = null;
            state.activeExamId=[]
            state.activeExamsTotalTimes= 0
        },
    },
});

export const {
    saveMTExamInfo,
    switchActiveExam,
    updateMTMcqAnswer,
    clearMTExamInfo,
    updateFileUrl,
    addTimes,
    setAttemptId,
    // updateRemainingTime,
    endTimes,
} = mtExamSlice.actions;
export default mtExamSlice.reducer;
