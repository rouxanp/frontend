import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import './DriverAccount.css';

function DriverAccount() {
  const [userInfo, setUserInfo] = useState({});
  const [pastBookings, setPastBookings] = useState([]);
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [editData, setEditData] = useState({}); // New state for editable data

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        setEditData(response.data); // Initialize editData with the user's current info

        // Fetch driver-specific bookings
        const bookingsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/driver`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter past bookings (where activeBooking is false)
        const filteredPastBookings = bookingsResponse.data.bookings.filter(
          (booking) => booking.activeBooking === false
        );
        setPastBookings(filteredPastBookings);
      } catch (error) {
        console.error('Error fetching user info or bookings:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditClick = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value }); // Update editData with the input changes
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/users/update`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(editData); // Update userInfo with the edited data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false); // Exit edit mode without saving
    setEditData(userInfo); // Reset editData to original userInfo
  };

  return (
    <>
      <NavBar userType="driver" />
      <Container className="driver-account-container">
        <h2>Your Profile</h2>
        <Row>
          <Col md={6}>
            <div className="profile-container">
              <FaUser size={50} className="me-3" />
              <div>
                {editMode ? (
                  <>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={editData.name || ''}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      name="surname"
                      placeholder="Surname"
                      value={editData.surname || ''}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={editData.email || ''}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      name="idNumber"
                      placeholder="ID Number"
                      value={editData.idNumber || ''}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Control
                      type="text"
                      name="licenseNumber"
                      placeholder="License Number"
                      value={editData.licenseNumber || ''}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Button variant="success" onClick={handleSaveClick} className="me-2">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <h3>{userInfo.name} {userInfo.surname}</h3>
                    <p>Email: {userInfo.email}</p>
                    <p>ID Number: {userInfo.idNumber}</p>
                    <p>License Number: {userInfo.licenseNumber}</p>
                    <Button variant="primary" onClick={handleEditClick}>
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="past-bookings">
              <FaCalendarAlt size={50} className="me-3" />
              <div>
                <h3>Past Bookings</h3>
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div key={booking._id} className="past-booking-entry">
                      {booking.carID ? (
                        <p>
                          {booking.carID.make} {booking.carID.model} - Booked: {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()} <br />
                          Total Cost: R{booking.carID.pricePerDay * ((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24) || 1)}
                        </p>
                      ) : (
                        <p>Car deleted - Booked: {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No past bookings</p>
                )}
              </div>
            </div>
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

export default DriverAccount;
