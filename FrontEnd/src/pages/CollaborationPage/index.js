import { React, Component, useState, useEffect, useContext } from 'react';
import {
    FormControl,
    Box,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Divider,
    Button,
    CircularProgress,
} from '@mui/material';
import '../../App.css';
import { AppContext } from '../../utils/AppContext';

//code-mirror stuff
import { Controlled as Codemirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

import io from 'socket.io-client';
import ChatCard from './chatcard';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/clike/clike');
require('codemirror/mode/python/python');

class CollaborationPage extends Component {
    static contextType = AppContext;

    constructor(props) {
        //make sure to receive room id and question from props
        super(props);
        this.state = {
            code: 'x = "Hello World";',
            lang: 'javascript',
        };
        this.useReceivedCode = this.useReceivedCode.bind(this);
        this.brodcastUpdatedCode = this.broadcastUpdatedCode.bind(this);
        this.brodcastUpdatedLang = this.broadcastUpdatedLang.bind(this);
        this.handleLangChange = this.handleLangChange.bind(this);
        this.roomId =
            'd5bfd8c21114ae407a0c22f91f5969f515b997180da35d963fa41d2c3771fdcd'; // props.roomId
        this.socket = sessionStorage.getItem('collabSocket');
        this.chatSocket = sessionStorage.getItem('chatTextSocket');
        // console.log(this.props.location.state.roomId);
    }

    componentDidMount() {
        //crucial for these socket operations NOT to be in constructor to avoid synchronization errors
        //take roomId from props
        const { jwt} = this.context;

        this.socket.emit('room', { room: this.roomId, jwt: jwt });
        this.socket.on('receive code', (newCode) => {
            this.useReceivedCode(newCode);
        });

        this.socket.on('new user joined', () => {
            console.log('sending ' + this.state.code + ' to new user');
            this.broadcastUpdatedCode(this.roomId, this.state.code);
            this.broadcastUpdatedLang(this.roomId, this.state.lang);
        });

        this.socket.on('receive lang', (newLang) => {
            this.useReceivedLang(newLang);
        });
    }

    broadcastUpdatedCode(roomId, newCode) {
        this.socket.emit('coding event', {
            room: roomId,
            newCode: newCode,
        });
    }

    broadcastUpdatedLang(roomId, newLang) {
        this.socket.emit('lang event', {
            room: roomId,
            newLang: newLang,
        });
    }
    useReceivedCode(newCode) {
        this.setState({ code: newCode });
    }

    useReceivedLang(newLang) {
        this.setState({ lang: newLang });
    }

    handleLangChange(event) {
        this.setState({
            lang: event.target.value,
        });
        this.broadcastUpdatedLang(this.roomId, event.target.value);
    }

    render() {
        const codeMirrorOptions = {
            lineNumbers: true,
            mode: this.state.lang,
            theme: 'monokai',
        };
        return (
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: '100vh',
                    }}
                >
                    <QuestionPanel roomId={this.roomId} />
                </Grid>
                <Grid container xs={12} sm={6} md={8} lg={9}>
                    <Grid item xs={12} sx={{ padding: 0 }}>
                        <Box
                            component="div"
                            sx={{
                                backgroundColor: '#393E46',
                                padding: '10px',
                            }}
                        >
                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid item>
                                    <FormControl
                                        sx={{
                                            width: '150px',
                                            marginTop: '10px',
                                        }}
                                    >
                                        <InputLabel id="lang-label">
                                            Language
                                        </InputLabel>
                                        <Select
                                            labelId="lang-label"
                                            id="lang"
                                            value={this.state.lang}
                                            label="Choose your Language"
                                            onChange={this.handleLangChange}
                                        >
                                            <MenuItem value={'javascript'}>
                                                JavaScript
                                            </MenuItem>
                                            <MenuItem value={'text/x-java'}>
                                                Java
                                            </MenuItem>
                                            <MenuItem value={'python'}>
                                                Python
                                            </MenuItem>
                                            <MenuItem value={'text/x-csrc'}>
                                                C
                                            </MenuItem>
                                            <MenuItem value={'text/x-c++src'}>
                                                C++
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item>
                                    <Button
                                        sx={{
                                            backgroundColor: '#1EA94C',
                                            height: '40px',
                                            width: '125px',
                                            color: 'white',
                                        }}
                                        variant="contained"
                                    >
                                        <b>Finish & Exit</b>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Codemirror
                            value={this.state.code}
                            onChange={(editor, metadata, value) => {
                                //check the origin of the change
                                //fire socket event ONLY when change caused by input
                                if (metadata.origin) {
                                    this.broadcastUpdatedCode(
                                        this.roomId,
                                        value
                                    ); //change to props.roomId later
                                } else {
                                    console.log(
                                        'change caused by other user: not firing emit'
                                    );
                                }
                                //console.log(editor.getCursor());
                            }}
                            onBeforeChange={(editor, metadata, value) => {
                                this.setState({ code: value });
                            }}
                            options={codeMirrorOptions}
                        />
                        <Grid item xs={12}>
                            <ChatCard
                                roomId={this.roomId}
                                socket={this.chatSocket}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

function QuestionPanel(props) {
    const [question, setQuestion] = useState(null);
    const { jwt } = useContext(AppContext);

    useEffect(() => {
        // fetch Question Data using room id: DONE
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        };

        return fetch(
            'http://localhost:8081/question/room/' + props.roomId,
            requestOptions
        )
            .then((data) => data.json())
            .then((questionData) => {
                console.log(questionData);
                setQuestion(questionData.data.question);
            });
    }, []);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    return question ? (
        <Grid
            container
            sx={{
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '10px',
            }}
        >
            <Grid item id="title" xs={12}>
                <Typography sx={{ color: '#FCFCFC' }}>
                    <b>{question.title}</b>
                </Typography>
            </Grid>
            <Divider
                sx={{
                    height: '1px',
                    width: '100%',
                    marginBottom: '20px',
                    marginTop: '20px',
                }}
            />
            <Grid item id="description">
                {question.questionBody.map((paragraph, idx) => (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: '#FCFCFC', paddingBottom: '10px' }}
                        id={'description-' + idx}
                    >
                        {paragraph}
                    </Typography>
                ))}
            </Grid>
            <Divider
                sx={{
                    height: '1px',
                    width: '100%',
                    marginBottom: '20px',
                    marginTop: '20px',
                }}
            />
            <Grid item id="sample-cases">
                {question.sampleCases?.map((paragraph, idx) => (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: '#FCFCFC', paddingBottom: '10px' }}
                        id={'sample-cases-' + idx}
                    >
                        <Typography variant="subtitle1">
                            <b>Example {idx + 1}</b>
                        </Typography>
                        <Typography variant="subtitle2">
                            Input: {paragraph.input}
                        </Typography>
                        <Typography variant="subtitle2">
                            Output: {paragraph.output}
                        </Typography>
                    </Typography>
                ))}
            </Grid>
            <Divider
                sx={{
                    height: '1px',
                    width: '100%',
                    marginBottom: '20px',
                    marginTop: '20px',
                }}
            />
            <Grid item id="constraints">
                <Typography sx={{ color: '#FCFCFC', paddingBottom: '20px' }}>
                    <b>Constraints</b>
                </Typography>
                {question.constraints?.map((paragraph, idx) => (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: '#FCFCFC', paddingBottom: '10px' }}
                        id={'constraints-' + idx}
                    >
                        {paragraph}
                    </Typography>
                ))}
            </Grid>
            <Divider
                sx={{
                    height: '1px',
                    width: '100%',
                    marginBottom: '20px',
                    marginTop: '20px',
                }}
            />
            <Grid
                container
                justifyContent="center"
                id="answer"
                sx={{ paddingTop: '30px', paddingBottom: '50px' }}
            >
                <Button
                    variant="contained"
                    sx={{ textDecoration: 'none' }}
                    onClick={() => openInNewTab(question.answer)}
                >
                    <b>View Solution</b>
                </Button>
            </Grid>
        </Grid>
    ) : (
        <Grid container justifyContent="center">
            <CircularProgress />
        </Grid>
    );
}

export default CollaborationPage;
