import { Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUsers } from '../../api/user';
import UserCard from './Card';

const UserList = () => {
  const user = useSelector((state) => state.users);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const onSuccess = ({ data }) => {
      setUserList(data);
    };

    const onError = () => {
      setUserList([]);
    };

    getUsers().then(onSuccess).catch(onError);
  }, []);

  return (
    <Grid templateColumns='repeat(4, 1fr)' gap={6}>
      {userList.map(
        (userItem, index) =>
          userItem?.id !== user?.id && <GridItem key={index}>{<UserCard user={userItem} />}</GridItem>,
      )}
    </Grid>
  );
};

export default UserList;
