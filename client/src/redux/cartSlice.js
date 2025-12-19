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

// Async thunk for getting cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/getcart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for increasing item quantity
export const increaseItemQuantity = createAsyncThunk(
  'cart/increaseItemQuantity',
  async ({ menuItemId }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/increaseitem', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for decreasing item quantity
export const decreaseItemQuantity = createAsyncThunk(
  'cart/decreaseItemQuantity',
  async ({ menuItemId }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/decreaseitem', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for removing item from cart
export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async ({ menuItemId }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('http://localhost:3000/api/removeitem', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId }),
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
  reducers: {
    increaseQuantityOptimistic: (state, action) => {
      if (state.cart) {
        const item = state.cart.items.find(item => item.menuItemId._id === action.payload.menuItemId);
        if (item) {
          item.quantity += 1;
        }
      }
    },
    decreaseQuantityOptimistic: (state, action) => {
      if (state.cart) {
        const item = state.cart.items.find(item => item.menuItemId._id === action.payload.menuItemId);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    },
    removeItemOptimistic: (state, action) => {
      if (state.cart) {
        state.cart.items = state.cart.items.filter(item => item.menuItemId._id !== action.payload.menuItemId);
      }
    },
  },
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
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(increaseItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(decreaseItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { increaseQuantityOptimistic, decreaseQuantityOptimistic, removeItemOptimistic } = cartSlice.actions;
export default cartSlice.reducer;
