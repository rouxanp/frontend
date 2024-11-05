import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar({ userType }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  return (
    <div className="navbar-container">
      <div className="tabs">
        {/* Logo */}
        <div className="logo">
          <span><h2>Caro</h2></span>
        </div>

        {userType === 'driver' ? (
          <>
            <NavLink
              to="/driver-dashboard"
              className="tab"
              // activeClassName="active-tab"
            >
              Book
            </NavLink>
            <NavLink
              to="/driver-bookings"
              className="tab"
              // activeClassName="active-tab"
            >
              Bookings
            </NavLink>
            <NavLink
              to="/driver-account"
              className="tab"
              // activeClassName="active-tab"
            >
              Account
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/cars"
              className="tab"
              // activeClassName="active-tab"
            >
              Cars
            </NavLink>
            <NavLink
              to="/add-car"
              className="tab"
              // activeClassName="active-tab"
            >
              Add Car
            </NavLink>
            <NavLink
              to="/owner-account"
              className="tab"
              // activeClassName="active-tab"
            >
              Account
            </NavLink>
          </>
        )}

        <button onClick={handleLogout} className="tab logout-tab">
          Logout
        </button>


      </div>
    </div>
  );
}

export default NavBar;
