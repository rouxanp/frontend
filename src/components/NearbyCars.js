// NearbyCars.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './NearbyCars.css';
import L from 'leaflet';

import car1 from '../assets/car1.png';
import car2 from '../assets/car2.png';
import car3 from '../assets/car3.png';
import car4 from '../assets/car4.png';
import car5 from '../assets/car5.png';
import car6 from '../assets/car6.png';

const carImages = [car1, car2, car3, car4, car5, car6];

// Fix default marker icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3967/3967049.png',
  shadowUrl: 'https://cdn-icons-png.flaticon.com/512/3967/3967049.png',
  iconSize: [45, 60],
});

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2536/2536745.png',
  iconSize: [45, 60],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

function NearbyCars() {
  const [cars, setCars] = useState([]);
  const startLocation = JSON.parse(localStorage.getItem('startLocation'));
  const navigate = useNavigate();

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    let rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (rentalDays === 0) {
      rentalDays = 1;
    }
    return rentalDays;
  };

  const fetchNearbyCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars/nearby`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          latitude: startLocation.lat,
          longitude: startLocation.lng,
        },
      });

      if (response.data.cars.length === 0) {
        alert("Sorry! There are currently no cars near you!");
        navigate('/driver-dashboard');
      } else {
        setCars(response.data.cars);
      }
    } catch (error) {
      console.error('Error fetching nearby cars:', error);
    }
  };

  const handleRentCar = async (carID) => {
    try {
      const token = localStorage.getItem('token');
      const startDate = localStorage.getItem('startDate');
      const endDate = localStorage.getItem('endDate');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings/create`,
        { carID, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Booking successful! Booking ID: ${response.data.booking.bookingID}`);
      navigate('/driver-bookings');
    } catch (error) {
      console.error('Error renting car:', error);
      alert('Error renting car. Please try again.');
    }
  };

  useEffect(() => {
    fetchNearbyCars();
  }, []);

  return (
    <>
      <NavBar userType="driver" />
      <Container className="nearby-cars-container">
        <h2 className="mb-4">Cars Near You</h2>
        <Row>
          <Col md={6}>
            <MapContainer
              center={startLocation ? [startLocation.lat, startLocation.lng] : [-26.2041, 28.0473]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {startLocation && (
                <Marker position={startLocation} icon={greenIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              {cars.map((car) => (
                <Marker key={car.carID} position={JSON.parse(car.location)}>
                  <Popup>
                    <strong>{car.make} {car.model}</strong> <br />
                    R{car.pricePerDay}/day <br />
                    Mileage: {car.mileage} km
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Col>

          <Col md={6}>
            <div className="car-list">
              {cars.map((car) => {
                const startDate = localStorage.getItem('startDate');
                const endDate = localStorage.getItem('endDate');
                const rentalDays = calculateDays(startDate, endDate);
                const totalCost = rentalDays * car.pricePerDay;
                const randomImage = carImages[Math.floor(Math.random() * carImages.length)];

                return (
                  <div key={car.carID} className="card2">
                    <img src={randomImage} alt="Car" className="card-image" />
                    <div className="card-details">
                      <h4 className="text-title">{car.make} {car.model}</h4>
                      <p className="text-body">
                        Transmission: {car.transmission} <br />
                        Mileage: {car.mileage} km <br />
                        Price/Day: R{car.pricePerDay} <br />
                        <strong>Total Price: R{totalCost}</strong>
                      </p>
                    </div>
                    <button
                      className="card-button"
                      onClick={() => handleRentCar(car._id)}
                    >
                      Rent Now
                    </button>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Wave Background Section */}
      <div className="wave-section">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
}

export default NearbyCars;
