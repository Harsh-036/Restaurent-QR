import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const initialState = {
  sessionToken: null,
  sessionId: null,
  loading: false,
  error: null,
};

//session creation thunk
export const session = createAsyncThunk('/session', async (data, thunkApi) => {
  try {
    console.log(thunkApi);
    const res = await axios.post(`${API_BASE_URL}/session`, data);
    return res.data;
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error.response.data.message);
  }
});

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(session.pending, () => {})
      .addCase(session.fulfilled, (state, action) => {
        console.log(action.payload);
        state.sessionToken = action.payload.data.sessionToken;
        state.sessionId = action.payload.data.sessionId;
        localStorage.setItem('sessionToken', action.payload.data.sessionToken);
        localStorage.setItem('sessionId', action.payload.data.sessionId);
      })
      .addCase(session.rejected, () => {});
  },
});

export default guestSlice.reducer;