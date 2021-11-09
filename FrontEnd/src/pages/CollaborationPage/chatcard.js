import {
    Grid,
    Typography,
    Paper,
    List,
    ListItem,
    TextField,
    Chip,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { React, useCallback, useEffect, useState, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';

function ChatCard(props) {
    const socket = props.socket;
    //const { user } = useContext(AppContext);
    let user = sessionStorage.getItem('user');
    const [messages, setMessages] = useState([]);
    const [messageEntered, setMessageEntered] = useState('');

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleMessages = useCallback((newMessage, messageOwner) => {
        setMessages((messages) => {
            return [...messages, { owner: messageOwner, message: newMessage }];
        });
    }, []);

    const handleMessageSend = () => {
        socket.emit('interact', {
            username: user,
            message: messageEntered,
            room: props.roomId,
        });
        handleMessages(messageEntered, user);
        setMessageEntered('');
    };

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('room', { username: user, room: props.roomId });
        });
        socket.on('message', (username, message) => {
            handleMessages(message, username);
        });
        socket.on('entryMessage', (joinMessage) => {
            handleMessages(joinMessage, null);
        });
        return () => {
            //can add any unmounting logic here if needed
        };
    }, [socket, handleMessages, props.roomId, user]);

    return (
        <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={12}>
                <Paper
                    sx={{
                        height: 200,
                        overflow: 'auto',
                        position: 'relative',
                    }}
                >
                    <List>
                        {messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                messageOwner={msg.owner}
                                message={msg.message}
                                user={user}
                                id={index}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    sx={{ backgroundColor: '#222222' }}
                    id="message-input"
                    label="Enter message"
                    value={messageEntered}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            handleMessageSend();
                        }
                    }}
                    onChange={(e) => setMessageEntered(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => handleMessageSend()}>
                                <SendIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Grid>
        </Grid>
    );
}
const ChatText = styled(Typography)(({ theme }) => ({
    fontWeight: 100,
    color: '#FDFDFD',
}));

function ChatMessage({ messageOwner, message, user, id }) {
    //rendering portion
    if (!messageOwner) {
        //need to somehow center this properly
        return (
            <ListItem key={id}>
                <Grid container justifyContent="center">
                    <ChatText>
                        <i>{message}</i>
                    </ChatText>
                </Grid>
            </ListItem>
        );
    }
    if (messageOwner === user) {
        return (
            <ListItem
                key={id}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
                <Chip sx={{ backgroundColor: '#9BCC5F' }} label={message} />
            </ListItem>
        );
    } else {
        return (
            <ListItem
                key={id}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
            >
                <Chip sx={{ backgroundColor: '#1982FC' }} label={message} />
            </ListItem>
        );
    }
}

export default ChatCard;
