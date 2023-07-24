import React, {useState} from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Stack,
    Modal,
    Box,
    Paper,
    CardActionArea
} from '@mui/material';

const JobOpeningsList = ({jobData}) => {
    const [selectedJob,
        setSelectedJob] = useState(null);

    const handleApply = (jobId) => {
        // Implement the logic to handle the apply action based on the jobId
        console.log(`Apply for Job ID: ${jobId}`);
    };

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
        <Stack spacing={2}>
            {jobData.map((job) => (
                <Card
                    key={job.id}
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: '15px',
                    cursor: 'pointer'
                }}>
                    <CardActionArea onClick={() => onClick(job.id)}>
                        <Stack direction="row">
                            <img
                                src={`logo/company.png`}
                                alt="Company Logo"
                                style={{
                                width: '120px',
                                height: 'auto',
                                marginRight: '1rem'
                            }}/>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {job.title}
                                </Typography>
                                <Typography variant="subtitle1">{job.status === 'active'
                                        ? 'Active'
                                        : 'Inactive'}</Typography>
                            </CardContent>
                        </Stack>
                    </CardActionArea>
                    <CardActions>
                        <Button onClick={() => handleApply(job.id)} variant="contained" color="primary">
                            Apply
                        </Button>
                    </CardActions>
                </Card>
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
                        <Paper>
                            <Typography variant="h4" gutterBottom>
                                {selectedJob.title}
                            </Typography>
                            <Typography variant="subtitle1">{selectedJob.status === 'active'
                                    ? 'Active'
                                    : 'Inactive'}</Typography>
                            <Button
                                onClick={() => handleApply(selectedJob.id)}
                                variant="contained"
                                color="primary"
                                sx={{
                                mt: 2
                            }}>
                                Apply
                            </Button>
                        </Paper>
                    )}
                </Box>
            </Modal>
        </Stack>
    );
};

export default JobOpeningsList;
