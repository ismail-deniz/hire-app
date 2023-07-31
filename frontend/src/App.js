import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stack, Box, Container } from '@mui/material';
import './style/styles.css';
import LinkedinConnection from './components/LinkedinConnection';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import JobOpeningsPage from './pages/JobOpeningsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Box sx={{ paddingTop: '64px' }}> {/* Add margin to the top for the Navbar */}
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Navbar justifyContent="top" />
            <Routes>
              <Route path="/" element={<LinkedinConnection />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile/:urlId" element={<ProfilePage />} />
              <Route path="/jobs" element={<JobOpeningsPage />} />
            </Routes>
          </Stack>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
