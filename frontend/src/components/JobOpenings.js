import React, { useEffect, useState } from 'react';
import { Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import JobOpeningsGrid from './JobOpeningsGrid';
import JobOpeningsList from './JobOpeningsList';

import axios from 'axios';

const JobOpenings = ({hrId, change, setChange}) => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [statusFilter, setStatusFilter] = useState('all'); // 'active', 'inactive', or 'all'
  const [openingData, setOpeningData] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    // Check if the user email is available in sessionStorage');
      console.log('User is already logged in with email:', sessionStorage.getItem("userEmail"));
      if (hrId){
        console.log('HR is already logged in with id:', hrId);
        axios.get(`http://localhost:8080/api/opening/${hrId}`)
          .then((response) => {
            console.log(response.data);
            if (response.data.length !== 0) {
            setFetchedData(response.data);
      }})
      } else {
        axios.get(`http://localhost:8080/api/opening`)
          .then((response) => {
            setFetchedData(response.data);
          })
      }
  }, [change]);

  useEffect(() => {
    if (statusFilter === 'active') {
      setOpeningData(fetchedData.filter((job) => job.active === true));
    } else if (statusFilter === 'inactive') {
      setOpeningData(fetchedData.filter((job) => job.active === false));
    } else {
      setOpeningData(fetchedData);
    }
  }, [statusFilter, fetchedData]);

const handleToggleView = (event, newView) => {
  setView(newView);
};

const handleToggleStatus = (event, newStatus) => {
  setStatusFilter(newStatus);
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
        <ToggleButtonGroup value={statusFilter} exclusive onChange={handleToggleStatus}>
          <ToggleButton value="active">Only Actives</ToggleButton>
          <ToggleButton value="inactive">Only Inactives</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
        {view === 'grid' ? <JobOpeningsGrid jobData={openingData} handleDeleteSuccess={handleDeleteSuccess} setChange={setChange}/> 
                          : <JobOpeningsList jobData={openingData} handleDeleteSuccess={handleDeleteSuccess} setChange={setChange}/>}
      </Stack>
      ) : (
        <h4>No Job Openings to show...</h4>
      )}

    </div>
  );
};

export default JobOpenings;
