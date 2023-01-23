import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { Message } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ScrollableFeed from 'react-scrollable-feed';
import { getMessages } from '../../../api/chat';
import { getUser } from '../../../api/user';
import socket from '../../../socket';
import './style.css';

const Chat = () => {
  const userInfo = useSelector((state) => state.users);
  const { userName } = useParams();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');

  const messageListener = useCallback(
    (message) => {
      message.author.id === user.id && setMessages((prev) => [...prev, message]);
    },
    [user.id],
  );

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setUser(data);
    };

    const onError = () => {
      setUser({});
    };

    getUser(userName).then(onSuccess).catch(onError);
  }, [userName]);

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setMessages(data);
    };

    const onError = () => {};

    user.id && getMessages(user.id).then(onSuccess).catch(onError);
  }, [userInfo.id, user]);

  useEffect(() => {
    socket.on('message', messageListener);
  }, [messageListener]);

  const sendMessage = () => {
    setMessages((prev) => [...prev, { author: { id: userInfo.id }, recipient: { id: user.id }, text: currentMessage }]);

    socket.emit('message', { author: { id: userInfo.id }, recipient: { id: user.id }, text: currentMessage });

    setCurrentMessage('');
  };

  return (
    <>
      <Box height={800}>
        <ScrollableFeed className='chat-scrollbar'>
          {messages.map((message, index) => {
            return (
              <Message
                key={index}
                style={{ marginLeft: '10px', marginRight: '10px' }}
                model={{
                  position: 'single',
                  message: `${message.text}`,
                  sentTime: 'just now',
                  sender: `${message.author.id}`,
                  direction: message.author.id === userInfo.id ? 'outgoing' : 'incoming',
                }}
              >
                <Message.Footer sender={message.author.fullName} sentTime='just now' />
              </Message>
            );
          })}
        </ScrollableFeed>
      </Box>

      <Flex w={900} position={'fixed'} bottom={0} marginBottom={10} marginTop={60}>
        <Input
          type='text'
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
        <Button w={200} marginLeft={10} onClick={sendMessage}>
          Send message
        </Button>
      </Flex>
    </>
  );
};

export default Chat;
