import { Avatar, Button, Flex, Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api/user';
import { addToFriends as addToFriendsRequest } from '../../api/friend';

const Profile = () => {
  const colors = {
    button: useColorModeValue('#151f21', 'gray.900'),
  };
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

  return (
    <Flex>
      {user?.id && (
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          bgColor='#ffffff'
          rounded={8}
          padding={8}
          w={'full'}
          border={'1px'}
          borderColor={'#dbdbdb'}
        >
          <Flex w={'400px'} alignItems='center' justifyContent={'space-between'}>
            <Avatar height={150} width={150} src={user?.id ? 'http://localhost:5000/media/image/' + user?.id : ''} />
            <VStack spacing={1} display={'flex'} alignItems={'flex-start'} w='220px'>
              <Heading as='h3' fontSize='xl' color='brand.dark' maxW={'220px'}>
                {user?.userName}
              </Heading>
              <Text color='brand.gray' fontSize='sm' maxW={'220px'}>
                {`${user?.firstName} ${user?.lastName}`}
              </Text>
            </VStack>
          </Flex>
          <Flex w={'320px'} justifyContent={'space-between'}>
            <Button w={'130px'} variant={'black'} onClick={addToFriends}>
              Add to friends
            </Button>
            <Button w={'130px'} variant={'black'}>
              Message
            </Button>
            <Button w={'10px'} variant={'black'}>
              ...
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
