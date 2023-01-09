import { Box, Button, Icon, Square, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { acceptFriendRequest, declineFriendRequest } from '../../../api/friend';

const NotificationItem = ({ request }) => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const redirectToProfile = () => {
    navigate(`/profile/${request?.requestor?.userName}`);
  };

  const onAcceptRequest = () => {
    const onSuccess = () => {
      console.log('success');
    };

    const onError = () => {
      console.log('error');
    };

    acceptFriendRequest(request?.id).then(onSuccess).catch(onError);
  };

  const onDeclineRequest = () => {
    const onSuccess = () => {
      console.log('success');
    };

    const onError = () => {
      console.log('error');
    };

    declineFriendRequest(request?.id).then(onSuccess).catch(onError);
  };

  return (
    <Box w={'full'} bgColor='#ffffff' borderColor={'#dbdbdb'} shadow={'md'} rounded={8} mb={4}>
      <Stack
        w={'full'}
        direction={{ base: 'column', sm: 'row' }}
        justify='space-between'
        spacing={{ base: '3', md: '2' }}
        p={3}
      >
        <Stack spacing='4' direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }}>
          {!isMobile && (
            <Square size='12' bg='bg-subtle' borderRadius='md'>
              <Icon as={FiInfo} boxSize='6' />
            </Square>
          )}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '0.5', md: '1.5' }}
            pe={{ base: '4', sm: '0' }}
          >
            <Text fontWeight='medium'>New friend request from </Text>
            <Text fontWeight='black' cursor={'pointer'} onClick={redirectToProfile}>
              {request?.requestor?.userName}
            </Text>
          </Stack>
        </Stack>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: '3', sm: '2' }}
          align={{ base: 'stretch', sm: 'center' }}
        >
          <Button
            size={'sm'}
            bgColor={'black'}
            variant='primary'
            width='full'
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'scale(0.95)',
              boxShadow: 'md',
            }}
            boxShadow={'md'}
            onClick={onAcceptRequest}
          >
            <ImCheckmark color='white' />
          </Button>
          <Button variant={'black'} onClick={onDeclineRequest}>
            <ImCross color='white' />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotificationItem;
