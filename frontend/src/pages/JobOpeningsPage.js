import React, { useState } from 'react';
import { Button, Modal, Box } from '@mui/material';
import CreateOpening from '../components/CreateOpening';
import JobOpenings from '../components/JobOpenings'

import axios from 'axios';


const JobOpeningsPage = () => {
  return (
    <Box sx={{ p: 2 }}>
      <JobOpenings />
    </Box>
  );
};

export default JobOpeningsPage;
