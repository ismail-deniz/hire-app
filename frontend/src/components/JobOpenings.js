import React, { useState } from 'react';
import { Stack, Box, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import JobOpeningsGrid from './JobOpeningsGrid';
import JobOpeningsList from './JobOpeningsList';

const JobOpenings = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const handleToggleView = (event, newView) => {
    setView(newView);
  };

  const jobData = [
    {
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
  ];
  

  return (
    <Stack spacing={3}>
      <ToggleButtonGroup value={view} exclusive onChange={handleToggleView}>
        <ToggleButton value="grid">Grid View</ToggleButton>
        <ToggleButton value="list">List View</ToggleButton>
      </ToggleButtonGroup>
      {view === 'grid' ? <JobOpeningsGrid jobData={jobData} /> : <JobOpeningsList jobData={jobData} />}
    </Stack>
  );
};

export default JobOpenings;
