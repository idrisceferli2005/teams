import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  matches: [],
  loading: false,
  error: null,
};

// GET Matches
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async () => {
    const res = await api.get("Match");
    return res.data;
  },
);

// CREATE Match
export const createMatch = createAsyncThunk(
  "matches/createMatch",
  async (match) => {
    const res = await api.post("Match", match);
    return res.data;
  },
);

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      });
  },
});

export default matchesSlice.reducer;
