import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import axios from 'axios'
import LinkedinConnection from '../components/LinkedinConnection';
import {useState} from 'react';
import toast from 'react-simple-toasts';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '} {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage({setChange}) {
    const [error,
        setError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            userName: data.get('username'),
            password: data.get('password')
        });
        axios.get(`http://localhost:8080/api/login?userName=${data.get('username')}&password=${data.get('password')}`,).then((response) => {
            const token = response.data;
            console.log(token);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("role", "HR");
            axios.get(`http://localhost:8080/api/hr/${data.get('username')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                // Handle the response here
                sessionStorage.setItem("hrId", response.data);
                console.log(sessionStorage.getItem("hrId"));
                setChange(true);
                setChange(false);
                window.location.href = `http://localhost:3000/jobs`
            }).catch(error => {
                // Handle errors here
                console.error(error);
                toast('Error logging in!', {theme: 'warning'});
            });
        }).catch((error) => {
            console.log(error);
            setError(true);
            toast('Bad Credentials!', {theme: 'warning'});
        })
    };

    return (
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '85vh' }} columns={18} >
          {/* Regular Login Form */}
          <Grid
            item
            xs={12}
            sm={4}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                HR Personnel Sign In
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  error={error}
                />
                <TextField
                  margin="normal"
                  required
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  error={error}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                  Sign In
                </Button>
              </Box>
              <Box sx={{ mt: 5 }}>
                <Copyright />
              </Box>
            </Box>
          </Grid>

          {/* Background Image */}
          <Grid
            item
            xs={10}
            sm={10}
            md={10}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* LinkedIn Connection */}
          <Grid
            item
            xs={false}
            sm={4}
            md={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                p: 4,
                height: '100%',
              }}
            >
              <Typography component="h1" variant="h5">
                Applicants
              </Typography>
              <LinkedinConnection />
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
}