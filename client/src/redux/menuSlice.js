import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching menu
export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async ({ page = 1, category = null }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      });
      if (category) {
        queryParams.append('category', category);
      }

      const response = await fetch(`http://localhost:3000/api/menu?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }

      const data = await response.json();
      return data; // Return the full response including pagination
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    categories: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 9,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.categories = Array.isArray(action.payload.categories) ? action.payload.categories : [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
