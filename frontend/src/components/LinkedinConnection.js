import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Paper } from '@mui/material';

const CLIENT_ID = '77255ae457gw43';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A3000%2Flogin';

const LinkedinConnection = () => {
  
  const [profileData, setProfileData] = useState(null);
  const [fetchedData, setFetchedData] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');
  
    if (authorizationCode && !fetchedData) {
      fetchProfileData(encodeURIComponent(authorizationCode));
      setFetchedData(true);
      window.history.pushState({}, '', '/profile'); // Replace '/' with the URL you want to show after data is fetched
    }
  }, [fetchedData]);
  
  useEffect(() => {
    // Check if the user email is available in sessionStorage
    const userUrlId = sessionStorage.getItem('urlId');
    if (userUrlId && !profileData) {
      console.log('User is already logged in with email:', sessionStorage.getItem("userEmail"));
      axios.get(`http://localhost:8080/api/profile/${userUrlId}`)
        .then((response) => {
          setProfileData(response.data);
        })
    }
  }, [profileData]);

  const handleLinkedInLogin = () => {
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456789&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authorizationUrl;
  };

  const fetchProfileData = async (authorizationCode) => {
    try {
      axios.get(`http://localhost:8080/api/linkedin/profile?code=${authorizationCode}`)
      .then((response => {
        setProfileData(response.data);
        sessionStorage.setItem("userEmail", response.data.email);
        axios.get(`http://localhost:8080/api/profile/mail/${encodeURIComponent(response.data.email)}`)
        .then((profileResponse) => {
          sessionStorage.setItem("urlId", profileResponse.data.urlId);
          sessionStorage.setItem("role", "APPLICANT");
          window.location.href = `/profile/${response.data.urlId}`;
        })
        .catch((error)=>{
          console.log(error);
        })
      }))

    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
    }
  };


  return (
    <div style={{ maxWidth: 500, margin: 'auto'}}>
      <Button variant="contained" color="primary" onClick={handleLinkedInLogin}>Login with LinkedIn</Button>
    </div>
  );
};

export default LinkedinConnection;
