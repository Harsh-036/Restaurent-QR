import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for creating a table
export const createTable = createAsyncThunk(
  'table/createTable',
  async ({ tableNumber, capacity }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Creating table with data:', { tableNumber, capacity });

      const response = await fetch('http://localhost:3000/api/tables', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableNumber, capacity }),
      });

      console.log('Create response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create table: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Create API Response:', data);

      // Extract the created table data
      if (data.success && data.data) {
        console.log('Created table data:', data.data);
        return data.data;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response structure from API');
      }
    } catch (error) {
      console.error('Create table error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching tables
export const fetchTables = createAsyncThunk(
  'table/fetchTables',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching tables with token:', token ? 'Token present' : 'No token');

      const response = await fetch('http://localhost:3000/api/tables', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch tables: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Extract the data array from the response
      if (data.success && Array.isArray(data.data)) {
        console.log('Extracted tables data:', data.data);
        return data.data;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response structure from API');
      }
    } catch (error) {
      console.error('Fetch tables error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating a table
export const updateTable = createAsyncThunk(
  'table/updateTable',
  async ({ id, tableNumber, capacity }, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Updating table with id:', id);

      const response = await fetch(`http://localhost:3000/api/tables/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableNumber, capacity }),
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update table: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Update API Response:', data);

      // Extract the updated table data
      if (data.success && data.data) {
        console.log('Updated table data:', data.data);
        return data.data;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response structure from API');
      }
    } catch (error) {
      console.error('Update table error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for toggling table status
export const toggleTableStatus = createAsyncThunk(
  'table/toggleTableStatus',
  async (id, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Toggling table status with id:', id);

      const response = await fetch(`http://localhost:3000/api/tables/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Toggle response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to toggle table status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Toggle API Response:', data);

      // Extract the updated table data
      if (data.success && data.data) {
        console.log('Updated table data:', data.data);
        return data.data;
      } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response structure from API');
      }
    } catch (error) {
      console.error('Toggle table status error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a table
export const deleteTable = createAsyncThunk(
  'table/deleteTable',
  async (id, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const sessionToken = localStorage.getItem('sessionToken');
      const token = accessToken || sessionToken;

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Deleting table with id:', id);

      const response = await fetch(`http://localhost:3000/api/tables/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to delete table: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Delete API Response:', data);

      // Return the id for removal from state
      return id;
    } catch (error) {
      console.error('Delete table error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tables: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Real-time table updates
    addTable: (state, action) => {
      state.tables.push(action.payload);
    },
    updateTable: (state, action) => {
      const index = state.tables.findIndex(table => table._id === action.payload._id);
      if (index !== -1) {
        state.tables[index] = action.payload;
      }
    },
    removeTable: (state, action) => {
      state.tables = state.tables.filter(table => table._id !== action.payload);
    },
    updateTableStatus: (state, action) => {
      const index = state.tables.findIndex(table => table._id === action.payload._id);
      if (index !== -1) {
        state.tables[index].isActive = action.payload.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables.push(action.payload);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex(table => table._id === action.payload._id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleTableStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTableStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tables.findIndex(table => table._id === action.payload._id);
        if (index !== -1) {
          state.tables[index] = action.payload;
        }
      })
      .addCase(toggleTableStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = state.tables.filter(table => table._id !== action.payload);
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addTable, updateTable: updateTableAction, removeTable, updateTableStatus } = tableSlice.actions;

export default tableSlice.reducer;
