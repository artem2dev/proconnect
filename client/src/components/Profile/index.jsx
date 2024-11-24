import { Avatar, Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiMessageRoundedEdit } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addToFriends as addToFriendsRequest } from '../../api/friend';
import { getUser } from '../../api/user';
import { config } from '../../config/app.config';

const Profile = () => {
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

  // const onFriendsCounter = () => {
  //   navigate(`/profile/${userName}/friends`);
  // };

  const navigateToMessages = () => {
    navigate(`/messages/${userName}`);
  };

  function timeSinceLastOnline(isoDate) {
    const now = new Date();
    const lastOnline = new Date(isoDate);
    const diffMs = now - lastOnline;  
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffMinutes < 1) {
      return "was online: just now";
    } else if (diffMinutes < 60) {
      return `was online: ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `was online: ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays <= 7) {
      return `was online: ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      const day = String(lastOnline.getDate()).padStart(2, "0");
      const month = String(lastOnline.getMonth() + 1).padStart(2, "0");
      const year = lastOnline.getFullYear();
      return `was online: ${month}.${day}.${year}`;
    }
  }

  return (
    <Flex>
      {user?.id && (
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          padding={5}
          w={'full'}
          border={'1px'}
          color={'white'}
          borderColor={'#2D3748'}
        >
          <Avatar
            height={140}
            width={140}
            marginRight={5}
            src={user?.id ? config.API + '/media/image/' + user?.id : ''}
          />
          <Flex grow={1} alignItems='center' justifyContent={'space-between'}>
            <VStack spacing={1} display={'flex'} alignItems={'flex-start'} w='180px'>
              <Heading as='h3' fontSize='xl' whiteSpace={'nowrap'} maxW={'300px'}>
                {`${user?.firstName} ${user?.lastName}`}
              </Heading>
              <Text color={'#6e788a'} fontSize='sm' maxW={'220px'}>
                @{user?.userName}
              </Text>
              <Text textAlign={'start'} w={'330px'}>
                {user?.description}
              </Text>
            </VStack>
          </Flex>
          {/* <Flex grow={1}>
            <Button variant={'link'} onClick={onFriendsCounter} maxW={80}>
              <Text fontWeight={900}>{user?.userFriendsCount}</Text>
              <Text fontWeight={200} ml={2}>
                {user?.userFriendsCount === 1 ? 'friend' : 'friends'}
              </Text>
            </Button>
          </Flex> */}
          {userInfo?.userName !== userName ? (
            <VStack spacing={1} display={'flex'} alignItems={'center'} gap={2}>
              <Flex w={'240px'} justifyContent={'space-between'}>
                <Button bgColor={'#e3e4e7'} w={'130px'} onClick={addToFriends}>
                  Add to friends
                </Button>
                <Button w={'50px'} onClick={navigateToMessages}>
                  <Icon fontSize='22' as={BiMessageRoundedEdit} />
               </Button>
               <Button w={'10px'}>
                 <Icon fontSize='22' as={FiMoreHorizontal} />
               </Button>
             </Flex>
             <Text fontWeight={600}>{user?.isOnline ? 'Online' : timeSinceLastOnline(user?.wasOnline)}</Text>
            </VStack>
          ) : (
            <VStack spacing={1} display={'flex'} alignItems={'center'} gap={2}>
              <Button w={'130px'}>Profile settings</Button>
              <Text fontWeight={600}>{'Online'}</Text>
            </VStack>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
