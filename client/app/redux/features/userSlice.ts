import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
export type userDetailsType = {
    name?:string;
    session_fid?:number;
    loggedIn?:'yes'|'no';
}

// initial state if the slice
const initialState: userDetailsType = {
    name: '',
    loggedIn: 'no'
};

// Create a slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Reducer to set the count to a specific value
        updateUser: (state, action: PayloadAction<userDetailsType>) => {
            return state = {...state, ...action.payload};
        },
    },
});

// Export the actions and reducer
export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
