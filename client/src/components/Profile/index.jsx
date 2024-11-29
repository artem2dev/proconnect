import { Flex } from '@chakra-ui/react';
import React from 'react';
import FriendsBox from './FriendsBox';
import HeaderBox from './HeaderBox';
import ArticlesList from './ArticlesList';

const Profile = () => {
  return (
    <Flex flexDir='column'>
      <HeaderBox />
      <Flex justify={'space-between'} mt={'10px'} gap={'10px'}>
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          padding={3}
          maxW={'62%'}
          color={'white'}
          flexDirection={'column'}
          h={'100%'}
          gap={'30px'}
          minH={'76px'}
          w={'100%'}
          backgroundColor={'imherit'}
          p={0}
        >
          <ArticlesList />
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
          <FriendsBox />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Profile;
