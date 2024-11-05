// DriverDashboard.js
import React, { useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';
import './DriverDashboard.css';

function DriverDashboard() {
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartMarkerSelected, setIsStartMarkerSelected] = useState(true);
  const navigate = useNavigate();

  function LocationSelector() {
    useMapEvents({
      click(e) {
        if (isStartMarkerSelected) {
          setStartLocation(e.latlng);
        } else {
          setDestinationLocation(e.latlng);
        }
      },
    });

    return (
      <>
        {startLocation && <Marker position={startLocation} />}
        {destinationLocation && <Marker position={destinationLocation} />}
      </>
    );
  }

  const handleFindCars = async () => {
    if (!startLocation || !destinationLocation || !startDate || !endDate) {
      alert('Please fill in all the details and select both locations');
      return;
    }
  
    localStorage.setItem('startLocation', JSON.stringify(startLocation));
    localStorage.setItem('destinationLocation', JSON.stringify(destinationLocation));
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/cars/nearby', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          latitude: startLocation.lat,
          longitude: startLocation.lng,
        },
      });
  
      if (response.data.cars.length === 0) {
        alert("Sorry! There are currently no cars near you.");
        navigate('/driver-dashboard');
      } else {
        navigate('/nearby-cars');
      }
    } catch (error) {
      console.error('Error checking for nearby cars:', error);
      alert('Could not check for nearby cars. Please try again.');
    }
  };

  return (
    <>
      <NavBar userType="driver" />
      <h2 className="mb-4" id="headinggg">Make a Booking</h2>
      <Container className="dashboard-container mt-4">
        
        <Row>
          <Col md={8}>
            <div className="marker-selection mt-3">
              <button
                className={`location-button ${isStartMarkerSelected ? 'active' : ''}`}
                onClick={() => setIsStartMarkerSelected(true)}
              >
                Select Start Location
              </button>
              <button
                className={`location-button ${!isStartMarkerSelected ? 'active' : ''}`}
                onClick={() => setIsStartMarkerSelected(false)}
              >
                Select Destination
              </button>
            </div>
            <MapContainer
              center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
              zoom={13}
              style={{ height: '400px', width: '100%' }}
              className="map-container"
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
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="find-cars-container">
                <input type="checkbox" id="findCarsCheckbox" />
                <label onClick={handleFindCars} htmlFor="findCarsCheckbox" className="find-cars-button">
                  <span className="icon">
                    <svg viewBox="0 0 30.143 30.143" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path d="M20.034,2.357v3.824c3.482,1.798,5.869,5.427,5.869,9.619c0,5.98-4.848,10.83-10.828,10.83 c-5.982,0-10.832-4.85-10.832-10.83c0-3.844,2.012-7.215,5.029-9.136V2.689C4.245,4.918,0.731,9.945,0.731,15.801 c0,7.921,6.42,14.342,14.34,14.342c7.924,0,14.342-6.421,14.342-14.342C29.412,9.624,25.501,4.379,20.034,2.357z" />
                        <path d="M14.795,17.652c1.576,0,1.736-0.931,1.736-2.076V2.08c0-1.148-0.16-2.08-1.736-2.08 c-1.57,0-1.732,0.932-1.732,2.08v13.496C13.062,16.722,13.225,17.652,14.795,17.652z" />
                      </g>
                    </svg>
                  </span>
                </label>
                <h4 className="find-cars-button-text">Find Cars</h4>
              </div>
            </Form>
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
}

export default DriverDashboard;
