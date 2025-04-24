import { Avatar, AvatarBadge, Flex, Text } from '@chakra-ui/react';
import { getFriends } from '../../api/friend';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../config/app.config';

const FriendsBox = () => {
  const [friends, setFriends] = useState([]);
  const { userName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setFriends(data);
    };

    const onError = () => {
      setFriends({});
    };

    getFriends(userName).then(onSuccess).catch(onError);
  }, [userName]);

  const friendsOnline = useMemo(
    () =>
      friends
        .filter((friend) => friend.isOnline)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4),
    [friends],
  );

  const friendsAll = useMemo(() => friends.sort(() => Math.random() - 0.5).slice(0, 4), [friends]);

  const toFriendProfile = (friendUserName) => {
    navigate(`/profile/${friendUserName}`);
  };

  const onFriendsCounter = () => {
    navigate(`/profile/${userName}/friends`);
  };

  return (
    <Flex
      justifyContent={'center'}
      alignItems={'flex-start'}
      alignSelf={'flex-start'}
      flexDirection={'column'}
      w={'100%'}
      gap={'10px'}
    >
      <Text fontWeight={600} ml={2} onClick={onFriendsCounter} cursor={'pointer'}>
        Friends online <span style={{ color: 'lightgrey' }}>{friends.filter((friend) => friend.isOnline).length}</span>
      </Text>
      {friendsOnline.length > 0 && (
        <Flex flex={'1'} gap={'12px'} flexDirection={'row'}>
          {friendsOnline.map((friend) => (
            <Flex
              key={friend?.id || friend.userName}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              cursor={'pointer'}
              width={'70px'}
            >
              <Avatar src={config.API + '/media/image/' + friend?.id} onClick={() => toFriendProfile(friend.userName)}>
                <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />
              </Avatar>
              <Text onClick={() => toFriendProfile(friend.userName)}>{friend?.firstName}</Text>
            </Flex>
          ))}
        </Flex>
      )}
      <hr style={{ border: '1px solid var(--chakra-colors-gray-800)', width: '90%', margin: 'auto' }} />
      <Text fontWeight={600} ml={2} onClick={onFriendsCounter} cursor={'pointer'}>
        Friends <span style={{ color: 'lightgrey' }}>{friends.length}</span>
      </Text>
      {friends.length > 0 && (
        <Flex flex={'1'} gap={'12px'} flexDirection={'row'}>
          {friendsAll.map((friend) => (
            <Flex
              key={friend?.id || friend.userName}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              cursor={'pointer'}
              width={'70px'}
            >
              <Avatar src={config.API + '/media/image/' + friend?.id} onClick={() => toFriendProfile(friend.userName)}>
                {friend?.isOnline && <AvatarBadge boxSize={'0.8em'} bg={'green.500'} />}
              </Avatar>
              <Text isTruncated mb={2} maxWidth={'100%'} onClick={() => toFriendProfile(friend.userName)}>
                {friend?.firstName}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default FriendsBox;