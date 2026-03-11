import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


const initialState = {
  players: [],
  loading: false,
  error: null,
};

// GET Players
export const fetchPlayers = createAsyncThunk("players/fetchPlayers", async () => {
  const res = await api.get("players");
  return res.data;
});

// CREATE Player
export const createPlayer = createAsyncThunk(
  "players/createPlayer",
  async (player) => {
    const res = await api.post("players", player);
    return res.data;
  }
);

// DELETE Player
export const deletePlayer = createAsyncThunk(
  "players/deletePlayer",
  async (id) => {
    await api.delete(`players/${id}`);
    return id;
  }
);

// UPDATE Player
export const updatePlayer = createAsyncThunk(
  "players/updatePlayer",
  async ({ id, player }) => {
    const res = await api.put(`players/${id}`, player);
    return res.data;
  }
);

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter((p) => p.id !== action.payload);
      })
      .addCase(updatePlayer.fulfilled, (state, action) => {
        const index = state.players.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.players[index] = action.payload;
      })
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.players.push(action.payload);
      });
  },
});

export default playersSlice.reducer;