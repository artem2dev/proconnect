import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { ConversationHeader, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ScrollableFeed from 'react-scrollable-feed';
import { getMessages } from '../../../api/chat';
import { getUser } from '../../../api/user';
import { config } from '../../../config/app.config';
import socket from '../../../socket';
import './style.css';

const Chat = () => {
  const userInfo = useSelector((state) => state.user);
  const navigate = useNavigate();
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
    const newMessages = readNewMessagesMessages();

    if (!newMessages?.length) return;

    socket.emit('chatRead', { userId: userInfo?.id, messages: newMessages, roomId: room });
  }, [readNewMessagesMessages, room, userInfo?.id]);

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
      roomId: room,
    });

    setCurrentMessage('');
  };

  const onKeyDown = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      sendMessage();
    }
  };

  const onBack = () => {
    navigate('/messages');
  };

  const handleRedirectToProfile = () => {
    navigate(`/profile/${user?.userName}`);
  };

  const countDateAgo = (message) => {
    const minutesAgo = Math.round((Date.now() - new Date(message?.createdAt)) / 1000 / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(monthsAgo / 12);

    if (minutesAgo <= 1) {
      return 'just now';
    } else if (minutesAgo <= 55) {
      return `${minutesAgo} minutes`;
    } else if (minutesAgo > 55 && minutesAgo <= 1380) {
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
      <ConversationHeader style={{ width: '100%', backgroundColor: '#202231', borderWidth: 0, borderRadius: 8, boxShadow: 0 }}>
        <ConversationHeader.Back onClick={onBack} />
        <ConversationHeader.Content onClick={handleRedirectToProfile}>
          {user?.id && (
            <Flex alignItems={'center'} cursor={'pointer'}>
              <Avatar src={`${config.API}/media/image/` + user.id} marginX={4} />
              <Text color={'white'}>{`${user?.firstName} ${user?.lastName}`}</Text>
            </Flex>
          )}
        </ConversationHeader.Content>
      </ConversationHeader>
      <Box height={window.innerHeight - 160} style={{ backgroundColor: '#171923' }}>
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
                  sender={countDateAgo(message)}
                  sentTime={message?.userId === userInfo?.id ? countDateAgo(message) : ''}
                  style={{ textAlign: 'center', fontSize: 11, letterSpacing: -0.4 }}
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
        style={{ textAlign: 'left', backgroundColor: '#171923', marginTop: '20px' }}
        onKeyDown={onKeyDown}
        placeholder='Type message here...'
        autoFocus
      />
    </Flex>
  );
};

export default Chat;
