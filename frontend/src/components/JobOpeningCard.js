import React from 'react';
import { Avatar, Typography, Button, Paper, Box } from '@mui/material';

const JobOpeningCard = ({ selectedJob, handleApply }) => {
  return (
    <Paper>
      <Typography variant="h4" gutterBottom>
        {selectedJob.title}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {selectedJob.explanation}
      </Typography>
      {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
          {selectedJob.qualifications.map((qualification, index) => (
            <Box
              key={index}
              sx={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '4px 8px',
                marginRight: 8,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2">{qualification}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Avatar sx={{ bgcolor: selectedJob.isActive ? 'success.main' : 'error.main' }}>
        {selectedJob.isActive ? 'A' : 'I'}
      </Avatar>
      <Button
        onClick={() => handleApply(selectedJob.id)}
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
        }}
      >
        Apply
      </Button>
    </Paper>
  );
};

export default JobOpeningCard;
