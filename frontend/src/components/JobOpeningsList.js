import React, {useState} from 'react';
import {
    Avatar,
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
import JobOpeningCard from './JobOpeningCard';
import ApplyButton from './ApplyButton';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import SeeApplicantsButton from './SeeApplicantsButton';

const JobOpeningsList = ({jobData, handleDeleteSuccess, setChange}) => {
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

    const getBackgroundColor = (job) => {
        if (job.active) { // light green
            return '#c8e6c9';
        } else { // light red
            return '#ffcdd2';
        }
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
                    <CardActionArea 
                        sx={{backgroundColor : getBackgroundColor(job)}} 
                            onClick={() => onClick(job.id)}
                            >
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
                                {job.active ? (
                                    <Typography variant="subtitle1">
                                    Active until: {job.deactivationDate ? (new Date(job.deactivationDate)).toLocaleDateString() : "N/A"}
                                    </Typography>
                                ) : (
                                    <Typography variant="subtitle1">
                                    Inactive until: {job.activationDate ? (new Date(job.activationDate)).toLocaleDate.String() : "N/A"}
                                    </Typography>
                                )}
                            </CardContent>
                        </Stack>
                    </CardActionArea>
                    <CardActions>
                        <ApplyButton job={job}/>
                        <DeleteButton job={job} handleDeleteSuccess={handleDeleteSuccess}/>
                        <EditButton job={job} setChangehange={setChange} />
                        <SeeApplicantsButton job={job}/>
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
                        <JobOpeningCard selectedJob={selectedJob} />
                    )}
                </Box>
            </Modal>
        </Stack>
    );
};

export default JobOpeningsList;
