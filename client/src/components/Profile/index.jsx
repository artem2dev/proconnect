import { Avatar, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToFriends as addToFriendsRequest } from '../../api/friend';
import { getUser } from '../../api/user';

const Profile = () => {
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
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          padding={8}
          w={'full'}
          border={'1px'}
          color={'white'}
          borderColor={'#2D3748'}
        >
          <Flex w={'400px'} alignItems='center' justifyContent={'space-between'}>
            <Avatar height={150} width={150} src={user?.id ? 'http://localhost:5000/media/image/' + user?.id : ''} />
            <VStack spacing={1} display={'flex'} alignItems={'flex-start'} w='220px'>
              <Heading as='h3' fontSize='xl' maxW={'220px'}>
                {user?.userName}
              </Heading>
              <Text color='brand.gray' fontSize='sm' maxW={'220px'}>
                {`${user?.firstName} ${user?.lastName}`}
              </Text>
            </VStack>
          </Flex>
          <Flex w={'320px'} justifyContent={'space-between'}>
            <Button w={'130px'} onClick={addToFriends}>
              Add to friends
            </Button>
            <Button w={'130px'}>Message</Button>
            <Button w={'10px'}>...</Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
