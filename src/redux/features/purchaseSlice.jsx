// src/redux/slices/purchaseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { purchaseService } from "../../services/purchaseApi";
import { toast } from "react-toastify";

// Async thunks
export const fetchPurchases = createAsyncThunk(
  "purchases/fetchPurchases",
  async (
    {
      page = 1,
      limit = 10,
      status = "",
      search = "",
      chassisNumber = "",
      modelYear = "",
      maker = "",
      auctionNumber = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await purchaseService.getPurchases({
        page,
        limit,
        status,
        search,
        chassisNumber,
        modelYear,
        maker,
        auctionNumber,
        sortBy,
        sortOrder,
      });
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to fetch purchases");
      return rejectWithValue(error.message);
    }
  }
);

export const createPurchase = createAsyncThunk(
  "purchases/createPurchase",
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await purchaseService.createPurchase(purchaseData);
      toast.success("Purchase created successfully!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to create purchase");
      return rejectWithValue(error.message);
    }
  }
);

export const updatePurchase = createAsyncThunk(
  "purchases/updatePurchase",
  async ({ id, purchaseData }, { rejectWithValue }) => {
    try {
      console.log(id);
      console.log(purchaseData);

      const response = await purchaseService.updatePurchase(id, purchaseData);
      toast.success("Purchase updated successfully!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update purchase");
      return rejectWithValue(error.message);
    }
  }
);
export const markAsLoadRequested = createAsyncThunk(
  "purchases/markAsLoadRequested",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.updatePurchase(id, {
        status: "load_requested",
      });
      toast.success("Load request submitted!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to submit load request");
      return rejectWithValue(error.message);
    }
  }
);

export const markAsLoaded = createAsyncThunk(
  "purchases/markAsLoaded",
  async (id, { rejectWithValue }) => {
    try {
      // Just send status field
      const response = await purchaseService.updatePurchase(id, {
        status: "loaded",
      });
      toast.success("Vehicle marked as loaded!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to mark as loaded");
      return rejectWithValue(error.message);
    }
  }
);

export const rejectLoadRequest = createAsyncThunk(
  "purchases/rejectLoadRequest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.updatePurchase(id, {
        status: "purchased",
      });
      toast.success("Load request rejected!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to reject load request");
      return rejectWithValue(error.message);
    }
  }
);

export const markAsArrived = createAsyncThunk(
  "purchases/markAsArrived",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.markAsArrived(id);
      toast.success("Vehicle marked as arrived in showroom!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to mark as arrived");
      return rejectWithValue(error.message);
    }
  }
);
export const revertToPurchased = createAsyncThunk(
  "purchases/revertToPurchased",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.revertToPurchased(id);
      toast.success("Vehicle reverted to purchased status!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to revert to purchased");
      return rejectWithValue(error.message);
    }
  }
);
export const markAsSold = createAsyncThunk(
  "purchases/markAsSold",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.markAsSold(id);
      toast.success("Vehicle marked as sold!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to mark as sold");
      return rejectWithValue(error.message);
    }
  }
);

export const markAsReleased = createAsyncThunk(
  "purchases/markAsReleased",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.markAsReleased(id);
      toast.success("Vehicle released successfully!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to release vehicle");
      return rejectWithValue(error.message);
    }
  }
);

export const deletePurchase = createAsyncThunk(
  "purchases/deletePurchase",
  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseService.deletePurchase(id);
      toast.success("Purchase deleted successfully!");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to delete purchase");
      return rejectWithValue(error.message);
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchases",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters: {
      all: {
        // ✅ NEW: All tab
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      purchased: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt", // DEFAULT: Latest created first
        sortOrder: "desc", // DEFAULT: Descending for latest first
      },
      loaded: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      load_request: {
        // ✅ NEW: Load Request tab
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      available: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      sold: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      released: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      expired: {
        search: "",
        chassisNumber: "",
        modelYear: "",
        maker: "",
        auctionNumber: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Action to update filters for a specific tab
    updateFilters: (state, action) => {
      const { tab, filters } = action.payload;
      if (state.filters[tab]) {
        state.filters[tab] = { ...state.filters[tab], ...filters };
      }
    },
    // Action to update sort config for a specific tab
    updateSortConfig: (state, action) => {
      const { tab, sortBy, sortOrder } = action.payload;
      if (state.filters[tab]) {
        state.filters[tab].sortBy = sortBy;
        state.filters[tab].sortOrder = sortOrder;
      }
    },
    // Action to clear all filters for a specific tab

    clearFilters: (state, action) => {
      const { tab } = action.payload;
      if (state.filters[tab]) {
        state.filters[tab] = {
          search: "",
          chassisNumber: "",
          modelYear: "",
          maker: "",
          auctionNumber: "",
          sortBy: "createdAt", // Reset to default sort
          sortOrder: "desc", // Reset to default order
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Purchases - Always fetch fresh data
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta?.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        };
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Purchase
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
      })
      // Update Purchase
      .addCase(updatePurchase.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload.data._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(markAsLoadRequested.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      .addCase(rejectLoadRequest.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      // Mark as Loaded
      .addCase(markAsLoaded.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      // Mark as Arrived
      .addCase(markAsArrived.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      // Mark as Sold
      .addCase(markAsSold.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      // Mark as Released
      .addCase(markAsReleased.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      })
      // Delete Purchase
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(revertToPurchased.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.data._id
        );
      });
  },
});

export const { clearError, updateFilters, updateSortConfig, clearFilters } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;
