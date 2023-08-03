import React, {useState} from 'react';
import {
    Button,
    Modal,
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    TextField
} from '@mui/material';
import {ApplicationStatus} from '../enum/ApplicationStatus.js';

import axios from 'axios'; 

const ApplyButton = ({job}) => {
    const [isModalOpen,
        setIsModalOpen] = useState(false);
    const [coverLetter,
        setCoverLetter] = useState('');

    const handleApply = (jobId) => {
        // Implement the logic to handle the apply action based on the jobId
        console.log(`Apply for Job ID: ${jobId}`);
        if (sessionStorage.getItem('role')) {
            setIsModalOpen(true);
        } else {
            alert('Please login to apply for a job.');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCoverLetter('');
    };

    const handleCoverLetterChange = (event) => {
        setCoverLetter(event.target.value);
    };

    const handleSendApplication = () => {
        // Implement the logic to send the application with the cover letter
        console.log('Sending application of:', sessionStorage.getItem('applicantId'));
        console.log('with cover letter:', coverLetter);
        console.log(ApplicationStatus);
        axios.post(`http://localhost:8080/api/application`, {
            applicantId: sessionStorage.getItem('applicantId'),
            openingId: job.id,
            status: ApplicationStatus.PENDING,
            coverLetter: coverLetter
        }).then((response) => {
            console.log('Application sent:', response.data);
        }).catch((error) => {
            console.error('Error sending application:', error);
        });

        handleModalClose();
    };

    return ( 
    <React.Fragment> 
        {sessionStorage.getItem('role') !== 'HR' && job.active && (
            <React.Fragment>
                <Button onClick={() => handleApply(job.id)} variant="contained" color="primary">
                    Apply
                </Button>
                <Modal open={isModalOpen} onClose={handleModalClose}>
                    <Box
                        sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 500,
                        maxHeight: '80%',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Box 
                            display="flex" 
                            flexDirection="row" 
                            alignItems="center" 
                            marginBottom="1rem"
                            justifyContent={"space-between"}
                            >
                        <Typography variant="h5" gutterBottom>
                            {job.title}
                        </Typography>

                        <List>
                        {job.qualifications.map((qualification) => (
                            <ListItem key={qualification}>
                            <ListItemText primary={qualification} />
                            </ListItem>
                        ))}
                        </List>
                        </Box>
                        <Typography variant="body2" gutterBottom>
                            By clicking "Send Application", you confirm that your profile information will
                            be used for this job application. Extend on your specific experiences or skills
                            that suit this job in your cover letter.
                        </Typography>
                        <TextField
                            label="Cover Letter"
                            multiline
                            rows={4}
                            value={coverLetter}
                            onChange={handleCoverLetterChange}
                            fullWidth
                            variant="outlined"
                            sx={{
                            mt: 2
                        }}/>
                        <Button
                            onClick={handleSendApplication}
                            variant="contained"
                            color="primary"
                            sx={{
                            mt: 2
                        }}>
                            Send Application
                        </Button>
                    </Box>
                </Modal>
            </React.Fragment>
        )
    } 
    </ React.Fragment>
  );
};

export default ApplyButton;