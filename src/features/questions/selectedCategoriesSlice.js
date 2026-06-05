import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSection: "",
  selectedExamType: "",
  selectedExamSubType: "",
  selectedGroup: "",
  selectedLevel: "",
  selectedSubject: "",
  selectedLesson: "",
  selectedTopic: "",
  selectedSubTopic: "",
  selectedYear: "",
};

const selectedCategoriesSlice = createSlice({
  name: 'selectedCategories',
  initialState,
  reducers: {
    setSelectedSection(state, action) {
      state.selectedSection = action.payload.selectedSection;
    },
    setSelectedExamType(state, action) {
      state.selectedExamType = action.payload.selectedExamType;
    },
    setSelectedExamSubType(state, action) {
      state.selectedExamSubType = action.payload.selectedExamSubType;
    },
    setSelectedGroup(state, action) {
      state.selectedGroup = action.payload.selectedGroup;
    },
    setSelectedLevel(state, action) {
      state.selectedLevel = action.payload.selectedLevel;
    },
    setSelectedSubject(state, action) {
      state.selectedSubject = action.payload.selectedSubject;
    },
    setSelectedLesson(state, action) {
      state.selectedLesson = action.payload.selectedLesson;
    },
    setSelectedTopic(state, action) {
      state.selectedTopic = action.payload.selectedTopic;
    },
    setSelectedSubTopic(state, action) {
      state.selectedSubTopic = action.payload.selectedSubTopic;
    },
    setSelectedYear(state, action) {
      state.selectedYear = action.payload.selectedYear;
    },
  },
});

export const {
  setSelectedSection,
  setSelectedExamType,
  setSelectedExamSubType,
  setSelectedGroup,
  setSelectedLevel,
  setSelectedSubject,
  setSelectedLesson,
  setSelectedTopic,
  setSelectedSubTopic,
  setSelectedYear,
} = selectedCategoriesSlice.actions;

export default selectedCategoriesSlice.reducer;
