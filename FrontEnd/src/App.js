import { React } from 'react';
import { AppContext } from './utils/AppContext';
import AuthenticationPage from './pages/AuthenticationPage';
import LandingPage from './pages/LandingPage';
import MatchingPage from './pages/MatchingPage';
import CollaborationPage from './pages/CollaborationPage';
import { styled } from '@mui/system';
import { Grid } from '@mui/material';
import { BACKGROUND_COLOR, NAVBAR_COLOR } from './utils/StylingConstants';
import theme from './utils/Theme';
import logo from './assets/PeerPrepLogo.png';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link,
    useLocation,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

const AppContainer = styled(Grid)({
    minHeight: '100vh',
    minWidth: '300px',
    maxWidth: '100%',
    backgroundColor: BACKGROUND_COLOR,
});

const StyledAppBar = styled(AppBar)({
    minWidth: '300px',
    maxWidth: '100%',
    backgroundColor: NAVBAR_COLOR,
    margin: '0px',
    padding: '0px',
});

const Logo = styled('img')({
    height: '48px',
    width: '48px',
});

const LoginLink = styled(Link)({
    color: '#FCFCFC',
    textDecoration: 'none',
});

const PeerPrepText = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
    color: '#9BCC5F',
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
        fontSize: '24px',
    },
    [theme.breakpoints.only('md')]: {
        fontSize: '28px',
    },
    [theme.breakpoints.only('lg')]: {
        fontSize: '32px',
    },
    [theme.breakpoints.only('xl')]: {
        fontSize: '36px',
    },
}));

function NavBar(props) {
    const { pathname } = useLocation();

    return pathname.includes('collaborate') ? null : (
        <Box sx={{ flexGrow: 1 }}>
            <StyledAppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Link to="/about">
                            <Logo src={logo} alt="logo" />
                        </Link>
                    </IconButton>

                    <PeerPrepText variant="h4" component="div">
                        PeerPrep
                    </PeerPrepText>

                    {pathname !== '/login' ? (
                        <Button
                            color="inherit"
                            disabled={sessionStorage.getItem('user')}
                        >
                            <LoginLink
                                to="/login"
                                disabled={sessionStorage.getItem('user')}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    {sessionStorage.getItem('user')
                                        ? '@' + sessionStorage.getItem('user')
                                        : 'Sign In'}
                                </Typography>
                            </LoginLink>
                        </Button>
                    ) : null}

                    {sessionStorage.getItem('user') ? (
                        <Button
                            color="inherit"
                            onClick={() => {
                                sessionStorage.clear();
                            }}
                        >
                            <LoginLink to="/about">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Log Out
                                </Typography>
                            </LoginLink>
                        </Button>
                    ) : null}
                </Toolbar>
            </StyledAppBar>
        </Box>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{}}>
                <Router>
                    <AppContainer>
                        <NavBar />
                        <Switch>
                            <Route path="/about" component={LandingPage} />
                            <Route
                                path="/login"
                                component={AuthenticationPage}
                            />
                            <Route path="/match" component={MatchingPage} />
                            <Route
                                path="/collaborate/:roomId"
                                component={CollaborationPage}
                            />
                            <Route
                                render={() => (
                                    <Redirect to={{ pathname: '/about' }} />
                                )}
                            />
                        </Switch>
                    </AppContainer>
                </Router>
            </AppContext.Provider>
        </ThemeProvider>
    );
}

export default App;
