import { Box, Button, FormControl, FormLabel, Input, Tab, TabList, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const Content = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const [url, setUrl] = useState('');

  return (
    <Box
      as='main'
      flex={3}
      d='flex'
      flexDir='column'
      justifyContent='space-between'
      pt={5}
      bg='white'
      rounded='md'
      borderWidth={1}
      borderColor='gray.200'
      style={{ transform: 'translateY(-100px)' }}
    >
      <Box mt={5} py={5} px={8} borderTopWidth={1} borderColor='brand.light'>
        <FormLabel htmlFor='firstName' color={'black'}>
          Your url:
        </FormLabel>
        <Input
          id='firstName'
          focusBorderColor='brand.blue'
          type='text'
          placeholder='/friends/12345'
          value={url}
          name='firstName'
          onChange={(e) => setUrl(e.target.value)}
          isInvalid={false}
        />
        <Box display='flex' justifyContent='space-between' marginTop={'10px'}>
          <Button onClick={() => {}} isLoading={false}>
            GET
          </Button>
          <Button onClick={() => {}} isLoading={false}>
            POST
          </Button>
          <Button onClick={() => {}} isLoading={false}>
            DELETE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Content;
