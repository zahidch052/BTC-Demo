import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import { useSelector, useDispatch } from 'react-redux';
import "./App.css";
import { SERIES_DATA, SERIES_DATA_OLD } from './helper/constants';
import { SOCKET_URL } from './helper/constants';
import { getWsData, getBtcData } from './redux/actions';
import { setWebSocketData } from './redux/slice';


const seriesDataOld = SERIES_DATA_OLD;

const seriesData = SERIES_DATA;

const App = () => {
  const handlConverter = () => {
    let series =
      typeof (seriesData) == "undefined" ? [] : seriesData.map(({ datetime, low, high, open, close }) => {
        let yaxis = [];
        yaxis.push(low, high, open, close);
        return {
          x: new Date(datetime),
          y: yaxis
        }
      })
    return series;
  }
  const addDays = (date) => {
    // console.log(days);
    let days = Math.floor(Math.random() * 999999);
    console.log(days);
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  const [newDat, setDat] = useState([]);
  const [series] = useState(() => {
    const dat = handlConverter();
    console.log(dat);
    return {
      series: [{
        data: dat,
      }],
      options: {
        chart: {
          type: 'candlestick',
          height: 350
        },
        title: {
          text: 'CandleStick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: false
          }
        }

      }
    }
  });
  const wsdata = useSelector((state) => state.btc.webSocketData);
  const valuebtc = useSelector((state) => state.btc.btcData);
  const dispatch = useDispatch();

  const updateFresh = () => {
    const ws = new WebSocket(SOCKET_URL);
    ws.onmessage = (event => {
      const res = JSON.parse(event?.data);
      const data = typeof res == "object" ? res.content : "";
      if (typeof data == 'object') {
        dispatch(setWebSocketData(data))
      }
    })
  }

  useEffect(() => {
    if (typeof wsdata !== "object") {
      dispatch(getWsData());
    }
    updateFresh();
  }, [])

  const handleKeypress = async (event) => {
    if (event.key === 'Enter') {
      dispatch(getBtcData(event.target.value));
    }
  }

  return (

    <div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <input type="text" onKeyPress={handleKeypress} />
        <p style={{ color: "red" }}>{`${valuebtc?.last}${valuebtc?.priceChange}${valuebtc?.percentageChange}`}</p>
      </div>
      <div id="chart" style={{ display: "flex" }} >
        <Chart options={series.options} series={series.series} type="candlestick" height={350}
          width={700} />
        <table>
          <tr>
            <th style={{ textAlign: "left" }}>Volume</th>
            <th style={{ textAlign: "right" }}>Bid</th>
            <th>Ask</th>
            <th style={{ textAlign: "right" }}>Volume</th>
          </tr>

          {typeof wsdata === "object" ?
            wsdata?.map(d => {
              return (
                <tr>
                  <td style={{ background: "#00800073", color: "#fff", textAlign: "left" }}>{d?.bidQuantity?.toFixed(3)}</td>
                  <td style={{ background: "#00800073", color: "#fff", textAlign: "right" }}>{d?.bid?.toFixed(3)}</td>
                  <td style={{ background: "#ff00009c", color: "#fff", textAlign: "right" }}>{d?.ask?.toFixed(3)}</td>
                  <td style={{ background: "#ff00009c", color: "#fff", textAlign: "right" }}>{d?.askQuantity?.toFixed(3)}</td>
                </tr>
              )
            }) : ""}
        </table>
      </div>
    </div>
  );


}
export default App
