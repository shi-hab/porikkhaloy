import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: null,
  message: null,
  token: null,
  student: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.token = action.payload.token;
      state.student = action.payload.student;
    },
    loggedOut: (state) => {
      state.status = null;
      state.message = null;
      state.token = null;
      state.student = null;
    },
    updateStudent: (state, action) => {
      state.student = action.payload;
    },
  },
});

export const { loggedIn, updateStudent, loggedOut } = authSlice.actions;
export default authSlice.reducer;