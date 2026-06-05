import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    submittedMTExamData: {},
    mtExamsSubmissionStatus: {}
};

const submittedMTExamSlice = createSlice({
    name: "submittedMTExam",
    initialState,
    reducers: {
        submittedMTExamInfo: (state, action) => {
            state.submittedMTExamData = action.payload;
        },
        updateMTExamSubmittedStatus: (state, action) => {
            state.mtExamsSubmissionStatus = {
                ...state.mtExamsSubmissionStatus,
                modelTestId: action.payload.modelTestId,
                isMTExamsSubmmitted: action.payload.isMTExamsSubmmitted
            };
        }
    },
});

export const { submittedMTExamInfo, updateMTExamSubmittedStatus } = submittedMTExamSlice.actions;
export default submittedMTExamSlice.reducer;
