// src/components/Navbar.js (Updated)
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../features/cryptoSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.crypto.searchTerm);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <nav className="navbar">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/cryptocurrencies" activeClassName="active">
            All Currencies
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;