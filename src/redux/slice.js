import { createSlice } from '@reduxjs/toolkit'
// import useWebSocket from 'react-use-websocket';
// import {BTC_URL} from '../helper/constants';
// import {getWsData,getBtcData} from './actions';
import {SOCKET_URL} from '../helper/constants';
import {BTC_URL , WS_BTC_DATA} from '../helper/constants';
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getWsData = createAsyncThunk(
  'wsData',
  async () => {
    const data = await fetch(WS_BTC_DATA);
    const res = await data.json();
    return res.data;
    // return new Promise(function(resolve, reject){
    //   const ws = new WebSocket(SOCKET_URL);
    //     ws.onopen = () => {
    //       // resolve(ws);
    //       console.log('webs socket open');
    //     }
    //     ws.onmessage = (event => {
    //       const res = JSON.parse(event?.data);
    //       const data = typeof res == "object" ? res.content : "";
    //       resolve(data);
    //     }) 
    //     ws.onerror = (err) => {
    //       reject(err);
    //     }
        
    //   })
    // ws.onmessage = (async event => {
    //   const res = JSON.parse(event?.data);
    //   const data = typeof res == "object" ? res.content : "";
    //   console.log('data',data);
    //   // return () => { 
    //     dataApi = data;

    //     // return ws.close(); 
    //     // return data;
    //   // }  
    // })


    // console.log('data api',dataApi);
  }
)

export const getBtcData = createAsyncThunk(
  'btcData',
  async (value) => {
    const data = await fetch(BTC_URL(value));
    const res = await data.json();
    return res.data;
  }
)


export const BitcoinData = createSlice({
  name: 'bitcoin',
  initialState: {
    webSocketData: '',
    btcData:{ last: '', priceChange: '', percentageChange: '' },
  },
  reducers: {
    setWebSocketData: (state,payload) => {
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
      const ws = new WebSocket(SOCKET_URL);
      const getValue = (value) => value; 
      ws.onopen = () => {
          console.log('webs socket open');
      }
      ws.onmessage = (event => {
        const res = JSON.parse(event?.data);
        const data = typeof res == "object" ? res.content : "";
        console.log(typeof data);
        if(typeof res == 'object'){
          BitcoinData.actions.setWebSocketData('hello');
        }
      }) 
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