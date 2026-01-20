import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Async thunk for getting coupons (filtered by cart total)
export const getCoupons = createAsyncThunk(
  'coupon/getCoupons',
  async (cartTotal, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/coupans?cartTotal=${cartTotal}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.CoupansAfterCalculation || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for getting all coupons (admin view)
export const getAllCoupons = createAsyncThunk(
  'coupon/getAllCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      // Fetch all coupons with high cartTotal to make them available for admin view
      const response = await fetch(`${API_BASE_URL}/coupans?cartTotal=100000`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.CoupansAfterCalculation || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a coupon
export const createCoupon = createAsyncThunk(
  'coupon/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/coupans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(couponData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.coupan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a coupon
export const updateCoupon = createAsyncThunk(
  'coupon/updateCoupon',
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/coupans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(couponData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.coupan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a coupon
export const deleteCoupon = createAsyncThunk(
  'coupon/deleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/coupans/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Real-time coupon updates
    addCoupon: (state, action) => {
      state.coupons.unshift(action.payload);
    },
    updateCouponAction: (state, action) => {
      const index = state.coupons.findIndex(coupon => coupon._id === action.payload._id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
    removeCoupon: (state, action) => {
      state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Show dummy coupons on error
        state.coupons = [
          { code: 'DUMMY10', description: '10% off on orders above ₹500', isAvailable: true, discountAmount: 50 },
          { code: 'FIRST50', description: '₹50 off on first order', isAvailable: false, discountAmount: 0 },
        ];
      })
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // No dummy coupons for admin view
        state.coupons = [];
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex(coupon => coupon._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addCoupon, updateCouponAction, removeCoupon } = couponSlice.actions;

export default couponSlice.reducer;
