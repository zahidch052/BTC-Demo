import {BTC_URL,WS_BTC_DATA} from '../helper/constants';
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getWsData = createAsyncThunk(
  'wsData',
  async () => {
    const data = await fetch(WS_BTC_DATA);
    const res = await data.json();
    return res.data;
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
