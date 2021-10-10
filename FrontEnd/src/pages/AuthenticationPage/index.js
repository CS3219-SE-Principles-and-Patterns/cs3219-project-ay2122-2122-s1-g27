import { React, useState } from 'react';
import { Grid, Typography, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import { styled } from '@mui/system';
import LoginPage from '../../assets/LoginPage.png';

const Image = styled('img')(({ theme }) => ({
  paddingTop: '10%',
  [theme.breakpoints.down('md')]: {
    height: '300px',
    width: '300px'
  },
  [theme.breakpoints.only('md')]: {
    height: '400px',
    width: '400px'
  },
  [theme.breakpoints.only('lg')]: {
    height: '450px',
    width: '450px'
  },
  [theme.breakpoints.only('xl')]: {
    height: '600px',
    width: '600px'
  }
}));

const StyledTextField = styled(FormControl)(({ theme }) => ({
  marginTop: '30px',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.only('md')]: {
    width: '90%'
  },
  [theme.breakpoints.only('lg')]: {
    width: '80%'
  },
  [theme.breakpoints.only('xl')]: {
    width: '60%'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: '30px',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.only('md')]: {
    width: '90%'
  },
  [theme.breakpoints.only('lg')]: {
    width: '80%'
  },
  [theme.breakpoints.only('xl')]: {
    width: '60%'
  },
  backgroundColor: '#FFC727 ',
  textTransform: 'none',
  padding: '2%'
}));

function AuthenticationPage() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleChangeUsername = event => setUsername(event.target.value);
  const handleChangePassword = event => setPassword(event.target.value);
  const authenticate = () => {
    // use username and password state, then authenticate using backend api
    // if success => store user object in context and redirect to matching page
    // if fail => go to fail
  };

  return (
    <Grid container>
      <Grid item container justifyContent='center' alignItems='center' xs={12} sm={6}>
        <Image src={LoginPage} alt='Login-Page' />
      </Grid>
      <Grid item container justifyContent='center' alignItems='center' xs={12} sm={6}>
        <Grid item xs={12} sx={{ padding: '50px' }}>
          <Typography variant='h5' sx={{ color: '#FCFCFC', fontWeight: 600 }}>
            Welcome Back!
          </Typography>
          <Typography variant='body1' sx={{ color: '#DBDBDB' }}>
            Please log in / sign up with your username and password 🤠
          </Typography>

          <StyledTextField>
            <InputLabel htmlFor='component-outlined-username'>Username</InputLabel>
            <OutlinedInput
              id='component-outlined-username'
              onChange={handleChangeUsername}
              label='Username'
            />
          </StyledTextField>
          <StyledTextField>
            <InputLabel htmlFor='component-outlined-password'>Password</InputLabel>
            <OutlinedInput
              id='component-outlined-password'
              onChange={handleChangePassword}
              label='Password'
              type='password'
            />
          </StyledTextField>
          <StyledButton variant='contained'>
            <Typography variant='subtitle1' sx={{ color: '#FCFCFC', fontWeight: 600 }}>
              Log in / Sign up
            </Typography>
          </StyledButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AuthenticationPage;
