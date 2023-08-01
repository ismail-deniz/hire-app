import React, { useState } from 'react';
import {
  Fade,
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';

const CreateOpening = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [activeDate, setActiveDate] = useState('');
  const [deactiveDate, setDeactiveDate] = useState('');
  const [qualifications, setQualifications] = useState([{ value: '' }]);

  const handleSave = () => {
    // Create the opening object with the input values
    const newOpening = {
      title: title,
      explanation: explanation,
      active: isActive,
      activeDate: isActive ? new Date(activeDate) : null,
      deactiveDate: isActive ? null : new Date(deactiveDate),
      qualifications: qualifications.map((qual) => qual.value),
      hrId: sessionStorage.getItem("hrId"),
    };

    // Call the onSave function and pass the new opening object
    onSave(newOpening);
  };

  const handleAddQualification = () => {
    setQualifications([...qualifications, { value: '' }]);
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = [...qualifications];
    newQualifications.splice(index, 1);
    setQualifications(newQualifications);
  };

  const handleQualificationChange = (index, event) => {
    const newQualifications = [...qualifications];
    newQualifications[index].value = event.target.value;
    setQualifications(newQualifications);
  };

  return (
      <Fade in>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '80%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Create Job Opening</Typography>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: 8 }}
          />
          <TextField
            label="Explanation"
            multiline
            rows={4}
            fullWidth
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            style={{ marginTop: 8 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Required Qualifications:
          </Typography>
          {qualifications.map((qualification, index) => (
            <Box key={index} sx={{ display: 'flex', mt: 1 }}>
            <TextField
              label={`Qualification ${index + 1}`}
              fullWidth
              value={qualification.value}
              onChange={(e) => handleQualificationChange(index, e)}
              style={{ marginTop: 8, flexGrow: 1 }}
            />
            <Button onClick={() => handleRemoveQualification(index)} variant="outlined" sx={{ mt: 1, ml: 1 }}>
              -
            </Button>
          </Box>
          ))}
            <Button onClick={handleAddQualification} variant="outlined" sx={{ mt: 2 }}>
                +
            </Button>
            <Box style={{ display: 'flex', justifyContent: 'flex-end'}}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          <TextField
            label={isActive ? 'Deactivation Date' : 'Activation Date'}
            type="date"
            fullWidth
            value={isActive ? deactiveDate : activeDate}
            onChange={(e) => (isActive ? setDeactiveDate(e.target.value) : setActiveDate(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              style: { marginTop: '8px' },
            }}
            style={{ marginTop: '16px' }}
          />
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onClick={onClose} style={{ marginRight: 16 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Box>
      </Fade>
  );
};

export default CreateOpening;
