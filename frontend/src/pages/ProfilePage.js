import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Link,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../style/profilePageStyles.css';

import axios from 'axios';
import toast from 'react-simple-toasts';

const ProfilePage = () => {
  const { urlId } = useParams(); // This will get the user's URL ID from the URL parameter

  const [userData, setUserData] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [dataIncomplete, setDataIncomplete] = useState(false);
  const [noProfile, setNoProfile] = useState(false); 
  const [typedUrl, setTypedUrl] = useState('');

  useEffect(() => {
    // Fetch the profile data for the specified user using the urlId
    const fetchUserData = async () => {
      try {
        if (urlId !== null && urlId !== "null") {
          axios.get(`http://localhost:8080/api/profile/${urlId}`)
          .then((response) => {
            setUserData(response.data);
            setUserDataFetched(true);
          }).catch((error) => {
            console.log(error);
            toast('Error fetching profile!', {theme: 'warning'});
            setUserDataFetched(false);
            setNoProfile(true);
          })
        } else {
            if (sessionStorage.getItem("userEmail")) {
            axios.get(`http://localhost:8080/api/profile/mail/${encodeURIComponent(sessionStorage.getItem("userEmail"))}`)
            .then((response) => {
              setUserData(response.data);
              try {
                if (userData.urlId)
                  setUserDataFetched(true);
                else
                  setDataIncomplete(true);
              } catch (error) {
                setUserDataFetched(false);
                setDataIncomplete(true)
              }
            })
            } else {
            window.location.href = "http://localhost:3000/login"
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserData();
  }, [urlId]);

  const handleLinkedinFetch = async () => {
    console.log(userData.email);
    try {
      const response = await axios.put(`http://localhost:8080/api/linkedin/profile`, {
        email: userData.email,
        profileUrl: userData.linkedinUrl
      });
      setUserData(response.data)
      sessionStorage.setItem("urlId", response.data.urlId);
      window.location.href = `/profile/${response.data.urlId}`;
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleSendRequest = async () => {
    console.log(sessionStorage.getItem("userEmail"));
    toast('Sending request...', {theme: 'info', position: 'bottom-right'});
    try {
      const response = await axios.put(`http://localhost:8080/api/linkedin/profile`, {
        email: sessionStorage.getItem("userEmail"),
        profileUrl: typedUrl
      });
      setUserData(response.data)
      sessionStorage.setItem("urlId", response.data.urlId);
      window.location.href = `/profile/${response.data.urlId}`;
    } catch (error) {
      toast('Error sending request!', {theme: 'warning'});
      console.error('Error sending request:', error);
    }
  };

  return (
    <div className="profile-container">
      {userDataFetched ? (
        <div>
          { urlId === sessionStorage.getItem("urlId") ?
          <Typography variant="h4" className='profile-title' gutterBottom>
            Welcome, {userData.fullName}!
          </Typography>
          : 
          <Typography variant="h4" className='profile-title' gutterBottom>
            {userData.fullName}
          </Typography>
          } 

          {/* About Section */}
            <Paper className="profile-card" elevation={3} style={{ padding: 15, marginBottom: 20 }}>
                <Typography variant="h5" className="profile-card-title">
                About
                </Typography>
                <Typography variant="body1">
                {userData.about}
                </Typography>
            </Paper>

          {/* Experience Section */}
          <Accordion className="profile-accordion" style={{ marginBottom: 10 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="experience-content" id="experience-header">
              <Typography variant="h5" className="profile-accordion-title">
                Experience
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column" spacing={2}>
                {userData.experienceList && userData.experienceList.map((experience, index) => (
                  <Grid item key={index}>
                    <Paper className="profile-card" elevation={3} style={{ padding: 15 }}>
                      <Typography variant="h6">{experience.title}</Typography>
                      <Typography variant="subtitle1">at {experience.employer}</Typography>
                      <Typography variant="body2">{experience.description}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Education Section */}
          <Accordion className="profile-accordion" style={{ marginBottom: 10 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="education-content" id="education-header">
              <Typography variant="h5" className="profile-accordion-title">
                Education
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column" spacing={2}>
                {userData.educationList && userData.educationList.map((education, index) => (
                  <Grid item key={index}>
                    <Paper className="profile-card" elevation={3} style={{ padding: 15 }}>
                      <Typography variant="h6">{education.institution}</Typography>
                      <Typography variant="body2">{education.description}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Certification Section */}
          <Accordion className="profile-accordion" style={{ marginBottom: 10 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="certification-content" id="certification-header">
              <Typography variant="h5" className="profile-accordion-title">
                Certification
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction="column" spacing={2}>
                {userData.certificateList && userData.certificateList.map((certification, index) => (
                  <Grid item key={index}>
                    <Paper className="profile-card" elevation={3} style={{ padding: 15 }}>
                      <Typography variant="h6">{certification.title}</Typography>
                      <Typography variant="subtitle1">{certification.institution}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/* LinkedIn URL and Fetch Profile Button */}
          { urlId === sessionStorage.getItem("urlId") ?
            <Box display="flex" alignItems="center">
                <TextField
                label="LinkedIn URL"
                value={userData.linkedinUrl || ''}
                fullWidth
                variant="outlined"
                onChange={(e) => {setUserData({...userData, linkedinUrl: e.target.value})}}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={handleLinkedinFetch}
                >
                Fetch Profile
                </Button>
            </Box>
            :
            <Box display="flow" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">LinkedIn URL</Typography>
                <Link
                href={userData.linkedinUrl}
                underline='hover'
                >
                  {userData.linkedinUrl}
                </Link>
            </Box>
          }
        </div>
      ) : (
        // Display a loading or error message if userData is null
        <div>
          {dataIncomplete ? (
            <div>
            <Typography variant="h5" gutterBottom>Welcome! {userData.fullName}</Typography>
              <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <TextField
                  label="LinkedIn Profile URL"
                  variant="outlined"
                  fullWidth
                  value={typedUrl}
                  onChange={(e) => setTypedUrl(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSendRequest} style={{ marginTop: 10 }}>
                  Send Request
                </Button>
              </Paper>
            </div>
          ) : {noProfile} ? (
            <Typography variant="h5">No profile found!</Typography>
          ) :
          (
            <Typography variant="h5">Loading...</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
