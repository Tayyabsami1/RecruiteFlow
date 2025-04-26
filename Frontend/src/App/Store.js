import { configureStore } from '@reduxjs/toolkit'
import jobReducer from '../Features/Jobs/JobSlice';
import UserReducer from "../Features/User/UserSlice"
export const store = configureStore({
  reducer: {
    // ? User Reducer
    User: UserReducer,
    //Job Reducer to manage Jobs
    Job: jobReducer,
  },
})