import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFriendRequests } from '../../api/friend';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  const user = useSelector((state) => state.users);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setFriendRequests(data);
    };

    const onError = () => {};

    getFriendRequests().then(onSuccess).catch(onError);
  }, [user]);

  return (
    <Flex direction={'column'}>
      {friendRequests.map((request, index) => {
        return <NotificationItem key={index} request={request} />;
      })}
    </Flex>
  );
};

export default Notifications;
