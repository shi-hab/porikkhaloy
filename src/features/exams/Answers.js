import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    answers: {},
};

const answersSlice = createSlice({
    name: "answers",
    initialState,
    reducers: {
        saveAnswers: (state, action) => {
            state.answers = action.payload; // ✅ Directly store the payload
        },
        clearsaveAnswers: (state) => {
            state.answers = {};
        },
    },
});

export const { saveAnswers, clearsaveAnswers } = answersSlice.actions;
export default answersSlice.reducer;
