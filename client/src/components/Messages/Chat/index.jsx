import { Box, Flex } from '@chakra-ui/react';
import { Message, MessageInput } from '@chatscope/chat-ui-kit-react';
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
  const userInfo = useSelector((state) => state.user);
  const { userName } = useParams();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [room, setRoom] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');

  const readNewMessagesMessages = useCallback(() => {
    const newMessages = [];

    messages
      .slice()
      .reverse()
      .forEach((message) => {
        if (message.userId === userInfo?.id) {
          return;
        } else {
          !message?.wasRead && message?.userId !== userInfo?.id && newMessages.push(message.id);
        }
      });

    return newMessages;
  }, [messages, userInfo?.id]);

  const messageListener = useCallback(
    ({ message }) => {
      room === message.roomId && setMessages((prev) => [...prev, message]);
    },
    [room],
  );

  useEffect(() => {
    if (!readNewMessagesMessages()?.length) return;

    socket.emit('chatRead', { roomId: room, userId: userInfo?.id, messages: readNewMessagesMessages() });
  }, [readNewMessagesMessages, room, userInfo?.id]);

  useEffect(() => {
    socket.on('chatRead', { id: messages[messages.length - 1] });
  });

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
      setMessages(data.messages);
      setRoom(data.room);
    };

    const onError = () => {};

    user.id && getMessages(user.id).then(onSuccess).catch(onError);
  }, [user]);

  useEffect(() => {
    socket.on('message', messageListener);
  }, [messageListener]);

  const sendMessage = () => {
    socket.emit('message', {
      message: { roomId: room, userId: userInfo?.id, text: currentMessage },
      user1: {
        id: userInfo?.id,
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
        avatarId: userInfo?.avatarId,
      },
      user2: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        avatarId: user?.avatarId,
      },
    });

    setCurrentMessage('');
  };

  const onKeyDown = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      sendMessage();
    }
  };

  const countDateAgo = (message) => {
    const minutesAgo = Math.round((Date.now() - new Date(message?.createdAt)) / 1000 / 60);
    const hoursAgo = Math.round(minutesAgo / 60);
    const daysAgo = Math.round(hoursAgo / 24);
    const monthsAgo = Math.round(daysAgo / 30);
    const yearsAgo = Math.round(monthsAgo / 12);

    if (minutesAgo <= 1) {
      return 'just now';
    } else if (minutesAgo <= 55) {
      return `${minutesAgo} minutes`;
    } else if (minutesAgo > 115 && minutesAgo <= 1380) {
      return hoursAgo + (hoursAgo <= 1 ? ' hour' : ' hours');
    } else if (hoursAgo >= 23 && hoursAgo <= 720) {
      return daysAgo + (daysAgo <= 1 ? ' day' : ' days');
    } else if (daysAgo >= 30 && daysAgo <= 364) {
      return monthsAgo + (monthsAgo <= 1 ? ' month' : ' months');
    } else {
      return yearsAgo + (yearsAgo <= 1 ? ' year' : ' years');
    }
  };

  return (
    <Flex direction={'column'} justifyContent={'space-between'}>
      <Box height={850} style={{ backgroundColor: '#171923' }}>
        <ScrollableFeed className='chat-scrollbar'>
          {messages.map((message, index) => {
            return (
              <Message
                key={index}
                style={{ marginLeft: '10px', marginRight: '10px' }}
                model={{
                  position: 'single',
                  message: `${message?.text}`,
                  sentTime: 'just now',
                  direction: message?.userId === userInfo?.id ? 'outgoing' : 'incoming',
                }}
              >
                <Message.Footer
                  // sender={
                  //   message?.userId === user?.id
                  //     ? `${userInfo?.firstName} ${userInfo?.lastName}`
                  //     : `${user?.firstName} ${user?.lastName}`
                  // }
                  style={{ textAlign: 'center' }}
                  sentTime={countDateAgo(message)}
                />
              </Message>
            );
          })}
        </ScrollableFeed>
      </Box>

      {/* <Flex w={'full'} marginTop={10}>
        <Input
          type='text'
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyDown={onKeyDown}
        />
        <Button w={200} marginLeft={10} onClick={sendMessage}>
          Send message
        </Button>
      </Flex> */}
      <MessageInput
        onSend={sendMessage}
        value={currentMessage}
        onChange={setCurrentMessage}
        style={{ textAlign: 'left', backgroundColor: '#171923', marginTop: '40px' }}
        onKeyDown={onKeyDown}
        placeholder='Type message here...'
        autoFocus
      />
    </Flex>
  );
};

export default Chat;
