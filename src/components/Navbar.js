import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          FMS
        </Typography>
        <Container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            component={Link} 
            to="/" 
            sx={{
              color: 'white', 
              '&:hover': { color: 'lightblue' },
              mr: 2 // margin right for spacing
            }}
          >
            Dashboard
          </Button>
          <Button 
            component={Link} 
            to="/loan-management" 
            sx={{
              color: 'white', 
              '&:hover': { color: 'lightblue' },
              mr: 2
            }}
          >
            Loan Management
          </Button>
          <Button 
            component={Link} 
            to="/payment-tracking" 
            sx={{
              color: 'white', 
              '&:hover': { color: 'lightblue' },
              mr: 2
            }}
          >
            Payment Tracking
          </Button>
          <Button 
            component={Link} 
            to="/payment" 
            sx={{
              color: 'white', 
              '&:hover': { color: 'lightblue' }
            }}
          >
            Payment
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
