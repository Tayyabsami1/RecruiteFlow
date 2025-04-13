import { configureStore } from '@reduxjs/toolkit'
import UserReducer from "../Features/User/UserSlice"
export const store = configureStore({
  reducer: {
    // ? User Reducer
    User: UserReducer,
  },
})