import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDetails, fetchCryptoHistory, fetchCoinList } from '../features/cryptoSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoCompare = () => {
  const dispatch = useDispatch();
  const { coinDetails, history, coinList, loading } = useSelector((state) => state.crypto);
  const [coin1, setCoin1] = useState('');
  const [coin2, setCoin2] = useState('');
  const [timeFrame, setTimeFrame] = useState('30');

  // Fetch the coin list when the component mounts if not already fetched
  useEffect(() => {
    if (!coinList.length) {
      dispatch(fetchCoinList());
    }
  }, [dispatch, coinList]);

  // Fetch data when selections change
  useEffect(() => {
    if (coin1 && coin2 && coin1 !== coin2) {
      dispatch(fetchCryptoDetails(coin1));
      dispatch(fetchCryptoDetails(coin2));
      dispatch(fetchCryptoHistory({ coinId: coin1, days: timeFrame }));
      dispatch(fetchCryptoHistory({ coinId: coin2, days: timeFrame }));
    }
  }, [coin1, coin2, timeFrame, dispatch]);

  // Prepare chart data
  const getChartData = () => {
    if (!history[coin1] || !history[coin2] || !coinDetails[coin1] || !coinDetails[coin2]) {
      return null;
    }

    const labels = history[coin1].prices.map((price) =>
      new Date(price[0]).toLocaleDateString()
    );
    const data1 = history[coin1].prices.map((price) => price[1]);
    const data2 = history[coin2].prices.map((price) => price[1]);

    return {
      labels,
      datasets: [
        {
          label: `${coinDetails[coin1].name} Price (USD)`,
          data: data1,
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          tension: 0.1,
        },
        {
          label: `${coinDetails[coin2].name} Price (USD)`,
          data: data2,
          borderColor: '#00FF00',
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          tension: 0.1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Cryptocurrency Price Comparison',
      },
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { title: { display: true, text: 'Price (USD)' } },
    },
  };

  if (loading) return <div>Loading...</div>;

  const chartData = getChartData();

  return (
    <div className="crypto-compare">
      <h2>Compare Cryptocurrencies</h2>
      <div className="selection-container">
        <select value={coin1} onChange={(e) => setCoin1(e.target.value)}>
          <option value="">Select First Coin</option>
          {coinList.map((coin) => (
            <option key={coin.id} value={coin.id} disabled={coin.id === coin2}>
              {coin.name}
            </option>
          ))}
        </select>
        <select value={coin2} onChange={(e) => setCoin2(e.target.value)}>
          <option value="">Select Second Coin</option>
          {coinList.map((coin) => (
            <option key={coin.id} value={coin.id} disabled={coin.id === coin1}>
              {coin.name}
            </option>
          ))}
        </select>
        <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="0.0417">24 Hours</option>
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="365">1 Year</option>
          <option value="1825">5 Years</option>
        </select>
      </div>
      {chartData && coinDetails[coin1] && coinDetails[coin2] ? (
        <div>
          <div className="compare-stats">
            <p>{coinDetails[coin1].name} Current Price: ${coinDetails[coin1].market_data.current_price.usd}</p>
            <p>{coinDetails[coin2].name} Current Price: ${coinDetails[coin2].market_data.current_price.usd}</p>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p>Please select two different cryptocurrencies to compare.</p>
      )}
    </div>
  );
};

export default CryptoCompare;