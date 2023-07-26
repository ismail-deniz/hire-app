import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const CLIENT_ID = '77255ae457gw43';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A3000';

const LinkedinConnection = () => {
  const [profileData, setProfileData] = useState(null);
  const [fetchedData, setFetchedData] = useState(false);
  const [typedUrl, setTypedUrl] = useState('');
  const [additionalDataFetched, setAdditionalDataFetched] = useState(false);

  const handleLinkedInLogin = () => {
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456789&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authorizationUrl;
  };

  const fetchProfileData = async (authorizationCode) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/linkedin/profile?code=${authorizationCode}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
    }
  };

  const handleSendRequest = async () => {
    console.log(profileData.email);
    let urlAppendix = typedUrl.slice(typedUrl.lastIndexOf("in/") + 3, typedUrl.lastIndexOf("/"));
    console.log(urlAppendix);
    try {
      const response = await axios.put(`http://localhost:8080/api/linkedin/profile/${urlAppendix}`, {
        email: profileData.email});
      setProfileData(response.data)
      setAdditionalDataFetched(true);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');

    if (authorizationCode && !fetchedData) {
      fetchProfileData(encodeURIComponent(authorizationCode));
      setFetchedData(true);
      window.history.pushState({}, '', '/'); // Replace '/' with the URL you want to show after data is fetched
    }
  }, [fetchedData]);

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      {profileData ? (
        <div>
          <Typography variant="h4" gutterBottom>Welcome, {profileData.fullName}!</Typography>

          {!additionalDataFetched && (
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
          )}

          {additionalDataFetched && (
            <div>
              <Typography variant="h6" gutterBottom>Experience List:</Typography>
              <List>
                {profileData.experienceList && profileData.experienceList.map((experience) => (
                  <ListItem key={experience.dateInfo}>
                    <ListItemText primary={experience.title} secondary={`at ${experience.employer}`} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>Education List:</Typography>
              <List>
                {profileData.educationList && profileData.educationList.map((education) => (
                  <ListItem key={education.dateInfo}>
                    <ListItemText primary={education.institution} secondary={`${education.description}`} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" gutterBottom>Certification List:</Typography>
              <List>
                {profileData.certificationList && profileData.certificationList.map((certification) => (
                  <ListItem key={certification.dateInfo}>
                    <ListItemText primary={certification.title} />
                  </ListItem>
                ))}
              </List>
              
            </div>
          )}
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={handleLinkedInLogin}>Login with LinkedIn</Button>
      )}
    </div>
  );
};

export default LinkedinConnection;
