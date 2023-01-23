import { Avatar, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addToFriends as addToFriendsRequest } from '../../api/friend';
import { getUser } from '../../api/user';
import { config } from '../../config/app.config';

const Profile = () => {
  const userInfo = useSelector((state) => state.users);
  const navigate = useNavigate();
  const { userName } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setUser(data);
    };

    const onError = () => {
      setUser({});
    };

    getUser(userName).then(onSuccess).catch(onError);
  }, [userName]);

  const addToFriends = () => {
    const onSuccess = () => {
      console.info('success');
    };

    const onError = (error) => {
      console.error(error);
    };

    addToFriendsRequest(user?.id || '')
      .then(onSuccess)
      .catch(onError);
  };

  const onFriendsCounter = () => {
    navigate(`/profile/${userName}/friends`);
  };

  const navigateToMessages = () => {
    navigate(`/messages/${userName}`);
  };

  return (
    <Flex>
      {user?.id && (
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          padding={8}
          w={'full'}
          border={'1px'}
          color={'white'}
          borderColor={'#2D3748'}
        >
          <Avatar
            height={150}
            width={150}
            marginRight={5}
            src={user?.id ? config.API + '/media/image/' + user?.id : ''}
          />
          <Flex w={'350px'} alignItems='center' justifyContent={'space-between'}>
            <VStack spacing={1} display={'flex'} alignItems={'flex-start'} w='180px'>
              <Heading as='h3' fontSize='xl' maxW={'220px'}>
                {user?.userName}
              </Heading>
              <Text color='brand.gray' fontSize='sm' maxW={'220px'}>
                {`${user?.firstName} ${user?.lastName}`}
              </Text>
              <Text textAlign={'start'} w={'330px'}>
                {user?.description}
              </Text>
            </VStack>
          </Flex>
          <Flex grow={1}>
            <Button variant={'link'} onClick={onFriendsCounter} maxW={80}>
              <Text fontWeight={900}>{user?.userFriendsCount}</Text>
              <Text fontWeight={200} ml={2}>
                {user?.userFriendsCount === 1 ? 'friend' : 'friends'}
              </Text>
            </Button>
          </Flex>
          {userInfo?.userName !== userName ? (
            <Flex w={'320px'} justifyContent={'space-between'}>
              <Button w={'130px'} onClick={addToFriends}>
                Add to friends
              </Button>
              <Button w={'130px'} onClick={navigateToMessages}>
                Message
              </Button>
              <Button w={'10px'}>...</Button>
            </Flex>
          ) : (
            <Button w={'130px'}>Profile settings</Button>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
