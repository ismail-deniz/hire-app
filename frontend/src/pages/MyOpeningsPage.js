import React, { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';
import CreateOpening from '../components/CreateOpening';
import JobOpenings from '../components/JobOpenings'

import axios from 'axios';


const MyOpeningsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveOpening = async (newOpening) => {
    try {
        console.log("Sent Opening:", newOpening);
        const response = await axios.post(`http://localhost:8080/api/hr/newOpening`, newOpening, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }});
        console.log('New Opening:', response.data);
      } catch (error) {
        console.error('Error sending request:', error);
      }
    // Implement the logic to save the new opening to the backend
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button onClick={handleOpenModal} variant="contained" color="primary">
        Create Job Opening
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
      >
        <CreateOpening onClose={handleCloseModal} onSave={handleSaveOpening} />
      </Modal>
      <JobOpenings hrId={sessionStorage.getItem("hrId")}/>
    </Box>
  );
};

export default MyOpeningsPage;
