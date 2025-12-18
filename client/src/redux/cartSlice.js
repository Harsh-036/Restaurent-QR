import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for adding item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ menuItemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/addtocart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
