import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import Home from './components/Home';
import CryptoList from './components/CryptoList';
import CryptoDetails from './components/CryptoDetails';
import CryptoCompare from './components/CryptoCompare';
import { setSearchTerm, fetchCoinList } from './features/cryptoSlice';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.crypto.searchTerm);

  useEffect(() => {
    dispatch(fetchCoinList({ page: 1 })); // Fetch first 10 coins
  }, [dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <h1>Cryptoverse</h1>
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/cryptocurrencies" className={({ isActive }) => (isActive ? 'active' : '')}>
                All Currencies
              </NavLink>
            </li>
            <li>
              <NavLink to="/compare" className={({ isActive }) => (isActive ? 'active' : '')}>
                Compare
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="main-content">
          <header className="App-header">
            <h1>Cryptoverse</h1>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cryptocurrencies" element={<CryptoList />} />
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
            <Route path="/compare" element={<CryptoCompare />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;