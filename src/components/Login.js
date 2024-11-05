import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import WelcomeBar from './WelcomeBar';
import axios from 'axios';
import './Login.css';


function Login() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      // Store token and user information
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on user type
      if (response.data.user.userType === 'driver') {
        navigate('/driver-dashboard');
        window.location.reload();
      } else if (response.data.user.userType === 'owner') {
        navigate('/owner-dashboard');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during login:', error.response.data.message);
    }
  };

  const switchToSignUp = () => setView('signup');

  if (view === 'signup') {
    navigate('/signup');
  }

  return (
    <>
      <WelcomeBar />
      <div className="background-container">
        {/* Wave layers */}
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        
        

        {/* Login Form Container */}
        <Container className="login-container mt-5 pt-5 p-4 rounded shadow col-6">
          <h2 className="mb-4">Let’s get you back in</h2>
          <ToggleButtonGroup
            type="radio"
            name="view"
            value={view}
            onChange={switchToSignUp}
            className="mb-4"
          >
            <ToggleButton id="tbg-radio-login" variant="outline-primary" value="login">
              Login
            </ToggleButton>
            <ToggleButton id="tbg-radio-signup" variant="outline-primary" value="signup">
              Sign Up
            </ToggleButton>
          </ToggleButtonGroup>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default Login;
