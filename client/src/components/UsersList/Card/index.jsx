import { Avatar, Box, Button, Center, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const onClick = (e) => {
    e.target?.type !== 'button' && navigate(`/profile/${user?.userName}`);
  };

  return (
    <Center py={6} onClick={onClick} cursor='pointer'>
      <Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        {/* <Image
          h={'120px'}
          w={'full'}
          src={
            'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          }
          objectFit={'cover'}
        /> */}
        <Flex justify={'center'} mt={10}>
          <Avatar
            size={'xl'}
            src={user?.id ? 'http://localhost:5000/media/image/' + user?.id : ''}
            alt={'Author'}
            css={{
              border: '2px solid white',
              backgroundColor: 'white',
            }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {`${user?.firstName} ${user?.lastName}`}
            </Heading>
            <Text fontWeight={'bold'} color={'gray.500'}>{`@${user?.userName}`}</Text>
          </Stack>

          <Stack direction={'row'} justify={'center'} spacing={6}>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Friends
              </Text>
            </Stack>
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Followers
              </Text>
            </Stack>
          </Stack>

          <Button
            w={'full'}
            mt={8}
            onClick={() => {
              return;
            }}
          >
            Add to friends
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
