import {React, useEffect, useState} from 'react';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack
} from '@mui/material';


import axios from 'axios';


const MyApplicationsPage = () => {
    const [applications, setApplications] = useState(null);

    useEffect(() => {
        // get applications from backend
        axios.get(`http://localhost:8080/api/application/${sessionStorage.getItem("applicantId")}`)
            .then((response) => {
                setApplications(response.data);
            })
    }, []);

    const getApplicationStatusIcon = (status) => {
        switch (status) {
          case 'PENDING':
            return <HourglassEmptyIcon color="action" />;
          case 'IN_PROCESS':
            return <HourglassEmptyIcon color="warning" />;
          case 'ACCEPTED':
            return <ThumbUpIcon color="success" />;
          case 'DENIED':
            return <ThumbDownIcon color="error" />;
          default:
            return null;
        }
      };
    

    return (
        <div>
            {applications ? (
                <Stack spacing={3}>
                {applications.map((application) => (
                  <Card 
                  key={application.id} 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingRight: '15px',
                }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {application.openingTitle}
                      </Typography>
                      <Typography variant="subtitle1">
                        Opening Status: {application.openingIsActive ? 'Active' : 'Inactive'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      {getApplicationStatusIcon(application.status)}
                      <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        {application.status}
                      </Typography>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            ) : (
                <h4>No Applications to show...</h4>
            )}
        </div>
    );
}

export default MyApplicationsPage;