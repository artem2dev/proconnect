import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUsers } from '../../api/user';
import UserCard from './Card';

const UserList = () => {
  const user = useSelector((state) => state.user);
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
    <Flex w={'full'} wrap={'wrap'}>
      {userList.map((userItem, index) => userItem?.id !== user?.id && <UserCard key={index} user={userItem} />)}
    </Flex>
  );
};

export default UserList;
