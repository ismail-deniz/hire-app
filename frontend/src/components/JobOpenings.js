import React, { useEffect, useState } from 'react';
import { Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import JobOpeningsGrid from './JobOpeningsGrid';
import JobOpeningsList from './JobOpeningsList';

import axios from 'axios';

const JobOpenings = () => {
  useEffect(() => {
    // Check if the user email is available in localStorage');
      console.log('User is already logged in with email:', localStorage.getItem("userEmail"));
      axios.get(`http://localhost:8080/api/opening`)
        .then((response) => {
          setOpeningData(response.data);
        })
  }, []);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  
  const [openingData, setOpeningData] = useState([{
    id: 1,
    logoFileName: 'logo/company.png',
    title: 'Software Engineer',
    status: 'active',
  },
  {
    id: 2,
    logoFileName: 'logo/company.png',
    title: 'Frontend Developer',
    status: 'inactive',
  },
  {
    id: 3,
    logoFileName: 'logo/company.png',
    title: 'Product Manager',
    status: 'active',
  },
  {
    id: 4,
    logoFileName: 'logo/company.png',
    title: 'Data Scientist',
    status: 'active',
  },
  {
    id: 5,
    logoFileName: 'logo/company.png',
    title: 'UX/UI Designer',
    status: 'inactive',
  },
  {
    id: 6,
    logoFileName: 'logo/company.png',
    title: 'DevOps Engineer',
    status: 'active',
  },
  {
    id: 7,
    logoFileName: 'logo/company.png',
    title: 'Mobile App Developer',
    status: 'active',
  },
  {
    id: 8,
    logoFileName: 'logo/company.png',
    title: 'Data Engineer',
    status: 'inactive',
  },
  {
    id: 9,
    logoFileName: 'logo/company.png',
    title: 'Backend Developer',
    status: 'active',
  },
  {
    id: 10,
    logoFileName: 'logo/company.png',
    title: 'Project Manager',
    status: 'inactive',
  },
  // Add more job data objects as needed
]);

const handleToggleView = (event, newView) => {
  setView(newView);
};

const handleApply = (jobId) => {
  // Implement the logic to handle the apply action based on the jobId
  console.log(`Apply for Job ID: ${jobId}`);
};

  return (
    <Stack spacing={3}>
      <ToggleButtonGroup value={view} exclusive onChange={handleToggleView}>
        <ToggleButton value="grid">Grid View</ToggleButton>
        <ToggleButton value="list">List View</ToggleButton>
      </ToggleButtonGroup>
      {view === 'grid' ? <JobOpeningsGrid jobData={openingData} handleApply={handleApply}/> 
                        : <JobOpeningsList jobData={openingData} handleApply={handleApply} />}
    </Stack>
  );
};

export default JobOpenings;
