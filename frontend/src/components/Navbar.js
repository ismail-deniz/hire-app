import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({change}) => {
  const roleFromSessionStorage = sessionStorage.getItem("role");
  const [role, setRole] = useState(roleFromSessionStorage || "");

  useEffect(() => {
    // update role when sessionStorage changes
    setRole(sessionStorage.getItem("role"));
   }, [change]);
   
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1, }}>
          OBSS Hire App
        </Typography>
        {role === "APPLICANT" && 
        <Button component={Link} to={`/profile/${sessionStorage.getItem("urlId")}`} color="inherit" style={{ textDecoration: 'none' }}>
          Profile
        </Button>
        }
        <Button component={Link} to="/jobs" color="inherit" style={{ textDecoration: 'none' }}>
          Jobs
        </Button>
        {role === "HR" && 
        <Button component={Link} to="/myopenings" color="inherit" style={{ textDecoration: 'none' }}>
        My Openings
        </Button>
        }
        {role === null && 
        <Button component={Link} to="/login" color="inherit" style={{ textDecoration: 'none' }}>
          Login
        </Button>
        }
        {role !== null &&
        <Button component={Link} to="/login" color="inherit" style={{ textDecoration: 'none' }} onClick={() => {
          sessionStorage.clear();
          setRole(null);
        }}>
          Logout
        </Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
