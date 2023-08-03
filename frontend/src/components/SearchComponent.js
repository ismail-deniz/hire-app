import React, { useState, useEffect } from 'react';
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

const SearchComponent = ({openingId}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [showResults, setShowResults] = useState(searchResults ? searchResults : allApplicants);

  useEffect(() => {
    setShowResults(searchResults.length !== 0 || searchText.length !== 0 ? searchResults : allApplicants);
    }, [searchResults, allApplicants]);

  useEffect(() => {
    // get all applicants from backend
    if (openingId) {
        axios.get(`http://localhost:8080/api/applicants?openingId=${openingId}`)
        .then((response) => {
            setAllApplicants(response.data);
        })
    } else {
        axios.get(`http://localhost:8080/api/applicants/all`)
            .then((response) => {
                setAllApplicants(response.data);
            })
        }
    }, []);

  const getSearchPath = (text) => {
    if (openingId) {
        return `http://localhost:8080/api/search?text=${text}&openingId=${openingId}`;
    } else {
        return `http://localhost:8080/api/search/all?text=${text}`;
    }
  }

  const handleSearchChange = (text) => {
        console.log(allApplicants);
      // Send the search request to the backend
      if (text !== '' && text.length >= 3) {
          axios
          .get(getSearchPath(text))
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
      {searchResults.length === 0 && searchText.length !== 0 && (
        <Typography variant="subtitle1">No results found</Typography>
      )}
      <Stack spacing={2}>
        {showResults.map((applicant) => (
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
