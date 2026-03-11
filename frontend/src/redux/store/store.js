import { configureStore } from "@reduxjs/toolkit";
import teamsReducer from "../features/teamsSlice";
import playersReducer from "../features/playersSlice";
import matchesReducer from "../features/matchesSlice";

export const store = configureStore({
  reducer: {
    teams: teamsReducer,
    players: playersReducer,
    matches: matchesReducer,
  },
});
