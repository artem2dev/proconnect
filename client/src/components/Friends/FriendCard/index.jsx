import { Avatar, Box, Button, Flex, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';
import { ImCross } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteFromFriends } from '../../../api/friend';
import { config } from '../../../config/app.config';

const FriendCard = ({ friend, userName }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const redirectToProfile = () => {
    navigate(`/profile/${friend?.userName}`);
  };

  const onDeleteFromFriends = () => {
    const onSuccess = () => {

    };

    const onError = () => {

    };

    deleteFromFriends(friend?.id).then(onSuccess).catch(onError);
  };

  return (
    <Box w={'full'} bgColor='RGBA(0, 0, 0, 0.2)' borderColor={'brand.gray'} shadow={'md'} rounded={8} mb={4}>
      <Stack
        w={'full'}
        direction={{ base: 'column', sm: 'row' }}
        justify='space-between'
        spacing={{ base: '3', md: '2' }}
        p={3}
      >
        <Stack p={1} spacing='4' direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }}>
          {!isMobile && (
            <Avatar
              onClick={redirectToProfile}
              cursor={'pointer'}
              size='sm'
              src={user?.id ? config.API + '/media/image/' + friend?.id : ''}
            />
          )}
          <Flex flexDirection={'column'} alignItems={'flex-start'}>
            <Button onClick={redirectToProfile} variant={'link'} fontWeight='medium'>
              {friend?.firstName + ' ' + friend?.lastName}
            </Button>
            <Button onClick={redirectToProfile} variant={'link'} fontWeight='medium'>
              {'@' + friend?.userName}
            </Button>
          </Flex>
        </Stack>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: '3', sm: '2' }}
          align={{ base: 'stretch', sm: 'center' }}
        >
          {user?.userName === userName && (
            <Button onClick={onDeleteFromFriends}>
              <Text marginRight={2}>Delete</Text>
              <ImCross color='white' />
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendCard;
