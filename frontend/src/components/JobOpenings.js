import React, { useEffect, useState } from 'react';
import { Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import JobOpeningsGrid from './JobOpeningsGrid';
import JobOpeningsList from './JobOpeningsList';

import axios from 'axios';

const JobOpenings = ({hrId}) => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [openingData, setOpeningData] = useState(null);

  useEffect(() => {
    // Check if the user email is available in sessionStorage');
      console.log('User is already logged in with email:', sessionStorage.getItem("userEmail"));
      if (hrId){
        console.log('HR is already logged in with id:', hrId);
        axios.get(`http://localhost:8080/api/opening/${hrId}`)
          .then((response) => {
            console.log(response.data);
            if (response.data.length !== 0) {
            setOpeningData(response.data);
      }})
      } else {
        axios.get(`http://localhost:8080/api/opening`)
          .then((response) => {
            setOpeningData(response.data);
          })
      }
  }, []);

const handleToggleView = (event, newView) => {
  setView(newView);
};

const handleDeleteSuccess = (deletedJobId) => {
  setOpeningData((prevData) =>
    prevData.filter((job) => job.id !== deletedJobId)
  );
};

  return (
    <div>
      {openingData ? ( 
      <Stack spacing={3}>
        <ToggleButtonGroup value={view} exclusive onChange={handleToggleView}>
          <ToggleButton value="grid">Grid View</ToggleButton>
          <ToggleButton value="list">List View</ToggleButton>
        </ToggleButtonGroup>
        {view === 'grid' ? <JobOpeningsGrid jobData={openingData} handleDeleteSuccess={handleDeleteSuccess} /> 
                          : <JobOpeningsList jobData={openingData} handleDeleteSuccess={handleDeleteSuccess}/>}
      </Stack>
      ) : (
        <h4>No Job Openings to show...</h4>
      )}

    </div>
  );
};

export default JobOpenings;
