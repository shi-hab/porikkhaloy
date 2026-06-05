import { apiSlice } from "@/features/api/apiSlice";
import authSliceReducer from "@/features/auth/authSlice";
import { saveAnswers } from "@/features/exams/Answers";
import examSliceReducer from "@/features/exams/examSlice";
import submittedExamSliceReducer from "@/features/exams/submittedExamSlice";
import mtExamSliceReducer from "@/features/packages/mtExamSlice";
import submittedMTExamSliceReducer from "@/features/packages/submittedMTExamSlice";
import battleQuizSliceReducer from "@/features/exams/battleQuizSlice";


import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import sessionStorage from "redux-persist/lib/storage/session";

const rootPersistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "exam"],
  blacklist: ["api"],
};

const mtExamPersistConfig = {
  key: "mtExam",
  storage: storage, 
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSliceReducer,
  exam: examSliceReducer,
  answers: saveAnswers,
  submittedExam: submittedExamSliceReducer,
  mtExam: persistReducer(mtExamPersistConfig, mtExamSliceReducer), // Wrap mtExam with its own persist configuration
  submittedMTExam: submittedMTExamSliceReducer,
  battleQuiz: battleQuizSliceReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
