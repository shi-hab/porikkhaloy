import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  question_id: null,
  title: null,
  description: null,
  type: null,
  mark: null,
  images: null,
  is_paid: null,
  is_featured: null,
  status: null,
  mcq_options: [],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    saveQuestion: (state, action) => {
      state.question_id = action.payload.question_id;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.type = action.payload.type;
      state.mark = action.payload.mark;
      state.images = action.payload.images;
      state.is_paid = action.payload.is_paid;
      state.is_featured = action.payload.is_featured;
      state.status = action.payload.status;
      state.mcq_options = action.payload.mcq_options;
    },
    clearQuestion: (state) => {
      state.question_id = null;
      state.title = null;
      state.description = null;
      state.type = null;
      state.mark = null;
      state.images = null;
      state.is_paid = null;
      state.is_featured = null;
      state.status = null;
      state.mcq_options = [];
    },
  },
});

export const { saveQuestion, clearQuestion } = questionSlice.actions;
export default questionSlice.reducer;