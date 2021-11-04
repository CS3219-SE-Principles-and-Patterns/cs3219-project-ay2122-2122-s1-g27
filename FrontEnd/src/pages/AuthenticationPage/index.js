import { React, useState, useContext } from 'react';
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { AppContext } from '../../utils/AppContext';
import LoginPage from '../../assets/LoginPage.png';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';

const Image = styled('img')(({ theme }) => ({
    paddingTop: '10%',
    [theme.breakpoints.down('md')]: {
        height: '300px',
        width: '300px',
    },
    [theme.breakpoints.only('md')]: {
        height: '400px',
        width: '400px',
    },
    [theme.breakpoints.only('lg')]: {
        height: '450px',
        width: '450px',
    },
    [theme.breakpoints.only('xl')]: {
        height: '600px',
        width: '600px',
    },
}));

const StyledTextField = styled(FormControl)(({ theme }) => ({
    marginTop: '30px',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.only('md')]: {
        width: '90%',
    },
    [theme.breakpoints.only('lg')]: {
        width: '80%',
    },
    [theme.breakpoints.only('xl')]: {
        width: '60%',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: '30px',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.only('md')]: {
        width: '90%',
    },
    [theme.breakpoints.only('lg')]: {
        width: '80%',
    },
    [theme.breakpoints.only('xl')]: {
        width: '60%',
    },
    backgroundColor: '#FFC727 ',
    textTransform: 'none',
    padding: '2%',
}));

const StyledAlertMessage = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        width: '100%',
    },
    [theme.breakpoints.only('md')]: {
        width: '90%',
    },
    [theme.breakpoints.only('lg')]: {
        width: '80%',
    },
    [theme.breakpoints.only('xl')]: {
        width: '60%',
    },
}));

function AuthenticationPage() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [isIncorrectAttempt, setIncorrectAttempt] = useState(false);

    const { user, setUser, jwt, setJwt, setMatchingSocket } =
        useContext(AppContext);

    const handleChangeUsername = (event) => setUsername(event.target.value);
    const handleChangePassword = (event) => setPassword(event.target.value);

    const authenticate = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        };

        return fetch('http://localhost:8080/user/create', requestOptions).then(
            (data) => {
                if (data.status === 409 || data.status === 201) {
                    // already exists / successfully created, so can login
                    data.json().then((data) => performLogin());
                }
            }
        );
    };

    const performLogin = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        };

        return fetch('http://localhost:8080/user/login', requestOptions).then(
            (data) => {
                if (data.status === 401) {
                    // incorrect password
                    setIncorrectAttempt(true);
                } else if (data.status === 200) {
                    data.json().then((data) => {
                        // set JWT access token in session storage
                        setUser(username);
                        setJwt(data.data.accessToken);
                        sessionStorage.setItem('jwt', data.data.accessToken);
                        sessionStorage.setItem('user', username);

                        const socket = io('http://localhost:8080', {
                            extraHeaders: {
                                Authorization:
                                    'Bearer ' + sessionStorage.getItem('jwt'),
                            },
                        });
                        setMatchingSocket(socket);
                        sessionStorage.setItem('matchingSocket', socket);
                    });
                }
            }
        );
    };

    return (
        <Grid container>
            {(user || sessionStorage.getItem('user')) &&
            (jwt || sessionStorage.getItem('jwt')) ? (
                <Redirect to={{ pathname: '/match' }} />
            ) : null}
            <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                xs={12}
                sm={6}
            >
                <Image src={LoginPage} alt="Login-Page" />
            </Grid>
            <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                xs={12}
                sm={6}
            >
                <Grid item xs={12} sx={{ padding: '50px' }}>
                    <Typography
                        variant="h5"
                        sx={{ color: '#FCFCFC', fontWeight: 600 }}
                    >
                        Welcome Back!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#DBDBDB' }}>
                        Please log in / sign up with your username and password
                        🤠
                    </Typography>

                    <StyledTextField>
                        <InputLabel htmlFor="component-outlined-username">
                            Username
                        </InputLabel>
                        <OutlinedInput
                            id="component-outlined-username"
                            onChange={handleChangeUsername}
                            label="Username"
                        />
                    </StyledTextField>
                    <StyledTextField>
                        <InputLabel htmlFor="component-outlined-password">
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="component-outlined-password"
                            onChange={handleChangePassword}
                            label="Password"
                            type="password"
                        />
                    </StyledTextField>
                    {isIncorrectAttempt ? (
                        <StyledAlertMessage
                            align="center"
                            sx={{
                                color: '#CF0000',
                                marginTop: '30px',
                            }}
                        >
                            Your previous attempt had an incorrect password
                        </StyledAlertMessage>
                    ) : null}
                    <StyledButton
                        variant="contained"
                        onClick={() => authenticate()}
                        disabled={!username || !password}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{ color: '#FCFCFC', fontWeight: 600 }}
                        >
                            Log in / Sign up
                        </Typography>
                    </StyledButton>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AuthenticationPage;
