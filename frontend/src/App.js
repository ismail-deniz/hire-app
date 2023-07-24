import { Stack, Box, Container } from '@mui/material';
import './App.css';
import LinkedinConnection from './components/LinkedinConnection';
import JobOpenings from './components/JobOpenings';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Use minHeight instead of height to allow the content to grow
        backgroundColor: '#f5f5f5', // Add a background color to the container
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <LinkedinConnection />
          <JobOpenings />
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
