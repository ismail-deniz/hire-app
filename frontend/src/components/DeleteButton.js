// Apply button
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import axios from 'axios';
import toast from 'react-simple-toasts';

const DeleteButton = ({job, handleDeleteSuccess}) => {

    const handleDelete = (jobId) => {
        axios.delete(`http://localhost:8080/api/hr/opening/${jobId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then((response) => {
            toast('Job deleted!');
            console.log(response.data);
            handleDeleteSuccess(jobId);
        })
        .catch((error) => { 
            console.log(error);
        })
    };

    return (
        <div>
        {
            sessionStorage.getItem("role") === "HR" && sessionStorage.getItem("hrId") === job.hrId.toString() &&
            <IconButton onClick={() => handleDelete(job.id)} variant="contained" color="primary">
                <DeleteIcon />
            </IconButton>
        }
        </div>
    );
}

export default DeleteButton;