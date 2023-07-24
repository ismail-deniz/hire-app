import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

const JobOpeningCard = ({ logoUrl, title, status, onClick }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="140"
          image={logoUrl}
          alt="Company Logo"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" color="text.secondary">
              {status === 'active' ? 'Active' : 'Inactive'}
            </Typography>
            <Avatar sx={{ bgcolor: status === 'active' ? 'success.main' : 'error.main' }}>
              {status === 'active' ? 'A' : 'I'}
            </Avatar>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Apply/View Applicants
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobOpeningCard;
