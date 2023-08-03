import {React, useState} from 'react';

import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Modal, Box } from '@mui/material';
import SearchComponent from './SearchComponent';

const SeeApplicantsButton = ({job}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const onClick = () => {
        // Implement the logic to handle the click action based on the jobId
        console.log(`Clicked Job ID: ${job.id}`);
        // Open the modal for the clicked job
        setIsModalOpen(true);
    };
        

    return (
        <div>
        {
            sessionStorage.getItem("role") === "HR" && sessionStorage.getItem("hrId") === job.hrId.toString() &&
        <>
           <IconButton aria-label="see applicants" color="primary" onClick={onClick}>
                <VisibilityIcon />
            </IconButton>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Box  sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '80%',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <SearchComponent openingId={job.id}/>
                </Box>
            </Modal>
        </>
        }
        </div>
    );
}

export default SeeApplicantsButton;