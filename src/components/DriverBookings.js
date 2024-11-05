// DriverBookings.js
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import './DriverBookings.css';
import { useNavigate } from 'react-router-dom';

import car1 from '../assets/car1.png';
import car2 from '../assets/car2.png';
import car3 from '../assets/car3.png';
import car4 from '../assets/car4.png';
import car5 from '../assets/car5.png';
import car6 from '../assets/car6.png';

const carImages = [car1, car2, car3, car4, car5, car6];

function DriverBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/bookings/driver', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <NavBar userType="driver" />
      <h2 id="headinggg2">My Bookings</h2>
      <Container className="driver-bookings-container">
        
        <div className="bookings-container">
          <div className="neon-row">
            {bookings.filter((booking) => booking.activeBooking).length > 0 ? (
              bookings
                .filter((booking) => booking.activeBooking)
                .map((booking) => {
                  const car = booking.carID;
                  const rentalDays = calculateDays(booking.startDate, booking.endDate) || 1;
                  const totalCost = rentalDays * car.pricePerDay;
                  const randomImage = carImages[Math.floor(Math.random() * carImages.length)];

                  return (
                    <div key={booking._id} className="neon-card-container">
                      <div className="neon-card">
                        <div className="neon-img-content">
                          <img src={randomImage} alt={`${car.make} ${car.model}`} className="neon-card-image" />
                        </div>
                        <div className="neon-content">
                          <h3 className="neon-heading">{car.make} {car.model}</h3>
                          <p className="neon-text-body">
                            Booked dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()} <br />
                            <b>Total Price: R{totalCost}</b>
                          </p>
                          <div className="neon-buttons">
                            <button className="neon-card-button">View Key</button>
                            <button
                              className="neon-card-button"
                              onClick={() => navigate('/return-car', { state: { bookingId: booking._id, car } })}
                            >
                              Return Car
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p>No active bookings found.</p>
            )}
          </div>
        </div>
      </Container>
      <div className="wave-section">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
}

export default DriverBookings;
