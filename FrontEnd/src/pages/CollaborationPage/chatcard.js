import { Grid, Button, Typography, Paper, List, ListItem, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { React, useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../utils/AppContext';
import SendIcon from '@mui/icons-material/Send';

function ChatCard(props) {
    const socket = props.socket;
    //const { user } = useContext(AppContext);
    let user = socket.id; //change this to the one from context later
    const [messages, setMessages] = useState([]);
    const [messageEntered, setMessageEntered] = useState('');


    const handleMessages = useCallback((newMessage, messageOwner) => {
        setMessages(messages => {
            return [...messages, {owner: messageOwner, message: newMessage}]
        });
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            user = socket.id; //remove this later
            socket.emit('room', {username: user, room: props.roomId});
        })
        socket.on('message', (username, message) => {
            handleMessages(message, username);
        });
        socket.on('entryMessage', (joinMessage) => {
            handleMessages(joinMessage, null);
        });
        return () => {
            //can add any unmounting logic here if needed
        }
    }, [socket, handleMessages]);
    

    const handleMessageSend = () => {
        socket.emit('interact', {username: user, message: messageEntered, room: props.roomId});
        handleMessages(messageEntered, user);
        setMessageEntered('');
    }
    return (
        <Grid container justifyContent="space-around" alignItems="center">
            <Grid item xs={12}>
                <Paper sx={{maxHeight: 400, overflow: 'auto'}}>
                    <List>
                        {messages.map((msg, index) => (<ChatMessage key={index} messageOwner={msg.owner} message={msg.message} user={user} id={index} />))}
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={12}>    
                <TextField id="message-input" label="Enter message" variant="outlined" value={messageEntered}
                    onChange={e=> setMessageEntered(e.target.value)}
                    InputProps={{endAdornment: <IconButton onClick={() => handleMessageSend()}><SendIcon /></IconButton>}}
                />
            </Grid>
        </Grid>
    );
}
const ChatText = styled(Typography)(({ theme }) => ({
    fontWeight: 100,
    color: '#FDFDFD'
}));

function ChatMessage({messageOwner, message, user, id}) {
    //rendering portion
    if (!messageOwner) {
        //need to somehow center this properly
        return (
            <ListItem key={id}>
                <ChatText align='center'>
                    {message}
                </ChatText>
            </ListItem>
        )
    }
    if (messageOwner === user) {
        return (
            <ListItem key={id} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <ChatText>
                    {message}
                </ChatText>
            </ListItem>
        )
    } else {
        return (
            <ListItem key={id} sx={{display: 'flex', justifyContent: 'flex-start'}}>
                <ChatText>
                    {message}
                </ChatText>
            </ListItem>
        );
    }
}

export default ChatCard;