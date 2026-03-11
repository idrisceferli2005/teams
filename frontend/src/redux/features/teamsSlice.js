import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  teams: [],
  loading: false,
  error: null,
};

// GET Teams
export const fetchTeams = createAsyncThunk("teams/fetchTeams", async () => {
  const res = await api.get("Team");
  return res.data;
});

// CREATE Team
export const createTeam = createAsyncThunk("teams/createTeam", async (team) => {
  const res = await api.post("teams", team);
  return res.data;
});

// DELETE Team
export const deleteTeam = createAsyncThunk("teams/deleteTeam", async (id) => {
  await api.delete(`teams/${id}`);
  return id;
});
export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ id, team }) => {
    const res = await api.put(`teams/${id}`, team);
    return res.data;
  },
);

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((team) => team.id !== action.payload);
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(
          (team) => team.id === action.payload.id,
        );

        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      });
  },
});

export default teamsSlice.reducer;
