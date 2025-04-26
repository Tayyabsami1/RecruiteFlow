// src/Features/Job/JobSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [], // array of jobs posted
};

const jobSlice = createSlice({
  name: 'Job',
  initialState,
  reducers: {
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
});

export const { addJob, setJobs, clearJobs } = jobSlice.actions;

export default jobSlice.reducer;
