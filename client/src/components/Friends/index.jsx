import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFriends } from '../../api/friend';
import FriendCard from './FriendCard';

const Friends = () => {
  const { userName } = useParams();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setFriends(data);
    };

    const onError = () => {};

    getFriends(userName).then(onSuccess).catch(onError);
  }, [userName]);

  return (
    <Flex direction={'column'}>
      {friends.map((friend, index) => {
        return <FriendCard key={index} friend={friend} userName={userName} />;
      })}
    </Flex>
  );
};

export default Friends;
