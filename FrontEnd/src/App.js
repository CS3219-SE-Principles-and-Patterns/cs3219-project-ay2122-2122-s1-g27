import React from 'react';
import AuthenticationPage from './pages/AuthenticationPage';
import LandingPage from './pages/LandingPage';
import MatchingPage from './pages/MatchingPage';
import UserProfilePage from './pages/UserProfilePage';
import CollaborationPage from './pages/CollaborationPage';
import { styled } from '@mui/system';
import { Grid } from '@mui/material';
import { BACKGROUND_COLOR, NAVBAR_COLOR } from './Constants';
import theme from './Theme';
import logo from './assets/PeerPrepLogo.png';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

const AppContainer = styled(Grid)({
  minHeight: '100vh',
  minWidth: '300px',
  maxWidth: '100%',
  backgroundColor: BACKGROUND_COLOR
});

const StyledAppBar = styled(AppBar)({
  minWidth: '300px',
  maxWidth: '100%',
  backgroundColor: NAVBAR_COLOR,
  margin: '0px',
  padding: '0px'
});

const Logo = styled('img')({
  height: '48px',
  width: '48px'
});

const LoginLink = styled(Link)({
  color: '#FCFCFC',
  textDecoration: 'none'
});

const PeerPrepText = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: '#9BCC5F',
  fontWeight: 600,
  [theme.breakpoints.down('md')]: {
    fontSize: '24px'
  },
  [theme.breakpoints.only('md')]: {
    fontSize: '28px'
  },
  [theme.breakpoints.only('lg')]: {
    fontSize: '32px'
  },
  [theme.breakpoints.only('xl')]: {
    fontSize: '36px'
  }
}));

function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position='static'>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <Link to='/about'>
              <Logo src={logo} alt='logo' />
            </Link>
          </IconButton>

          <PeerPrepText variant='h4' component='div'>
            PeerPrep
          </PeerPrepText>

          <Button color='inherit'>
            <LoginLink to='/login'>
              <Typography variant='h6' sx={{ textTransform: 'none', fontWeight: 600 }}>
                Sign In
              </Typography>
            </LoginLink>
          </Button>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <NavBar />
          <Switch>
            <Route path='/about' component={LandingPage} />
            <Route path='/login' component={AuthenticationPage} />
            <Route path='/match' component={MatchingPage} />
            <Route path='/profile' component={UserProfilePage} />
            <Route path='/collaborate' component={CollaborationPage} />
            <Route render={() => <Redirect to={{ pathname: '/about' }} />} />
          </Switch>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
