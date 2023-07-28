import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Grid,
    CardActionArea,
    Modal,
    Box,
    Paper
} from '@mui/material';

import JobOpeningCard from "./JobOpeningCard.js"

const JobOpeningsGrid = ({jobData, handleApply}) => {
    const [selectedJob,
        setSelectedJob] = useState(null);

    const onClick = (jobId) => {
        // Implement the logic to handle the click action based on the jobId
        console.log(`Clicked Job ID: ${jobId}`);
        // Open the modal for the clicked job
        setSelectedJob(jobData.find((job) => job.id === jobId));
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    return (
        <Grid container spacing={2}>
            {jobData.map((job) => (
                <Grid item key={job.id} xs={12} sm={6} md={4} lg={3}>
                    <Card>
                        <CardActionArea onClick={() => onClick(job.id)}>
                            <CardContent>
                                <img
                                    src={`logo/company.png`}
                                    alt="Company Logo"
                                    style={{
                                    width: '100%',
                                    marginBottom: '1rem'
                                }}/>
                                <Typography variant="h6">{job.title}</Typography>
                                <Typography variant="subtitle1">{job.status === 'active'
                                        ? 'Active'
                                        : 'Inactive'}</Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button onClick={() => handleApply(job.id)} variant="contained" color="primary">
                                Apply
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            <Modal open={Boolean(selectedJob)} onClose={handleCloseModal}>
                <Box
                    sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '80%',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4
                }}>
                    {selectedJob && (
                        <JobOpeningCard selectedJob={selectedJob} handleApply={handleApply} />
                    )}
                </Box>
            </Modal>
        </Grid>

    );
};

export default JobOpeningsGrid;
