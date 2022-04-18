
import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from 'validator';
import { baseUrl } from '../baseurls';



// import Avatar from '@material-ui/core/Avatar';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// // import LockOutlinedIcon from '@material-ui/core/LockOutlined';
// import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
// import { createTheme, ThemeProvider } from '@material-ui/core/styles';
// import validator from 'validator';


import axios from 'axios';
import { useNavigate } from "react-router-dom";

const theme = createTheme();

function validateName(name){    
  var re = /^[A-Za-z]+$/;
  if(re.test(name))
     return true
  else
     return false   
}

export default function SignUp() {

    let navigate = useNavigate(); 

    const handleSubmit = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        var firstName = data.get('firstName')
        var lastName = data.get('lastName')
        var email = data.get('email')
        var password = data.get('password')

        if (!validator.isEmail(email) || password.length < 4 || !validateName(firstName) || !validateName(lastName)) {
            alert('Email or password is not correct! \n- firstname, lastname should only contain alphabet \n- Email format (xyz@domain.com)\n- password length should be >4')
        }
        else{
            axios.post(baseUrl+'/register', {firstName, lastName, email, password})
            .then(res => {
                console.log("Full Response STATUS ", res.data);
                if ( res.data.message === "Registered"){
                    alert("Registered");
                    navigate("/") ;
                }
                else if (res.data.message === 'Already Registered'){
                    alert("User Already Exists");
                }
            })
            .catch(err =>{
                console.log("Error is : ", err)
                navigate("/error")
            });
        }
    };

    return (
      <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
      </ThemeProvider>
    );
}