import { Avatar, Box, Card, CardBody, Flex, keyframes, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getChats } from '../../api/chat';
import { config } from '../../config/app.config';
import socket from '../../socket';

const activeColor = 'green.500';
const ringScaleMin = 0.33;
const ringScaleMax = 0.66;

const pulseRing = keyframes`
0% {
  transform: scale(${ringScaleMin});
}
30% {
  transform: scale(${ringScaleMax});
}
40%,
50% {
  opacity: 0;
}
100% {
  opacity: 0;
}
`;

const pulseDot = keyframes`
0% {
  transform: scale(0.9);
}
25% {
  transform: scale(1.1);
}
50% {
  transform: scale(0.9);
}
100% {
  transform: scale(0.9);
}
`;

const Messages = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);

  const messageListener = useCallback(
    (data) => {
      if (userInfo?.id !== data?.userId) {
        setChats((prev) => {
          let isChatExists = false;

          prev = prev.map((chat) => {
            if (chat.message.roomId === data.message.roomId) {
              isChatExists = true;

              return { ...chat, message: data.message };
            }

            return chat;
          });

          return isChatExists
            ? prev.sort((a, b) => (a?.message?.createdAt > b?.message?.createdAt ? -1 : 1))
            : [data, ...prev].sort((a, b) => (a?.message?.createdAt > b?.message?.createdAt ? -1 : 1));
        });
      }
    },
    [userInfo?.id],
  );

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setChats(data);
    };

    const onError = (error) => {
      console.error(error);
    };

    getChats().then(onSuccess).catch(onError);
  }, []);

  useEffect(() => {
    socket.on('message', messageListener);
  }, [messageListener]);

  const onChatClick = (userName) => {
    navigate(`${userName}`);
  };

  return (
    <Flex direction={'column'}>
      {chats.map((chat, index) => {
        const recipient = userInfo?.id === chat?.user1?.id ? chat?.user2 : chat?.user1;

        return (
          <Box key={index} w={'full'} cursor={'pointer'} marginBottom={2}>
            <Card onClick={() => onChatClick(recipient?.userName)}>
              <CardBody display={'flex'} flexDirection={'row'}>
                <Avatar h={'40px'} w={'40px'} marginRight={5} src={config.API + '/media/image/' + recipient?.id} />
                <Flex w={'full'} direction={'column'}>
                  <Text>{`${recipient?.firstName} ${recipient?.lastName}`}</Text>
                  <Flex alignItems={'center'}>
                    <Box
                      textAlign={'left'}
                      h={'fit-content'}
                      w={'full'}
                      borderRadius={10}
                      paddingX={2}
                      paddingY={0.5}
                      bgColor='#4b4f5099'
                      marginTop={1}
                    >
                      <Text w={700} whiteSpace={'nowrap'}>
                        {chat?.message?.text}
                      </Text>
                    </Box>

                    {!chat?.message?.wasRead && chat?.message?.userId !== userInfo?.id && (
                      <Box
                        as='div'
                        h='20px'
                        w='20px'
                        ml={5}
                        position='relative'
                        bgColor={activeColor}
                        borderRadius='50%'
                        _before={{
                          content: "''",
                          position: 'relative',
                          display: 'block',
                          width: '300%',
                          height: '300%',
                          boxSizing: 'border-box',
                          marginLeft: '-100%',
                          marginTop: '-100%',
                          borderRadius: '50%',
                          bgColor: activeColor,
                          animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
                        }}
                        _after={{
                          animation: `2.25s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
                        }}
                      />
                    )}
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          </Box>
        );
      })}
    </Flex>
  );
};

export default Messages;
