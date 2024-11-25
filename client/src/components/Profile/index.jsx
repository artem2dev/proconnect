import { Avatar, AvatarBadge, Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiMessageRoundedEdit, BiPlusCircle } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addToFriends as addToFriendsRequest, getFriends } from '../../api/friend';
import { getUser } from '../../api/user';
import { config } from '../../config/app.config';
import { timeSinceLastOnline } from '../../helpers/timeSinceLastOnline';
import { getArticles } from '../../api/articles';
import ContextMenu from '../dialogs/ContextMenu/ContextMenu';

const Profile = () => {
  const userInfo = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { userName } = useParams();
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [articles, setArticles] = useState([]);

  const getArticleInfo = (userNameInfo) => {
    const onSuccess = ({ data }) => {
      const userPosts = data.filter((articleInfo) => articleInfo.author.userName === userName);
      setArticles(userPosts);
    };

    const onError = () => {
      setArticles({});
    };

    getArticles(userNameInfo).then(onSuccess).catch(onError);
  };

  const getFriendsInfo = (userNameInfo) => {
    const onSuccess = ({ data }) => {
      setFriends(data);
    };

    const onError = () => {
      setFriends({});
    };

    getFriends(userNameInfo).then(onSuccess).catch(onError);
  };

  const getUserInfo = (userNameInfo) => {
    const onSuccess = ({ data }) => {
      setUser(data);
    };

    const onError = () => {
      setUser({});
    };

    getUser(userNameInfo).then(onSuccess).catch(onError);
  };

  useEffect(() => {
    getFriendsInfo(userName);

    getUserInfo(userName);

    getArticleInfo(userName);
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

  console.log(articles);

  return (
    <Flex flexDir='column'>
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
      <Flex justify={'space-between'} mt={'10px'} gap={'10px'}>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          padding={3}
          w={'100%'}
          border={'1px'}
          color={'white'}
          borderColor={'gray.800'}
          flexDirection={'column'}
          h={'100%'}
        >
          {articles.map((article) => {
            return (
              <Flex flexDirection={'column'} key={article.id}>
                <Flex>
                  <Flex flexDirection={'row'}>
                    <Avatar
                      src={config.API + '/media/image/' + article?.author?.id}
                      onClick={() => navigate(`/profile/${article.author.userName}`)}
                    >
                      <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />
                    </Avatar>
                  </Flex>
                  <Flex flexDirection={'column'}>
                    <Text>
                      {article.author.firstName} {article.author.lastName}
                    </Text>
                    <Text color={'gray.500'}>
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Flex>
                </Flex>
                <Flex>
                  <Text>sdgldgmdslgldsgdt</Text>
                </Flex>
                <Flex>
                  <Text>fsjfsdgsdgdgtm</Text>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          padding={3}
          minWidth={'340px'}
          border={'1px'}
          color={'white'}
          borderColor={'gray.800'}
          maxH={'268px'}
        >
          <Flex grow={1} justifyContent={'center'} alignItems={'flex-start'} flexDirection={'column'}>
            <Text fontWeight={600} ml={2} mb={2.5} onClick={onFriendsCounter} cursor={'pointer'}>
              Friends online{' '}
              <span style={{ color: 'lightgrey' }}>{friends.filter((friend) => friend.isOnline).length}</span>
            </Text>
            <Flex flex={'1'} gap={'12px'}>
              {friends
                .filter((friend) => friend.isOnline)
                .sort(() => Math.random() - 0.5)
                .slice(0, 4)
                .map((friend) => {
                  return (
                    <Flex
                      key={friend?.id}
                      flexDirection={'column'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      cursor={'pointer'}
                      width={'70px'}
                    >
                      <Avatar
                        src={config.API + '/media/image/' + friend?.id}
                        onClick={() => navigate(`/profile/${friend.userName}`)}
                      >
                        <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />
                      </Avatar>
                      <Text onClick={() => navigate(`/profile/${friend.userName}`)}>{friend?.firstName}</Text>
                    </Flex>
                  );
                })}
            </Flex>
            <hr style={{ border: '1px solid var(--chakra-colors-gray-800)', width: '90%', margin: '10px auto' }} />
            <Text fontWeight={600} ml={2} mb={2.5} onClick={onFriendsCounter} cursor={'pointer'}>
              Friends <span style={{ color: 'lightgrey' }}>{user?.friendsCount}</span>
            </Text>
            <Flex gap={'12px'} flex={'1'}>
              {friends
                .sort(() => Math.random() - 0.5)
                .slice(0, 4)
                .map((friend) => {
                  return (
                    <Flex
                      key={friend?.id}
                      flexDirection={'column'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      cursor={'pointer'}
                      width={'70px'}
                    >
                      <Avatar
                        src={config.API + '/media/image/' + friend?.id}
                        onClick={() => navigate(`/profile/${friend.userName}`)}
                      >
                        {friend?.isOnline && <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />}
                      </Avatar>
                      <Text isTruncated maxWidth={'100%'} onClick={() => navigate(`/profile/${friend.userName}`)}>
                        {friend?.firstName}
                      </Text>
                    </Flex>
                  );
                })}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Profile;
