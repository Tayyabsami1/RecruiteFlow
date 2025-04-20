import { createSlice } from "@reduxjs/toolkit";
// * You can use nanoid from redux toolkit to generate unique ids for your data

const InitialState={
    // ? User data
    User:null
}

export const UserSlice =createSlice({
    name:"User",
    initialState:InitialState,
    reducers:{
        // ? Set User Data
        setUserData:(state,action)=>{
            state.User=action.payload
        },
        // ? Clear User Data
        clearUserData:(state)=>{
            state.User=null
        }
    }
})

// We will update state using these  Reducers 
export const {setUserData,clearUserData}= UserSlice.actions

// We will provide this to the store so it knows which reducer to use to update the state
export default UserSlice.reducer

