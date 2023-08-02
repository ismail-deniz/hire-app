import React, { useState, useRef } from 'react';
import { Button, 
    Stack, 
    TextField, 
    Card, 
    CardActionArea, 
    CardContent,
    CardActions,
    Typography    
} from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';

const SearchComponent = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearchChange = (text) => {
      // Send the search request to the backend
      if (text !== '' && text.length >= 3) {
          axios
          .get(`http://localhost:8080/api/search?text=${text}`)
          .then((response) => {
              setSearchResults(response.data);
              console.log(searchResults);
            })
            .catch((error) => {
                console.error('Error searching:', error);
            });
        } else {
            // Clear the search results if the search text is empty
            setSearchResults([]);
        }
    };
    
  const handleInputChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    // Debounce the search request here
    handleSearchChange(text);
  };

  const onClick = (urlId) => {
    // Implement the logic to handle the click action based on the applicantId
    console.log(`Clicked Applicant ID: ${urlId}`);
    window.location.href = `http://localhost:3000/profile/${urlId}`;
    };

  return (
    <div>
      <TextField
        label="Search"
        value={searchText}
        onChange={handleInputChange}
        fullWidth
        variant="outlined"
      />
      <Stack spacing={2}>
        {searchResults.map((applicant) => (
            <Card
                key={applicant.urlId}
                sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingRight: '15px',
                cursor: 'pointer'
            }}>
                <CardActionArea onClick={() => onClick(applicant.urlId)}>
                    <Stack direction="row">
                        <img
                            src={`logo/company.png`}
                            alt="Company Logo"
                            style={{
                            width: '120px',
                            height: 'auto',
                            marginRight: '1rem'
                        }}/>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {applicant.fullName}
                            </Typography>
                            <Typography variant="subtitle1">{applicant.email}</Typography>
                        </CardContent>
                    </Stack>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => console.log(applicant.id)}>
                        Process
                    </Button>
                    <Button size="small" color="primary" onClick={() => console.log(applicant.id)}>
                        Accept
                    </Button>
                    <Button size="small" color="primary" onClick={() => console.log(applicant.id)}>
                        Decline
                    </Button>
                </CardActions>
            </Card>
        ))}
    </Stack>
    </div>
    );
};

export default SearchComponent;
