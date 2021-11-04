import { React, Component } from 'react';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import '../../App.css';
import { AppContext } from '../../utils/AppContext';

//code-mirror stuff
import { Controlled as Codemirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

import io from 'socket.io-client';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/clike/clike');
require('codemirror/mode/python/python');

const socket = io('http://localhost:5005');

class CollaborationPage extends Component {
    static contextType = AppContext;

    constructor(props) {
        //make sure to receive room id and question from props
        super(props);
        this.state = {
            code: 'x = "Hello World";',
            lang: 'javascript',
            question: null,
        };
        this.useReceivedCode = this.useReceivedCode.bind(this);
        this.brodcastUpdatedCode = this.broadcastUpdatedCode.bind(this);
        this.brodcastUpdatedLang = this.broadcastUpdatedLang.bind(this);
        this.handleLangChange = this.handleLangChange.bind(this);
        this.roomId =
            'd5bfd8c21114ae407a0c22f91f5969f515b997180da35d963fa41d2c3771fdcd'; // props.roomId
    }

    componentDidMount() {
        // fetch Question Data using room id: DONE
        const { jwt } = this.context;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt,
            },
        };

        fetch(
            'http://localhost:8081/question/room/' + this.roomId,
            requestOptions
        )
            .then((data) => data.json())
            .then((questionData) => {
                this.setState({
                    question: questionData.data.question,
                });
            });

        //crucial for these socket operations NOT to be in constructor to avoid synchronization errors
        //take roomId from props
        socket.emit('room', { room: this.roomId });
        socket.on('receive code', (newCode) => {
            this.useReceivedCode(newCode);
        });

        socket.on('new user joined', () => {
            console.log('sending ' + this.state.code + ' to new user');
            this.broadcastUpdatedCode(this.roomId, this.state.code);
            this.broadcastUpdatedLang(this.roomId, this.state.lang);
        });

        socket.on('receive lang', (newLang) => {
            this.useReceivedLang(newLang);
        });
    }

    broadcastUpdatedCode(roomId, newCode) {
        socket.emit('coding event', {
            room: roomId,
            newCode: newCode,
        });
    }

    broadcastUpdatedLang(roomId, newLang) {
        socket.emit('lang event', {
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
            <Grid container sx={{ alignContent: 'center' }}>
                {this.state.question ? <div> questionLoaded </div> : null}
                <Typography
                    variant="h5"
                    sx={{ color: '#FCFCFC', fontWeight: 600 }}
                >
                    You are now Collaborating!
                </Typography>
                <Grid item md={6} xs={10} lg={5}>
                    <Codemirror
                        value={this.state.code}
                        onChange={(editor, metadata, value) => {
                            //check the origin of the change
                            //fire socket event ONLY when change caused by input
                            if (metadata.origin) {
                                this.broadcastUpdatedCode(this.roomId, value); //change to props.roomId later
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
                </Grid>
                <Grid item xs={6} md={4} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="lang-label">Language</InputLabel>
                        <Select
                            labelId="lang-label"
                            id="lang"
                            value={this.state.lang}
                            label="Choose your Language"
                            onChange={this.handleLangChange}
                        >
                            <MenuItem value={'javascript'}>JavaScript</MenuItem>
                            <MenuItem value={'text/x-java'}>Java</MenuItem>
                            <MenuItem value={'python'}>Python</MenuItem>
                            <MenuItem value={'text/x-csrc'}>C</MenuItem>
                            <MenuItem value={'text/x-c++src'}>C++</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}

export default CollaborationPage;
