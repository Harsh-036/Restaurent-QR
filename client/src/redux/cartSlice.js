import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for adding item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ menuItemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/addtocart`, {
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

      const response = await fetch(`${API_BASE_URL}/getcart`, {
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

      const response = await fetch(`${API_BASE_URL}/increaseitem`, {
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

      const response = await fetch(`${API_BASE_URL}/decreaseitem`, {
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

      const response = await fetch(`${API_BASE_URL}/removeitem`, {
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

// Async thunk for migrating guest cart to user cart
export const migrateCart = createAsyncThunk(
  'cart/migrateCart',
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/migratecart`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for placing order
export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('sessionToken');

      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for verifying payment
export const verifyPayment = createAsyncThunk(
  'cart/verifyPayment',
  async ({ paymentId, razorPayOrderId, signature }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, razorPayOrderId, signature }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      return data;
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
    clearCart: (state) => {
      state.cart = null;
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
      })
      .addCase(migrateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(migrateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionId');
      })
      .addCase(migrateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally clear cart or update state
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Clear the cart after successful payment verification
        state.cart = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { increaseQuantityOptimistic, decreaseQuantityOptimistic, removeItemOptimistic, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
