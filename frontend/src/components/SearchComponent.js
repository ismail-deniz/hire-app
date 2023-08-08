import React, { useState, useEffect } from 'react';
import { Button, 
    Stack, 
    TextField, 
    Card, 
    CardActionArea, 
    CardContent,
    CardActions,
    Typography,
    Modal,
    Box    
} from '@mui/material';
import axios from 'axios';

const SearchComponent = ({openingId, qualifications}) => {

  const [searchText, setSearchText] = useState(qualifications ? qualifications.join(' ') : '');
  const [searchResults, setSearchResults] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [showResults, setShowResults] = useState(searchResults ? searchResults : allApplicants);
  const [openCoverLetterModal, setOpenCoverLetterModal] = useState(false);
  const [change, setChange] = useState(0);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    setShowResults(searchResults.length !== 0 || searchText.length !== 0 ? searchResults : allApplicants);
    }, [searchResults, allApplicants]);

  useEffect(() => {
    handleSearchChange(searchText);
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
    }, [change]);

  const getSearchPath = (text) => {
    if (openingId) {
        return `http://localhost:8080/api/search?text=${text}&openingId=${openingId}`;
    } else {
        return `http://localhost:8080/api/search/all?text=${text}`;
    }
  }

  const getBackgroundColor = (applicant) => {
    if (openingId) {
        if (applicant.blacklisted) {
            return '#a0a0a0';
        } else if (applicant.status === 'ACCEPTED') {
            return '#c8e6c9';
        } else if (applicant.status === 'DENIED') {
            return '#ffcdd2';
        } else if (applicant.status === 'IN_PROCESS') {
            return '#bbdefb';
        } else {
            return '#fff';
        }
    } else {
        return '#fff';
    }
    };

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

  const handleProcess = (applicant) => {
    // Implement the logic to handle the click action based on the applicantId
    console.log(`Clicked Process ID: ${applicant.id}`);
    axios.put(`http://localhost:8080/api/hr/process/${openingId}/${applicant.id}`, null, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    })
        .then((response) => {
            console.log(response);
            setChange(Math.random());
            applicant.status = 'IN_PROCESS';
        }
    );
};

    const handleAccept = (applicant) => {
        // Implement the logic to handle the click action based on the applicantId
        console.log(`Clicked Accept ID: ${applicant.id}`);
        axios.put(`http://localhost:8080/api/hr/accept/${openingId}/${applicant.id}`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => {
                console.log(response);
                setChange(Math.random());
                applicant.status = 'ACCEPTED';
            }
        );
    };

    const handleDecline = (applicant) => {
        // Implement the logic to handle the click action based on the applicantId
        console.log(`Clicked Decline ID: ${applicant.id}`);
        axios.put(`http://localhost:8080/api/hr/decline/${openingId}/${applicant.id}`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => {
                console.log(response);
                setChange(Math.random());
                applicant.status = 'DENIED';
            }
        );
    };

    const handleBlacklist = (applicant) => {
        // Implement the logic to handle the click action based on the applicantId
        console.log(`Clicked Blacklist ID: ${applicant.id}`);
        axios.put(`http://localhost:8080/api/hr/blacklist/${applicant.id}`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
            .then((response) => {
                console.log(response);
                setChange(Math.random());
                applicant.blacklisted = !applicant.blacklisted;
            }
        );
    };

    const handleSeeCoverLetter = (applicantId) => {
        // Implement the logic to handle the click action based on the applicantId
        console.log(`Clicked See Cover Letter ID: ${applicantId}`);
        setOpenCoverLetterModal(true);
        setSelectedApplicant(applicantId);
    };

    const handleCloseModal = () => {
        setOpenCoverLetterModal(false);
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
                cursor: 'pointer',
                backgroundColor: getBackgroundColor(applicant)
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
                {openingId && (
                    <>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => handleSeeCoverLetter(applicant.id)}>
                        See Cover Letter
                    </Button>
                    <Button disabled={applicant.blacklisted} size="small" color="primary" onClick={() => handleProcess(applicant)}>
                        Process
                    </Button>
                    <Button disabled={applicant.blacklisted} size="small" color="primary" onClick={() => handleAccept(applicant)}>
                        Accept
                    </Button>
                    <Button disabled={applicant.blacklisted} size="small" color="primary" onClick={() => handleDecline(applicant)}>
                        Decline
                    </Button>
                    <Button size="small" color="primary" onClick={() => handleBlacklist(applicant)}>
                        {applicant.blacklisted ? 'Unblacklist' : 'Blacklist'}
                    </Button>
                </CardActions>
                <Modal
                    open={openCoverLetterModal && applicant.id === selectedApplicant}
                    onClose={handleCloseModal}
                >
                    <Box  sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            maxHeight: '80%',
                            overflowY: 'auto',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                        }}>
                        <Typography variant="h5" gutterBottom>  
                            Cover Letter of {applicant.fullName} :
                        </Typography>
                        <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-line' }}>
                            {applicant.coverLetter}
                        </Typography>
                    </Box>
                </Modal>
                    </>
                )}
            </Card>
        ))}
    </Stack>
    </div>
    );
};

export default SearchComponent;
