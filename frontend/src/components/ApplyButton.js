// Apply button
import React from 'react';
import { Button } from '@mui/material';


const ApplyButton = ({job}) => {

    const handleApply = (jobId) => {
        // Implement the logic to handle the apply action based on the jobId
        console.log(`Apply for Job ID: ${jobId}`);
    };

    return (
        <div>
        {
            sessionStorage.getItem("role") === "APPLICANT" && job.active &&
            <Button onClick={() => handleApply(job.id)} variant="contained" color="primary">
                Apply
            </Button>
        }
        </div>
    );
}

export default ApplyButton;