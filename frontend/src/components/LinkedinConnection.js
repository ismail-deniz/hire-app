import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const CLIENT_ID = '77255ae457gw43';
const CLIENT_SECRET = 'ehBdny0qzW1NMYmc';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A3000';

const LinkedinConnection = () => {
  const [profileData, setProfileData] = useState(null);
  const [fetchedData, setFetchedData] = useState(false); // Add the state variable


  const handleLinkedInLogin = () => {
    // Redirect user to LinkedIn authorization URL
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=123456789&scope=r_liteprofile%20r_emailaddress`;
    window.location.href = authorizationUrl;
  };

  const fetchProfileData = async (authorizationCode) => {
    try {
      // Send the access code to the backend for fetching the LinkedIn profile
      const response = await axios.get(`http://localhost:8080/api/linkedin/profile?code=${authorizationCode}`);
      console.log(response)
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
    }
  };

  useEffect(() => {
    // Parse the URL to get the access code from the query parameter
    const params = new URLSearchParams(window.location.search);
    const authorizationCode = params.get('code');
    console.log(authorizationCode);

    // If the access code is present in the URL, fetch the profile data
    if (authorizationCode && !fetchedData) {
      fetchProfileData(encodeURIComponent(authorizationCode));
      setFetchedData(true); // Mark the data as fetched to prevent multiple requests
    }
  }, [fetchedData]);

  return (
    <div>
      {profileData ? (
        <div>
          <h2>Welcome, {profileData.localizedFirstName}!</h2>
          <p>Headline: {profileData.id}</p>
          {/* Display other profile information as needed */}
        </div>
      ) : (
        <Button onClick={handleLinkedInLogin}>Login with LinkedIn</Button>
      )}
    </div>
  );
};

export default LinkedinConnection;

/*
import React, { useState } from 'react';
import axios from 'axios'

// LinkedIn API credentials
const CLIENT_ID = '77255ae457gw43';
const CLIENT_SECRET = 'ehBdny0qzW1NMYmc';
const REDIRECT_URI = 'http://localhost:3000';

export default function LinkedinConnection() {
  const [userProfile, setUserProfile] = useState(null);

  const handleLinkedInLogin = () => {
    // Open LinkedIn authentication window
    window.open(
      `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=STATE&scope=r_liteprofile`,
      '_self'
    );
  };

  const fetchUserProfile = (authorizationCode) => {
    axios.get('http://localhost:8080/api/fetchUserProfile', {
        params: {code: authorizationCode}
    }).then((response) => {
        // Handle the response data
        console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error fetching user profile:', error);
      });
  };

  const handleRedirect = () => {
    // Get the authorization code from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      // Call the function to fetch user profile using the authorization code
      fetchUserProfile(authorizationCode);
    }
  };

  // Check if the page is redirected from LinkedIn authentication
  React.useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <div>
      {userProfile ? (
        <div>
          <h1>Welcome, {userProfile.firstName}!</h1>
          <p>Email: {userProfile.emailAddress}</p>
          <p>ACode: {userProfile.authorizationCode}</p>
        </div>
      ) : (
        <button onClick={handleLinkedInLogin}>Log in with LinkedIn</button>
      )}
    </div>
  );
};
*/