import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1, }}>
          OBSS Hire App
        </Typography>
        <Button component={Link} to={`/profile/${localStorage.getItem("urlId")}`} color="inherit" style={{ textDecoration: 'none' }}>
          Profile
        </Button>
        <Button component={Link} to="/jobs" color="inherit" style={{ textDecoration: 'none' }}>
          Jobs
        </Button>
        <Button component={Link} to="/contact" color="inherit" style={{ textDecoration: 'none' }}>
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
