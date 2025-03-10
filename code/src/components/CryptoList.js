import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../features/cryptoSlice';
import { Link } from 'react-router-dom';

const CryptoList = () => {
  const dispatch = useDispatch();
  const { coins, loading, searchTerm } = useSelector((state) => state.crypto);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 50;
  const coinsPerPage = 20;

  useEffect(() => {
    dispatch(fetchCryptoData({ page: currentPage, perPage: coinsPerPage }));
  }, [dispatch, currentPage]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="crypto-list">
      <h3>All Cryptocurrencies</h3> {/* Match Home's h3 */}
      <div className="crypto-grid">
        {filteredCoins.map((coin) => (
          <Link key={coin.id} to={`/crypto/${coin.id}`} className="crypto-card card">
            <img src={coin.image} alt={coin.name} width="50" />
            <h4>{coin.name}</h4>
            <p>Price: ${coin.current_price}</p>
            <p>24h Change: {coin.price_change_percentage_24h.toFixed(2)}%</p>
            <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CryptoList;