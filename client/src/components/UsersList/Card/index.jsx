import { Avatar, AvatarBadge, Box, Button, Center, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { addToFriends as addToFriendsRequest } from '../../../api/friend';
import { config } from '../../../config/app.config';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const onClick = (e) => {
    e.target?.type !== 'button' && navigate(`/profile/${user?.userName}`);
  };

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

  return (
    <Center w={276} px={3} py={6} onClick={onClick} cursor='pointer'>
      <Box w={'full'} bg={useColorModeValue('white', 'gray.800')} boxShadow={'2xl'} rounded={'md'} overflow={'hidden'}>
        <Flex justify={'center'} mt={10}>
          <Avatar size={'xl'} src={user?.id ? `${config.API}/media/image/` + user?.id : ''} alt={'Author'}>
            {user?.isOnline && <AvatarBadge boxSize='0.7em' margin={1} bg='green.500' />}
          </Avatar>
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Text
              maxW={235}
              textAlign={'center'}
              whiteSpace={'nowrap'}
              fontSize={'2xl'}
              fontWeight={500}
              fontFamily={'body'}
            >
              {`${user?.firstName} ${user?.lastName}`}
            </Text>
            <Text
              color={'gray.500'}
              maxW={235}
              textAlign={'center'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
            >{`@${user?.userName}`}</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{user?.friendsCount}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Friends
              </Text>
            </Stack>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>{user?.articlesCount}</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Posts
              </Text>
            </Stack>
          </Stack>

          {user.isFriend ? (
            <Button
              w={'full'}
              mt={8}
              bgColor={'green.500'}
              _hover={{
                background: 'green.500',
              }}
            >
              Already friends
            </Button>
          ) : (
            <Button w={'full'} mt={8} onClick={addToFriends}>
              Add to friends
            </Button>
          )}
        </Box>
      </Box>
    </Center>
  );
}
