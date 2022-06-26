import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { RootState } from "../../app/store";
import { AuthState, Token } from "./types";

const initialState: AuthState = {
  token: '', 
  currentUser: undefined
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const {token, currentUser} = action.payload;
      state.currentUser = currentUser;
      state.token = token;
    },
    tokenReceived: (state, action: PayloadAction<Token>) => {
      state.token = action.payload.accessToken;
    },
    loggedOut: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => initialState)
  }
});

export const {
  setCredentials,
  tokenReceived,
  loggedOut
} = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;