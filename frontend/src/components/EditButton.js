// Apply button
import React from 'react';
import { useState } from 'react';
import { Button, IconButton, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

import CreateOpening from './CreateOpening';
import toast from 'react-simple-toasts';


const EditButton = ({job, setChange}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditOpening = (editedOpening) => {
        // Implement the logic to save the edited opening to the backend
        console.log("Edited Opening:", editedOpening);
        setIsModalOpen(false);
        axios.put(`http://localhost:8080/api/hr/opening`, editedOpening, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }}).then((response) => {
                    toast('Opening edited!');
                    console.log('Edited Opening:', response.data);
                    setChange(Math.random());
                }
        ).catch((error) => {
            console.log(error);
        }
        )
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };

    return (
        <div>
        {
            sessionStorage.getItem("role") === "HR" && sessionStorage.getItem("hrId") === job.hrId &&
            <div>
            <IconButton onClick={handleOpenModal} variant="contained" color="primary">
                <EditIcon />
            </IconButton>

            <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
          >
            <CreateOpening onClose={handleCloseModal} onSave={handleEditOpening} job={job} />
          </Modal>
          </div>  
        }
        </div>
    );
}

export default EditButton;