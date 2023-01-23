import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiChevronDown, FiCompass, FiSettings, FiUsers } from 'react-icons/fi';
import { IoMdCreate, IoMdNotificationsOutline } from 'react-icons/io';
import { RxEnvelopeClosed } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../api/auth';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { removeItem } from '../../helpers/localStorage';
import { setGlobalState } from '../../redux/globalStateSlice';
import { setUser } from '../../redux/usersSlice';

const LinkItems = [
  { name: 'Home', icon: AiOutlineHome, hover: { bg: 'RGBA(0, 0, 0, 0.5)' }, href: '/' },
  { name: 'Profile', icon: FaRegUserCircle, hover: { bg: 'RGBA(0, 0, 0, 0.5)' }, href: '' },
  { name: 'Notifications', icon: IoMdNotificationsOutline, hover: { bg: 'RGBA(0, 0, 0, 0.5)' } },
  { name: 'Messages', icon: RxEnvelopeClosed, hover: { bg: 'RGBA(0, 0, 0, 0.5)' }, href: '/messages' },
  { name: 'Users', icon: FiUsers, hover: { bg: 'RGBA(0, 0, 0, 0.5)' }, href: '/users' },
  { name: 'Explore', icon: FiCompass, hover: { bg: 'RGBA(0, 0, 0, 0.5)' } },
  { name: 'Settings', icon: FiSettings, hover: { bg: 'RGBA(0, 0, 0, 0.5)' } },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onClose } = useDisclosure();
  const globalState = useSelector((state) => state.globalState);
  const bg = useColorModeValue('gray.100', 'gray.900');

  return (
    <>
      <Box minH='100vh' bg={bg}>
        {globalState?.sidebarVisible && (
          <>
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'flex' }} />
            <Drawer
              autoFocus={false}
              isOpen={isOpen}
              placement='left'
              onClose={onClose}
              returnFocusOnClose={false}
              onOverlayClick={onClose}
              size='full'
            >
              <DrawerContent>
                <SidebarContent onClose={onClose} />
              </DrawerContent>
            </Drawer>
          </>
        )}
        <Box ml={globalState?.sidebarVisible ? { base: 0, md: 60 } : {}} p={globalState?.sidebarVisible ? '4' : ''}>
          {children}
        </Box>
      </Box>
    </>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  const user = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onShowProfileSettings = () => {
    navigate('/profile');
  };

  const onSignOut = () => {
    const onSuccess = () => {
      removeItem('jwtToken');
      navigate('/login');
      dispatch(setUser({}));
      dispatch(setGlobalState({ sidebarVisible: false }));
    };

    signOut().then(onSuccess);
  };

  const onCreatePost = () => {
    return;
  };

  return (
    <Box
      transition='3s ease'
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderLeft='1px'
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      flexDirection={'column'}
      justifyContent='space-between'
      {...rest}
    >
      <Box h={'82%'}>
        <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
          <Logo width='60px' height='60px' />
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-between'} alignItems={''}>
          <Box>
            {LinkItems.map((link) => (
              <NavItem
                key={link.name}
                icon={link.icon}
                href={link.name === 'Profile' ? user?.userName : link?.href}
                user={user}
                bgColor={link.bgColor}
                color={link.color}
                _hover={link.hover}
              >
                {link.name}
              </NavItem>
            ))}
          </Box>
          <Button w={210} ml={3} py={7} rounded='3xl' justifyContent={'flex-start'} onClick={onCreatePost}>
            {IoMdCreate && <Icon mr='4' fontSize='20' as={IoMdCreate} />}
            Create post
          </Button>
        </Flex>
      </Box>

      <Box display={'flex'} justifyContent={'flex-start'} paddingLeft='25px' paddingBottom={'10px'}>
        <Menu>
          <MenuButton px={0} py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar size='sm' src={user?.id ? 'http://localhost:5000/media/image/' + user?.id : ''} />
              <VStack display={{ base: 'none', md: 'flex' }} alignItems='flex-start' spacing='1px' ml='2'>
                <Text fontSize='sm'>{`${user?.firstName} ${user?.lastName}`}</Text>
                <Text fontSize='xs' color='gray.600'>
                  {user?.userName}
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList bg={useColorModeValue('white', 'gray.900')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem onClick={onShowProfileSettings}>Profile settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onSignOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, href, user, children, ...rest }) => {
  const navigate = useNavigate();

  const onClick = () => {
    if (children === 'Profile') {
      navigate(`/profile/${user?.userName}`);

      return;
    }

    if (children === 'Notifications') {
      navigate(`/notifications`);

      return;
    }

    navigate(href);
  };

  return (
    <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} onClick={onClick}>
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='3xl'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'gray.100',
          color: 'black',
        }}
        {...rest}
      >
        {icon && <Icon mr='4' fontSize='20' as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};
