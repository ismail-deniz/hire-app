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
          {/* Render other profile information as needed */}
        </div>
      ) : (
        <button onClick={handleLinkedInLogin}>Log in with LinkedIn</button>
      )}
    </div>
  );
};
