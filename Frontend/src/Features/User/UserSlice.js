import { createSlice } from "@reduxjs/toolkit";
// * You can use nanoid from redux toolkit to generate unique ids for your data

const InitialState={
    // ? User data
    email:"test@gmail.com",
    password:"1234",
}

export const UserSlice =createSlice({
    name:"User",
    initialState:InitialState,
    reducers:{
        // ? Set User Data
        setUserData:(state,action)=>{
            const newUser={
                email:action.payload.email,
                password:action.payload.password,
            }
            state.value=newUser;
        },
        // ? Clear User Data
        clearUserData:(state)=>{
            state.value={}
        }
    }
})

// We will update state using these  Reducers 
export const {setUserData,clearUserData}= UserSlice.actions

// We will provide this to the store so it knows which reducer to use to update the state
export default UserSlice.reducer

