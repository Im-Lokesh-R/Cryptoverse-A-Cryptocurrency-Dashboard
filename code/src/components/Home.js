import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData, fetchGlobalData } from '../features/cryptoSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { coins, globalData, loading } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoData({ page: 1, perPage: 12 }));
    dispatch(fetchGlobalData());
  }, [dispatch]);

  if (loading || !globalData) return <div>Loading...</div>;

  return (
    <div className="home">
      <h2>Global Crypto Stats</h2>
      <div className="global-stats">
        <div className="stat-card card">
          <h3>Total Market Cap</h3>
          <p>${globalData.total_market_cap.usd.toLocaleString()}</p>
        </div>
        <div className="stat-card card">
          <h3>Total Volume (24h)</h3>
          <p>${globalData.total_volume.usd.toLocaleString()}</p>
        </div>
        <div className="stat-card card">
          <h3>Active Cryptocurrencies</h3>
          <p>{globalData.active_cryptocurrencies.toLocaleString()}</p>
        </div>
        <div className="stat-card card">
          <h3>Market Cap Change (24h)</h3>
          <p>{globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%</p>
        </div>
      </div>
      <h3>Top 10 Cryptocurrencies</h3>
      <div className="crypto-grid">
        {coins.slice(0, 10).map((coin) => (
          <Link key={coin.id} to={`/crypto/${coin.id}`} className="crypto-card card">
            <img src={coin.image} alt={coin.name} width="50" />
            <h4>{coin.name}</h4>
            <p>Price: ${coin.current_price}</p>
            <p>24h Change: {coin.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;