/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd"; // ✅ Ant Design mesaj komponenti

const API = "https://localhost:7134/api/";

// 🔐 Login thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ pin, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/Auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Giriş uğursuz!";
        throw new Error(errorMessage);
      }

      message.success("Giriş uğurla başa çatdı ✅"); // ✅ uğurlu login
      return data; // access_token, token_type
    } catch (error) {
      message.error(error.message || "Giriş zamanı xəta baş verdi ❌"); // ✅ error toast
      return rejectWithValue(error.message);
    }
  }
);

// 👤 Profil məlumatı
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user_detail`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Profil məlumatları alınmadı");
      const data = await res.json();
      message.success("Profil məlumatları yeniləndi 🔄"); // ✅ uğurlu profil
      return data;
    } catch (e) {
      message.error(e.message || "Profil məlumatları alınmadı ❌"); // ✅ error toast
      return rejectWithValue(e.message);
    }
  }
);

let storedUser = null;
try {
  const userData = localStorage.getItem("user");
  if (userData) storedUser = JSON.parse(userData);
} catch (e) {
  storedUser = null;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser,
  
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      message.info("Hesabdan çıxış edildi 🚪"); // ✅ logout mesajı
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;

        state.user = {
          token: action.payload.access_token,
          token_type: action.payload.token_type,
          pin: "",
          fullname: "",
          role_type: [],
        };

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profil
      .addCase(fetchProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            fullname: action.payload.fullname,
            pin: action.payload.pin,
            role_type:
              action.payload.role_type != null
                ? action.payload.role_type
                : action.payload.role,
            organization_id: action.payload.organization_id,
            ...action.payload,
          };
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
