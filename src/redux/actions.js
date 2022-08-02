// import {setWebSocketData , setBTCData} from './slice';
// import {useDispatch } from 'react-redux';
import {SOCKET_URL} from '../helper/constants';
import {BTC_URL} from '../helper/constants';
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getWsData = createAsyncThunk(
  'wsData',
  async (thunkAPI) => {
    let dataApi = '';
    const ws = new WebSocket(SOCKET_URL);
    ws.onmessage = (async event => {
      const res = await JSON.parse(event?.data);
      const data = typeof res == "object" ? res.content : "";
      //console.log( (res?.content[0]?.bidQuantity)?.toFixed(3));
      dataApi = data;
      return () => {
        ws.close();
      }
    });
    console.log(dataApi);
    return dataApi;
  }
)

export const getBtcData = createAsyncThunk(
  'btcData',
  async (value , thunkAPI) => {
    const data = await fetch(BTC_URL(value));
    const res = await data.json();
    return res.data;
  }
)


// export const wsData = (dispatch) => {
    // const socketUrl = SOCKET_URL;
    // //   const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    //   const ws = new WebSocket(socketUrl);
    //   ws.onmessage = (event => {
    //     const res = JSON.parse(event?.data);
    //     const data = typeof res == "object" ? res.content : "";
    //     //console.log( (res?.content[0]?.bidQuantity)?.toFixed(3));
    //     dispatch(setWebSocketData(data));
    //     return () => {
    //       ws.close();
    //     };
    // })
// }

// export const btcData = async (dispatch,payload) => {
  // try{
  //   const data = await fetch(BTC_URL(payload));
  //   const res = await data.json();
  //   // state.btcData = res ? res.data : state.btcData ; 
  //   dispatch(setBTCData(res.data));
  // } catch (err) {
  //   console.log(err);
  // }
// }
