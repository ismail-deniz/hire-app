import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Paper } from '@mui/material';

const CLIENT_ID = '77255ae457gw43';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A3000';

const LinkedinConnection = () => {
  
  const [profileData, setProfileData] = useState(null);
  const [fetchedData, setFetchedData] = useState(false);
  const [typedUrl, setTypedUrl] = useState('');
  const [additionalDataFetched, setAdditionalDataFetched] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');
  
    if (authorizationCode && !fetchedData) {
      fetchProfileData(encodeURIComponent(authorizationCode));
      setFetchedData(true);
      window.history.pushState({}, '', '/'); // Replace '/' with the URL you want to show after data is fetched
    }
  }, [fetchedData]);
  
  useEffect(() => {
    // Check if the user email is available in localStorage
    const userUrlId = localStorage.getItem('urlId');
    if (userUrlId && !profileData) {
      console.log('User is already logged in with email:', localStorage.getItem("userEmail"));
      axios.get(`http://localhost:8080/api/profile/${userUrlId}`)
        .then((response) => {
          setProfileData(response.data);
          setAdditionalDataFetched(true);
        })
    }
  }, [profileData]);

  const handleLinkedInLogin = () => {
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456789&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authorizationUrl;
  };

  const fetchProfileData = async (authorizationCode) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/linkedin/profile?code=${authorizationCode}`);
      setProfileData(response.data);
      localStorage.setItem("userEmail", response.data.email);
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
    }
  };

  const handleSendRequest = async () => {
    console.log(profileData.email);
    try {
      const response = await axios.put(`http://localhost:8080/api/linkedin/profile`, {
        email: profileData.email,
        profileUrl: typedUrl
      });
      setProfileData(response.data)
      setAdditionalDataFetched(true);
      localStorage.setItem("urlId", response.data.urlId);
      window.location.href = `/profile/${response.data.urlId}`;
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };


  return (
    <div style={{ maxWidth: 500, margin: 'auto'}}>
      {profileData ? (
        <div>
          <Typography variant="h4" gutterBottom>Welcome, {profileData.fullName}!</Typography>
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
      ) : (
        <Button variant="contained" color="primary" onClick={handleLinkedInLogin}>Login with LinkedIn</Button>
      )}
    </div>
  );
};

export default LinkedinConnection;
