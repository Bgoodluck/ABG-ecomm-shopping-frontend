import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null, // Add token to the state
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      // Ensure the entire payload is stored
      state.user = action.payload;
      
      // Extract and store token if it exists
      // This assumes the token is part of the payload
      state.token = action.payload?.token || null;
    },
    // Optional: Add a specific method to set token
    setToken: (state, action) => {
      state.token = action.payload;
    },
    // Optional: Logout method
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
})

export const { setUserDetails, setToken, logout } = userSlice.actions

export default userSlice.reducer