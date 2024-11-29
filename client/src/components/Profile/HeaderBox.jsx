import { Avatar, AvatarBadge, Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../config/app.config';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../../api/user';
import { timeSinceLastOnline } from '../../helpers/timeSinceLastOnline';
import { addToFriends as addToFriendsRequest } from '../../api/friend';
import { BiMessageRoundedEdit, BiPlusCircle } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';

const HeaderBox = () => {
  const userInfo = useSelector((state) => state.user);
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

  const navigateToMessages = () => {
    navigate(`/messages/${userName}`);
  };

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'space-between'}
      bgColor='RGBA(0, 0, 0, 0.2)'
      rounded={8}
      padding={5}
      w={'full'}
      border={'1px'}
      color={'white'}
      borderColor={'gray.800'}
    >
      <Avatar height={140} width={140} marginRight={5} src={user?.id ? config.API + '/media/image/' + user?.id : ''}>
        {user?.isOnline && <AvatarBadge boxSize={'1.25em'} bg={'green.500'} margin={'3.5'} />}
      </Avatar>
      <Flex grow={1} alignItems={'center'} justifyContent={'space-between'}>
        <VStack spacing={1} display={'flex'} alignItems={'flex-start'} w='180px'>
          <Heading as='h3' fontSize='xl' maxW={'220px'} textAlign={'start'}>
            {`${user?.firstName} ${user?.lastName}`}
          </Heading>
          <Text color={'#6e788a'} fontSize='sm' maxW={'220px'}>
            @{user?.userName}
          </Text>
          <Text textAlign={'start'} color={'gray.200'} w={'330px'}>
            {user?.description}
          </Text>
        </VStack>
      </Flex>
      {userInfo?.userName !== userName ? (
        <VStack spacing={1} display={'flex'} alignItems={'center'} gap={2}>
          <Flex w={'370px'} justifyContent={'space-between'}>
            <Button bgColor={'#e3e4e7'} w={'160px'} onClick={addToFriends}>
              Add to friends <Icon fontSize='22' as={BiPlusCircle} ml={1} />
            </Button>
            <Button w={'150px'} onClick={navigateToMessages}>
              Message <Icon fontSize='22' as={BiMessageRoundedEdit} ml={1} />
            </Button>
            <Button w={'10px'}>
              <Icon fontSize='22' as={FiMoreHorizontal} />
            </Button>
          </Flex>
          <Text alignSelf={'flex-end'} color={'gray.300'} fontWeight={600}>
            {!user?.isOnline && timeSinceLastOnline(user?.wasOnline)}
          </Text>
        </VStack>
      ) : (
        <VStack spacing={1} display={'flex'} alignItems={'center'} gap={2}>
          <Button w={'130px'}>Profile settings</Button>
          <Text alignSelf={'flex-end'} color={'gray.300'} fontWeight={600}>
            {!user?.isOnline && timeSinceLastOnline(user?.wasOnline)}
          </Text>
        </VStack>
      )}
    </Flex>
  );
};

export default HeaderBox;
