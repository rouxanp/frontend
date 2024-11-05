import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import { FaUser, FaEnvelope, FaIdCard, FaCarSide } from 'react-icons/fa';
import './OwnerAccount.css';

function OwnerAccount() {
  const [userInfo, setUserInfo] = useState({});
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [editData, setEditData] = useState({}); // Track edited data

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(userResponse.data);
        setEditData(userResponse.data); // Preload edit data with current info
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/update`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data.user); // Update displayed user info
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <>
      <NavBar userType="owner" />
      <Container className="owner-account-container">
        <h2>Your Profile</h2>
        <div className="profile-container-owner">
          <div className="profile-info-owner">
            <FaUser className="profile-info-owner-icon" />
            {editMode ? (
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="profile-input"
              />
            ) : (
              <span>{userInfo.name}</span>
            )}
          </div>
          <div className="profile-info-owner">
            <FaUser className="profile-info-owner-icon" />
            {editMode ? (
              <input
                type="text"
                name="surname"
                value={editData.surname}
                onChange={handleInputChange}
                placeholder="Surname"
                className="profile-input"
              />
            ) : (
              <span>{userInfo.surname}</span>
            )}
          </div>
          <div className="profile-info-owner">
            <FaEnvelope className="profile-info-owner-icon" />
            {editMode ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="profile-input"
              />
            ) : (
              <span>Email: {userInfo.email}</span>
            )}
          </div>
          <div className="profile-info-owner">
            <FaIdCard className="profile-info-owner-icon" />
            {editMode ? (
              <input
                type="text"
                name="idNumber"
                value={editData.idNumber}
                onChange={handleInputChange}
                placeholder="ID Number"
                className="profile-input"
              />
            ) : (
              <span>ID Number: {userInfo.idNumber}</span>
            )}
          </div>
          <div className="profile-info-owner">
            <FaCarSide className="profile-info-owner-icon" />
            {editMode ? (
              <input
                type="text"
                name="licenseNumber"
                value={editData.licenseNumber}
                onChange={handleInputChange}
                placeholder="License Number"
                className="profile-input"
              />
            ) : (
              <span>License No.: {userInfo.licenseNumber}</span>
            )}
          </div>
          <Button
            className="edit-profile-btn"
            onClick={editMode ? handleSaveClick : handleEditClick}
          >
            {editMode ? 'Save' : 'Edit Profile'}
          </Button>
        </div>
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

export default OwnerAccount;
