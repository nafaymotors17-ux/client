import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApiService } from "../../services/authApiService";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApiService.login(credentials);

      if (!response.success) {
        return rejectWithValue(response.message);
      }

      // Store user in localStorage
      if (response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));
      }

      return response.data.user; // only user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApiService.logout();
      localStorage.removeItem("userData");
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Safe parse helper
const safeParse = (value) => {
  try {
    if (!value || value === "undefined" || value === "null") return null;
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

// Initial state
const getInitialState = () => {
  const userData = localStorage.getItem("userData");
  return {
    user: safeParse(userData),
    loading: false,
    error: null,
  };
};

const initialState = getInitialState();

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("userData");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const userData = localStorage.getItem("userData");
      state.user = safeParse(userData);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        localStorage.removeItem("userData");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("userData");
      });
  },
});

export const { setUser, clearUser, setError, clearError, initializeAuth } =
  authSlice.actions;

export default authSlice.reducer;
