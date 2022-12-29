import {
  Avatar,
  Box,
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
import { FiChevronDown, FiCompass, FiHome, FiSettings, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../api/auth';
import { removeItem } from '../../helpers/localStorage';
import { setGlobalState } from '../../redux/globalState';
import { setUser } from '../../redux/usersSlice';

const LinkItems = [
  { name: 'Home', icon: FiHome },
  { name: 'Users', icon: FiTrendingUp },
  { name: 'Explore', icon: FiCompass },
  { name: 'Notifications', icon: FiStar },
  { name: 'Settings', icon: FiSettings },
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

  return (
    <Box
      transition='3s ease'
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      flexDirection={'column'}
      justifyContent='space-between'
      {...rest}
    >
      <Box>
        <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
          <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
            Logo
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
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
            <MenuItem onClick={onShowProfileSettings}>Profile</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onSignOut}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href='#' style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
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
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'black',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
