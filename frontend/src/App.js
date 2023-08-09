import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Stack, Box, Container } from '@mui/material';
import './style/styles.css';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import JobOpeningsPage from './pages/JobOpeningsPage';
import LoginPage from './pages/LoginPage';
import MyOpeningsPage from './pages/MyOpeningsPage';
import { useState } from 'react';
import SearchComponent from './components/SearchComponent';
import MyApplicationsPage from './pages/MyApplicationsPage';

function App() {
  const [change, setChange] = useState(false);

  return (
    <Router>
      <Box sx={{ paddingTop: '64px' }}> {/* Add margin to the top for the Navbar */}
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Navbar change={change} justifyContent="top" />
            <Routes>
              <Route path="/login" element={<LoginPage setChange={setChange}/>} />
              <Route path="/profile/:urlId" element={<ProfilePage setChange={setChange} />} />
              <Route path="/jobs" element={<JobOpeningsPage />} />
              {sessionStorage.getItem("role") === "HR" && 
              <Route path="/myOpenings" element={<MyOpeningsPage />} />
              }
              {sessionStorage.getItem("role") === "APPLICANT" &&
              <Route path="/myApplications" element={<MyApplicationsPage />} /> 
              }
              <Route path="/search" element={<SearchComponent />} />
              <Route path="/" element={<Navigate to="/search" />}/>
              <Route path="*" element={<Navigate to="/search" />}/>

            </Routes>
          </Stack>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
