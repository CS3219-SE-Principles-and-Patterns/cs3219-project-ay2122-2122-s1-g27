import * as React from 'react';
import { Box, Modal, Button, Typography, Grid } from '@mui/material';
import Waiting from '../../assets/waiting.svg';
import Sorry from '../../assets/sorry.svg';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';

const style = {
    position: 'absolute',
    color: 'white',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '21px',
    boxShadow: 24,
    pt: 2,
    pb: 2,
    px: 10,
};

export default function MatchingModal(props) {
    const [open, setOpen] = React.useState(props.shouldOpen);
    const [timeLeft, setTimeLeft] = React.useState(props.timeLeft);
    const [isMatching, setIsMatching] = React.useState(true);
    const [roomId, setRoomId] = React.useState(null);

    const handleClose = () => {
        if (timeLeft == 0) {
            props.setShouldOpenModal(false);
        }
    };

    // listeners
    props.socket.on('matchSuccess', (roomId, matchedUser) => {
        // redirect to collab page
        setRoomId(roomId);
    });

    // event listener
    props.socket.on('matchFail', () => {
        setIsMatching(false);
    });

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) =>
                prevTimeLeft <= 0 ? 0 : prevTimeLeft - 1
            );
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                {roomId ? (
                    <Redirect
                        to={{
                            pathname: '/collaborate',
                            state: {
                                roomId: roomId,
                            },
                        }}
                    />
                ) : timeLeft != 0 ? (
                    <Box sx={{ ...style, width: 300 }}>
                        <h2 id="child-modal-title"></h2>
                        <Typography variant="h6" align="center">
                            Currently finding you a match!
                        </Typography>
                        <Typography align="center" sx={{ padding: '10px' }}>
                            Hang in there... Time left: {timeLeft} seconds
                        </Typography>

                        <img src={Waiting} />

                        <Typography
                            variant="subtitle1"
                            sx={{ padding: '10px' }}
                        >
                            <i>
                                You will be redirected to a new page if there's
                                another buddy that is a match for you!
                            </i>
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ ...style, width: 300 }}>
                        <h2 id="child-modal-title"></h2>
                        <Typography variant="h6" align="center">
                            Could not find you a match...
                        </Typography>

                        <img src={Sorry} />

                        <Typography
                            variant="subtitle1"
                            sx={{ padding: '10px' }}
                        >
                            <i>
                                We'd love for you to try again another time...
                            </i>
                        </Typography>
                        <Grid container justifyContent="center">
                            <Button onClick={handleClose}>
                                Go back to Matching Page
                            </Button>
                        </Grid>
                    </Box>
                )}
            </Modal>
        </React.Fragment>
    );
}
