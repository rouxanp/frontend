// OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import NavBar from './NavBar';
import axios from 'axios';
import './OwnerDashboard.css';

import car1 from '../assets/car1.png';
import car2 from '../assets/car2.png';
import car3 from '../assets/car3.png';
import car4 from '../assets/car4.png';
import car5 from '../assets/car5.png';
import car6 from '../assets/car6.png';

const carImages = [car1, car2, car3, car4, car5, car6];

const OwnerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [editMode, setEditMode] = useState(null); // Tracks the car being edited
  const [editData, setEditData] = useState({}); // Holds the editable data

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("https://carocommutebackend-e105b94578b8.herokuapp.com/api/cars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        setCars(response.data.cars);
      } else {
        console.error('Error: No car data found in response');
      }
    } catch (error) {
      console.error('Error fetching cars:', error.response?.data?.message || error.message);
    }
  };

  const deleteCar = async (carID) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://carocommutebackend-e105b94578b8.herokuapp.com/api/cars/${carID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars(cars.filter((car) => car.carID !== carID));
    } catch (error) {
      console.error('Error deleting car:', error.response?.data?.message || error.message);
    }
  };

  const handleEditClick = (car) => {
    setEditMode(car.carID); // Sets the car in edit mode
    setEditData(car); // Preloads existing car data
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveCarChanges = async (carID) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://carocommutebackend-e105b94578b8.herokuapp.com/api/cars/${carID}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars(cars.map((car) => (car.carID === carID ? { ...car, ...editData } : car)));
      setEditMode(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating car:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <>
      <NavBar userType="owner" />
      <Container className="od-dashboard-container">
        <h2 className="od-title">My Cars</h2>
        <Row>
          <Col md={6}>
            <MapContainer
              center={[-26.2041, 28.0473]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {cars.map((car) => {
                let position;
                try {
                  position = JSON.parse(car.location);
                } catch (error) {
                  console.error('Error parsing car location:', error);
                  return null;
                }

                return (
                  <Marker key={car.carID} position={position}>
                    <Popup>
                      <strong>{car.make} {car.model}</strong> {car.rented ? "🔴" : "🟢"} <br />
                      R{car.pricePerDay}/day <br />
                      Mileage: {car.mileage} km
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Col>

          <Col md={6}>
            <div className="od-car-list">
              {cars.map((car) => {
                const randomImage = carImages[Math.floor(Math.random() * carImages.length)];

                return (
                  <div key={car.carID} className="od-card">
                    <img src={randomImage} alt="Car" className="od-card-image" />
                    <div className="od-card-details">
                      {editMode === car.carID ? (
                        <>
                          <input
                            name="make"
                            value={editData.make || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <input
                            name="model"
                            value={editData.model || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <input
                            name="transmission"
                            value={editData.transmission || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <input
                            name="pricePerDay"
                            type="number"
                            value={editData.pricePerDay || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <input
                            name="mileage"
                            type="number"
                            value={editData.mileage || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <input
                            name="registrationNumber"
                            value={editData.registrationNumber || ''}
                            onChange={handleInputChange}
                            className="od-card-input"
                          />
                          <button
                            className="od-card-button od-save-button"
                            onClick={() => saveCarChanges(car.carID)}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="od-text-body">
                            <strong className="od-text-title">{car.make} {car.model}</strong> {car.rented ? "🔴" : "🟢"} <br />
                            Transmission: {car.transmission} <br />
                            Price/Day: R{car.pricePerDay} <br />
                            Mileage: {car.mileage} km <br />
                            Registration: {car.registrationNumber} <br />
                          </p>
                          <div className="od-card-buttons">
                            <button
                              className="od-card-button od-edit-button"
                              onClick={() => handleEditClick(car)}
                            >
                              Edit
                            </button>
                            <button
                              className="od-card-button od-delete-button"
                              onClick={() => deleteCar(car.carID)}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
      <div className="wave-section">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
};

export default OwnerDashboard;
