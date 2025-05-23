import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { uploadImage } from '../../api/media';
import { config } from '../../config/app.config';

const list = [
  {
    id: 1,
    name: 'Articles written',
    value: 32,
    color: 'yellow',
  },
  {
    id: 2,
    name: 'Friends',
    value: 26,
    color: 'green',
  },
  {
    id: 3,
    name: 'Total number of likes',
    value: 6,
    color: 'red',
  },
];

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const value = `https://domain.com/${user?.userName}`;
  const { hasCopied, onCopy } = useClipboard(value);

  const profileUrl = useRef(null);

  useEffect(() => {
    if (hasCopied) {
      profileUrl.current.focus();
      profileUrl.current.select();
    }
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const profileImage = useRef(null);

  const openChooseImage = () => {
    profileImage.current.click();
  };

  const changeProfileImage = (e) => {
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
    const image = e.target.files[0];

    if (image && ALLOWED_TYPES.includes(image.type)) {
      handleImageUpload(image);
    }
  };

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const onSuccess = () => {
      return;
    };

    const onError = (error) => {
      onOpen();

      console.error(error);
    };

    uploadImage(formData).then(onSuccess).catch(onError);
  };

  return (
    <Box
      as='aside'
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      rounded='md'
      borderWidth={1}
      style={{ transform: 'translateY(-100px)' }}
      bgColor='RGBA(0, 0, 0, 0.2)'
      borderColor={'brand.gray'}
    >
      <VStack spacing={3} py={5} borderBottomWidth={1} borderColor='brand.gray'>
        <Avatar
          size='2xl'
          cursor='pointer'
          onClick={openChooseImage}
          src={user?.id ? `${config.API}/media/image/` + user?.id : ''}
        >
          <AvatarBadge bg='brand.blue' boxSize='1em'>
            <svg width='0.4em' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z'
              />
            </svg>
          </AvatarBadge>
        </Avatar>
        <input hidden type='file' ref={profileImage} onChange={changeProfileImage} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Something went wrong</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>File not supported!</Text>
              <HStack mt={1}>
                <Text color='white' fontSize='sm'>
                  Supported types:
                </Text>
                <Badge colorScheme='green'>PNG</Badge>
                <Badge colorScheme='green'>JPG</Badge>
                <Badge colorScheme='green'>JPEG</Badge>
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <VStack spacing={1}>
          <Heading as='h3' fontSize='xl' color='white'>
            {`${user?.firstName} ${user?.lastName}`}
          </Heading>
          <Text color='white' fontSize='sm'>
            {user?.userName}
          </Text>
        </VStack>
      </VStack>
      <VStack as='ul' spacing={0} listStyleType='none'>
        {list.map((item) => (
          <Box
            key={item.id}
            as='li'
            w='full'
            py={3}
            px={5}
            d='flex'
            alignItems='center'
            justifyContent='space-between'
            borderBottomWidth={1}
            borderColor={'brand.gray'}
          >
            <Text color='white'>{item.name}</Text>
            <Text color={`brand.${item.color}`} fontWeight='bold'>
              {item.value}
            </Text>
          </Box>
        ))}
      </VStack>
      <VStack py={8} px={5} spacing={3}>
        <Button>View Public Profile</Button>
        <InputGroup>
          <Input
            ref={profileUrl}
            type='url'
            color='brand.blue'
            value={value}
            userSelect='all'
            isReadOnly
            _focus={{ borderColor: 'brand.blue' }}
          />
          <InputRightAddon bg='transparent' px={0} overflow='hidden'>
            <Button onClick={onCopy} variant='link'>
              <svg width='1.2em' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
                <path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
              </svg>
            </Button>
          </InputRightAddon>
        </InputGroup>
      </VStack>
    </Box>
  );
};

export default Sidebar;
