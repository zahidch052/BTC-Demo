import { createSlice } from '@reduxjs/toolkit'
// import useWebSocket from 'react-use-websocket';
// import {BTC_URL} from '../helper/constants';
import {getWsData,getBtcData} from './actions';


export const BitcoinData = createSlice({
  name: 'bitcoin',
  initialState: {
    webSocketData: '',
    btcData:{ last: '', priceChange: '', percentageChange: '' },
  },
  reducers: {
    setWebSocketData: (state,{payload}) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
        state.webSocketData = payload;
    },
    setBTCData:async (state,payload) => {
      state.btcData = payload
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getWsData.fulfilled, (state, action) => {
      state.webSocketData = action.payload
    })
    builder.addCase(getBtcData.fulfilled, (state, action) => {
      state.btcData = action.payload
    })
  },
})

// Action creators are generated for each case reducer function
export const { setWebSocketData, setBTCData } = BitcoinData.actions

export default BitcoinData.reducer