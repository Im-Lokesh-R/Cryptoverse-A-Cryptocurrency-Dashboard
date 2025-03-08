import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCryptoDetails, fetchCryptoHistory } from '../features/cryptoSlice';
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
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const CryptoDetails = () => {
  const { coinId } = useParams();
  const dispatch = useDispatch();
  const coinDetails = useSelector((state) => state.crypto.coinDetails[coinId]);
  const history = useSelector((state) => state.crypto.history[coinId]);
  const loading = useSelector((state) => state.crypto.loading);
  const [timeFrame, setTimeFrame] = useState('30');

  useEffect(() => {
    dispatch(fetchCryptoDetails(coinId));
    dispatch(fetchCryptoHistory({ coinId, days: timeFrame }));
  }, [dispatch, coinId, timeFrame]);

  if (loading || !coinDetails || !history) return <div>Loading...</div>;

  const is24Hours = timeFrame === '0.0417';
  const labels = history.prices.map((price) => {
    const date = new Date(price[0]);
    return is24Hours
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Price (USD)',
        data: history.prices.map((price) => price[1]),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${coinDetails.name} Price History`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: is24Hours ? 'Time (24h)' : 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
      },
    },
  };

  return (
    <div className="crypto-details">
      <h2>{coinDetails.name}</h2>
      <img src={coinDetails.image.large} alt={coinDetails.name} width="100" />
      <p>Current Price: ${coinDetails.market_data.current_price.usd}</p>
      <p>Market Cap: ${coinDetails.market_data.market_cap.usd.toLocaleString()}</p>
      <div>
        <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="0.0417">24 Hours</option>
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="365">1 Year</option>
          <option value="1825">5 Years</option>
        </select>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="coin-stats-container">
        <div className="coin-stats">
          <h3>Additional Details</h3>
          <p>24h High: ${coinDetails.market_data.high_24h.usd.toLocaleString()}</p>
          <p>24h Low: ${coinDetails.market_data.low_24h.usd.toLocaleString()}</p>
          <p>Circulating Supply: {coinDetails.market_data.circulating_supply.toLocaleString()}</p>
          <p>Total Supply: {coinDetails.market_data.total_supply?.toLocaleString() || 'N/A'}</p>
          <p>All-Time High: ${coinDetails.market_data.ath.usd.toLocaleString()}</p>
          <p>All-Time Low: ${coinDetails.market_data.atl.usd.toLocaleString()}</p>
        </div>
      </div>
      <div className="coin-links">
        <h3>Links</h3>
        <a href={coinDetails.links.homepage[0]} target="_blank" rel="noopener noreferrer">
          Website
        </a>
        <a
          href={`https://www.coinbase.com/price/${coinDetails.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="buy-link"
        >
          Buy {coinDetails.name}
        </a>
      </div>
    </div>
  );
};

export default CryptoDetails;