import { Avatar, AvatarBadge, Button, Flex, Heading, Icon, Image, Text, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { BiMessageRoundedEdit, BiPlusCircle } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addToFriends as addToFriendsRequest, getFriends } from '../../api/friend';
import { getUser } from '../../api/user';
import { config } from '../../config/app.config';
import { timeSinceLastOnline } from '../../helpers/timeSinceLastOnline';
import { getArticles } from '../../api/articles';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const userInfo = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { userName } = useParams();
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [articles, setArticles] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});

  const location = useLocation();

  useEffect(() => {
    setExpandedPosts({});
  }, [location]);

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getArticleInfo = useCallback(
    (userNameInfo) => {
      const onSuccess = ({ data }) => {
        const userPosts = data.filter((articleInfo) => articleInfo.author.userName === userName).reverse();
        setArticles(userPosts);
      };

      const onError = () => {
        setArticles({});
      };

      getArticles(userNameInfo).then(onSuccess).catch(onError);
    },
    [userName],
  );

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
  }, [userName, getArticleInfo]);

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

  const friendsOnline = friends
    .filter((friend) => friend.isOnline)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const friendsAll = friends.sort(() => Math.random() - 0.5).slice(0, 4);

  const toFriendProfile = (friendUserName) => {
    navigate(`/profile/${friendUserName}`);
  };

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
          maxW={'62%'}
          border={'1px'}
          color={'white'}
          borderColor={'gray.800'}
          flexDirection={'column'}
          h={'100%'}
          gap={'30px'}
          minH={'76px'}
          w={'100%'}
        >
          {!articles.length && (
            <Text fontSize={'28px'} color={'gray.600'}>
              The user has no posts
            </Text>
          )}

          {articles.map((article) => {
            return (
              <Flex flexDirection={'column'} key={article.id} w={'100%'} gap={'6px'}>
                <Flex justifyContent={'flex-start'} gap={'10px'}>
                  <Flex flexDirection={'row'}>
                    <Avatar
                      src={config.API + '/media/image/' + article?.author?.id}
                      onClick={() => navigate(`/profile/${article.author.userName}`)}
                    >
                      {article.author.isOnline && <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />}
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
                <Flex flexDirection={'column'} gap={'6px'}>
                  <Text fontSize={'2xl'} fontWeight={'bold'} overflowWrap={'anywhere'}>
                    {article?.title}
                  </Text>
                  <Flex textAlign={'start'} flexDirection={'column'} display={'inline'} overflowWrap={'anywhere'}>
                    {article?.content.length > 350 && !expandedPosts[article.id] ? (
                      <>
                        {article?.content.slice(0, 250).trim()}...{' '}
                        <Text
                          onClick={() => toggleExpand(article.id)}
                          color={'gray.500'}
                          cursor={'pointer'}
                          fontWeight={'bold'}
                          _hover={{ color: 'gray.600' }}
                          display={'inline'}
                          whiteSpace={'nowrap'}
                        >
                          Show more
                        </Text>
                      </>
                    ) : (
                      article?.content
                    )}
                  </Flex>
                  {article?.media && (
                    <Image
                      objectFit='cover'
                      src={`${config.API}/media/static/image/${article?.media.id}`}
                      alt='Chakra UI'
                      height='300px'
                      style={{ objectFit: 'scale-down' }}
                      transition='all 0.2s'
                      m={2}
                    />
                  )}
                </Flex>
                <Flex></Flex>
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
          alignSelf={'flex-start'}
        >
          <Flex
            justifyContent={'center'}
            alignItems={'flex-start'}
            alignSelf={'flex-start'}
            flexDirection={'column'}
            w={'100%'}
            gap={'10px'}
          >
            <Text fontWeight={600} ml={2} onClick={onFriendsCounter} cursor={'pointer'}>
              Friends online{' '}
              <span style={{ color: 'lightgrey' }}>{friends.filter((friend) => friend.isOnline).length}</span>
            </Text>
            {friendsOnline.length > 0 && (
              <Flex flex={'1'} gap={'12px'}>
                {friendsOnline.map((friend) => {
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
                        onClick={() => toFriendProfile(friend.userName)}
                      >
                        <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />
                      </Avatar>
                      <Text onClick={() => toFriendProfile(friend.userName)}>{friend?.firstName}</Text>
                    </Flex>
                  );
                })}
              </Flex>
            )}
            <hr style={{ border: '1px solid var(--chakra-colors-gray-800)', width: '90%', margin: 'auto' }} />
            <Text fontWeight={600} ml={2} onClick={onFriendsCounter} cursor={'pointer'}>
              Friends <span style={{ color: 'lightgrey' }}>{user?.friendsCount}</span>
            </Text>
            {friendsAll.length > 0 && (
              <Flex gap={'12px'} flex={'1'}>
                {friendsAll.map((friend) => {
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
                        onClick={() => toFriendProfile(friend.userName)}
                      >
                        {friend?.isOnline && <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />}
                      </Avatar>
                      <Text isTruncated mb={2} maxWidth={'100%'} onClick={() => toFriendProfile(friend.userName)}>
                        {friend?.firstName}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Profile;
