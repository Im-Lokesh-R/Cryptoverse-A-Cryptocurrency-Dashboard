import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchData',
  async ({ page = 1, perPage = 20 }) => {
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: true,
      },
    });
    return response.data;
  }
);

export const fetchCryptoDetails = createAsyncThunk('crypto/fetchDetails', async (coinId) => {
  const response = await axios.get(`${API_URL}/coins/${coinId}`, {
    params: {
      sparkline: true,
      market_data: true,
      community_data: true,
      developer_data: true,
    },
  });
  return response.data;
});

export const fetchCryptoHistory = createAsyncThunk('crypto/fetchHistory', async ({ coinId, days }) => {
  const response = await axios.get(`${API_URL}/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: days,
    },
  });
  return response.data;
});

export const fetchGlobalData = createAsyncThunk('crypto/fetchGlobalData', async () => {
  const response = await axios.get(`${API_URL}/global`);
  return response.data.data;
});

export const fetchCoinList = createAsyncThunk('crypto/fetchCoinList', async () => {
  const response = await axios.get(`${API_URL}/coins/list`);
  return response.data;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    coins: [],
    coinDetails: {}, // Changed to object
    history: {},    // Changed to object
    globalData: null,
    coinList: [],   // Added for dropdowns
    loading: false,
    error: null,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.coinDetails[action.meta.arg] = action.payload; // Store by coinId
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history[action.meta.arg.coinId] = action.payload; // Store by coinId
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGlobalData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalData.fulfilled, (state, action) => {
        state.loading = false;
        state.globalData = action.payload;
      })
      .addCase(fetchGlobalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCoinList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoinList.fulfilled, (state, action) => {
        state.loading = false;
        state.coinList = action.payload;
      })
      .addCase(fetchCoinList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm } = cryptoSlice.actions;

export default cryptoSlice.reducer;