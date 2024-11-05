
import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ReturnCar.css';

// Fix default marker icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ReturnCar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, car } = location.state; 

  const [currentLocation, setCurrentLocation] = useState(null);
  const [newMileage, setNewMileage] = useState('');

  // Custom map component for selecting a location
  function LocationSelector() {
    useMapEvents({
      click(e) {
        setCurrentLocation(e.latlng); 
      },
    });

    return currentLocation === null ? null : <Marker position={currentLocation} />;
  }

  // Handle form submission to return the car
  const handleReturnCar = async () => {
    if (!currentLocation || !newMileage) {
      alert('Please select the car location and enter the new mileage.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings/return`,
        {
          bookingId,
          newLocation: currentLocation,
          newMileage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Car returned successfully!');
      navigate('/driver-bookings');
    } catch (error) {
      console.error('Error returning car:', error);
    }
  };

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Return Car</h2>
        <Row>
          <Col md={8}>
            <MapContainer
              center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationSelector />
            </MapContainer>
          </Col>

          <Col md={4}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>New Mileage</Form.Label>
                <Form.Control
                  type="number"
                  value={newMileage}
                  onChange={(e) => setNewMileage(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" className="w-100 mt-3" onClick={handleReturnCar}>
                Return Car
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      {/* Wave Background Section with Overlay */}
      <div className="wave-section">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
}

export default ReturnCar;
