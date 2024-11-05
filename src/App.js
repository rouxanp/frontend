import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DriverDashboard from './components/DriverDashboard'; 
import AddCar from './components/AddCar';
import OwnerDashboard from './components/OwnerDashboard';
import NearbyCars from './components/NearbyCars';
import DriverAccount from './components/DriverAccount';
import OwnerAccount from './components/OwnerAccount';
import DriverBookings from './components/DriverBookings';
import ReturnCar from './components/ReturnCar';


function App() {
  const [userType, setUserType] = useState(null); // State to store user type
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is authenticated

  useEffect(() => {
    // Check for stored user info and token on app load
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUserType(storedUser.userType);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes - Redirect to respective dashboards based on user type */}
        {isAuthenticated && (
          <>
            {/* Redirect to owner dashboard if userType is 'owner' */}
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            
            {/* Redirect to driver dashboard if userType is 'driver' */}
            <Route path="/driver-dashboard" element={<DriverDashboard />} />

            {/* Additional Owner Routes */}
            {userType === 'owner' && (
              <>
                <Route path="/add-car" element={<AddCar />} />
                <Route path="/cars" element={<OwnerDashboard />} />
                <Route path="/owner-account" element={<OwnerAccount />} />
              </>
            )}

            {/* Additional Driver Routes */}
            {userType === 'driver' && (
              <>
                
                <Route path="/nearby-cars" element={<NearbyCars />} />
                <Route path="/driver-account" element={<DriverAccount />} />
                <Route path="/driver-bookings" element={<DriverBookings />} />
                <Route path="/return-car" element={<ReturnCar />} />
              </>
            )}

            {/* Default Redirect based on user type */}
            {/* <Route
              path="/dashboard"
              element={
                userType === 'owner' ? (
                  <Navigate to="/owner-dashboard" />
                ) : (
                  <Navigate to="/driver-dashboard" />
                )
              }
            /> */}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
