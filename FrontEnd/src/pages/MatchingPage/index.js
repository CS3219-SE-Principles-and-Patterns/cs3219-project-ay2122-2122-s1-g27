import { React, useState, useContext, useEffect } from 'react';
import {
    Grid,
    Chip,
    Typography,
    Divider,
    Button,
    Box,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { styled } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';
import { AppContext } from '../../utils/AppContext';

const TopicsContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
}));

function MatchingPage() {
    const { jwt } = useContext(AppContext);

    const [topics, setTopics] = useState(null);
    const [difficulties, setDifficulties] = useState(null);

    // instantiate topics and difficulties
    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        };

        return fetch('http://localhost:8081/question/metadata', requestOptions)
            .then((data) => data.json())
            .then((metadata) => {
                setTopics(metadata.TOPICS);
                setDifficulties(metadata.DIFFICULTIES);
            });
    }, []);

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);

    const handleSelectedTopic = (topicName) => {
        if (!selectedTopics.includes(topicName)) {
            setSelectedTopics([...selectedTopics, topicName]);
        } else {
            setSelectedTopics([
                ...selectedTopics.filter(
                    (value, index, arr) => value !== topicName
                ),
            ]);
        }
    };

    const handleSelectedDifficulty = (difficultyName) => {
        if (!selectedDifficulties.includes(difficultyName)) {
            setSelectedDifficulties([...selectedDifficulties, difficultyName]);
        } else {
            setSelectedDifficulties([
                ...selectedDifficulties.filter(
                    (value, index, arr) => value !== difficultyName
                ),
            ]);
        }
    };

    const difficultyColors = ['#31CC53', '#CBB230', '#CC4949'];

    const steps = ['Choose Topics', 'Choose Difficulties', 'Match & Code!'];

    function HorizontalLabelPositionBelowStepper() {
        return (
            <Box sx={{ paddingTop: '50px', width: '50%' }}>
                <Stepper
                    activeStep={
                        selectedTopics.length > 0 &&
                        selectedDifficulties.length > 0
                            ? 2
                            : selectedTopics.length > 0
                            ? 1
                            : 0
                    }
                    alternativeLabel
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        );
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} sx={{ padding: '25px' }}>
                <Typography
                    align="center"
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 'bold' }}
                >
                    What do you feel like doing today?
                </Typography>
            </Grid>

            <Grid item xs={6} md={6} sx={{ paddingTop: '10px' }}>
                <TopicsContainer>
                    {topics &&
                        Object.values(topics).map((topic, idx) => (
                            <Chip
                                key={topic + idx}
                                label={topic}
                                clickable
                                size="medium"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '20px',
                                    marginLeft: '7px',
                                    marginRight: '7px',
                                    textShadow: '1px 1px #000000',
                                    backgroundColor: selectedTopics.includes(
                                        topic
                                    )
                                        ? '#7CA34C'
                                        : '#96AE9D',
                                    '&:hover,&:focus': {
                                        backgroundColor:
                                            selectedTopics.includes(topic)
                                                ? '#7CA34C'
                                                : '#96AE9D',
                                    },
                                }}
                                onClick={() => handleSelectedTopic(topic)}
                                avatar={
                                    selectedTopics.includes(topic) ? (
                                        <DoneIcon />
                                    ) : null
                                }
                            />
                        ))}
                </TopicsContainer>
            </Grid>
            <Grid item xs={10}>
                <Divider
                    sx={{
                        marginLeft: '35%',
                        marginRight: '35%',
                        width: '30%',
                        height: '1px',
                        marginTop: '20px',
                        backgroundColor: '#D4B2FF',
                    }}
                />
            </Grid>
            <Grid item xs={8} md={6} sx={{ paddingTop: '25px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                    }}
                >
                    {difficulties &&
                        Object.values(difficulties).map((difficulty, idx) => (
                            <Chip
                                key={difficulty + idx}
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '4%',
                                    textShadow: '1px 1px #000000',
                                    backgroundColor:
                                        selectedDifficulties.includes(
                                            difficulty
                                        )
                                            ? difficultyColors[idx]
                                            : difficultyColors[idx],
                                    '&:hover,&:focus': {
                                        backgroundColor:
                                            selectedDifficulties.includes(
                                                difficulty
                                            )
                                                ? difficultyColors[idx]
                                                : difficultyColors[idx],
                                    },
                                }}
                                clickable={
                                    selectedTopics.length > 0 ||
                                    selectedDifficulties.includes(difficulty)
                                }
                                onClick={() => {
                                    if (
                                        selectedTopics.length > 0 ||
                                        selectedDifficulties.includes(
                                            difficulty
                                        )
                                    ) {
                                        handleSelectedDifficulty(difficulty);
                                    }
                                }}
                                label={difficulty}
                                avatar={
                                    selectedDifficulties.includes(
                                        difficulty
                                    ) ? (
                                        <DoneIcon />
                                    ) : null
                                }
                            />
                        ))}
                </div>
            </Grid>
            <Grid item xs={10}>
                <Divider
                    sx={{
                        marginLeft: '35%',
                        marginRight: '35%',
                        width: '30%',
                        height: '1px',
                        marginTop: '20px',
                        backgroundColor: '#EAD077',
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '40px',
                    }}
                >
                    <Button
                        variant="contained"
                        disabled={
                            selectedTopics.length === 0 ||
                            selectedDifficulties.length === 0
                        }
                        sx={{
                            width: '200px',
                            borderRadius: '7px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: '#69994C',
                        }}
                    >
                        Match
                    </Button>
                </div>
            </Grid>

            <HorizontalLabelPositionBelowStepper />
        </Grid>
    );
}

export default MatchingPage;
