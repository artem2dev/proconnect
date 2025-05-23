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
  Image,
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
import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiChevronDown, FiUsers } from 'react-icons/fi';
import { IoMdCreate, IoMdNotificationsOutline } from 'react-icons/io';
import { MdOutlineArticle } from 'react-icons/md';
import { RxEnvelopeClosed } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../api/auth';
import logo from '../../assets/logo.png';
import { config } from '../../config/app.config';
import { removeItem } from '../../helpers/localStorage';
import { setGlobalState } from '../../redux/globalStateSlice';
import { setUser } from '../../redux/usersSlice';
import CreateArticle from '../Articles/Create/CreateArticle';

const LinkItems = [
  // { name: 'Home', icon: AiOutlineHome, href: '/' },
  { name: 'Profile', icon: FaRegUserCircle, href: '' },
  { name: 'Notifications', icon: IoMdNotificationsOutline },
  { name: 'Messages', icon: RxEnvelopeClosed, href: '/messages' },
  { name: 'Users', icon: FiUsers, href: '/users' },
  // { name: 'Explore', icon: FiCompass },
  { name: 'Articles', icon: MdOutlineArticle, href: '/articles' },
  // { name: 'Settings', icon: FiSettings },
];

export default function SidebarWithHeader({ children }) {
  const { isOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const globalState = useSelector((state) => state.globalState);
  const bg = useColorModeValue('gray.100', 'gray.900');

  return (
    <>
      <CreateArticle isOpen={isModalOpen} onClose={onModalClose} />
      <Box minH='100vh' bg={bg}>
        {globalState?.sidebarVisible && (
          <>
            <SidebarContent onModalOpen={onModalOpen} onClose={() => onClose} display={{ base: 'none', md: 'flex' }} />
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
                <SidebarContent onModalOpen={onModalOpen} onClose={onClose} />
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

const SidebarContent = ({ onClose, onModalOpen, ...rest }) => {
  const user = useSelector((state) => state.user);
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

  const navigateLink = (link) => () => link && navigate(link);

  const [currentTitle, setCurrentTitle] = useState(() => {
    return localStorage.getItem('pageTitle') || 'Articles';
  });

  const handleTitleUpdate = (link) => {
    setCurrentTitle(link.name);
    localStorage.setItem('pageTitle', link.name);
  };

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  useEffect(() => {
    const storedTitle = localStorage.getItem('pageTitle');
    if (storedTitle) {
      setCurrentTitle(storedTitle);
    }
  }, []);

  return (
    <Box
      transition='3s ease'
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderColor={useColorModeValue('gray.200', 'gray.800')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      flexDirection={'column'}
      justifyContent='space-between'
      {...rest}
    >
      <Box h={'82%'}>
        <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
          <Image
            src={logo}
            onClick={() => {
              setCurrentTitle('Articles');
              localStorage.setItem('pageTitle', 'Articles');
              navigate('/articles');
            }}
            cursor='pointer'
          />
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-between'} alignItems={''}>
          <Flex display={'flex'} flexDirection={'column'} gap={2} mt={5}>
            {LinkItems.map((link) => {
              const isActive =
                currentTitle === link.name || (link.name === 'Profile' && currentTitle.includes('Profile'));
              return (
                <NavItem
                  key={link.name}
                  icon={link.icon}
                  href={link.name === 'Profile' ? user?.userName : link?.href}
                  user={user}
                  bgColor={isActive ? 'RGBA(0, 0, 0, 0.2)' : 'transparent'}
                  border={'1px'}
                  borderColor={isActive ? 'gray.800' : 'transparent'}
                  color={link.color}
                  _hover={!isActive && (link?.hover ?? { bg: 'RGBA(0, 0, 0, 0.125)' })}
                  onClick={() => {
                    handleTitleUpdate(link);
                    navigateLink(link?.href)();
                  }}
                >
                  {link.name}
                </NavItem>
              );
            })}
          </Flex>
          <Button w={210} ml={3} py={7} rounded='3xl' justifyContent={'flex-start'} onClick={onModalOpen}>
            {IoMdCreate && <Icon mr='4' fontSize='20' as={IoMdCreate} />}
            Create post
          </Button>
        </Flex>
      </Box>

      <Box display={'flex'} justifyContent={'flex-start'} paddingLeft='25px' paddingBottom={'10px'}>
        <Menu>
          <MenuButton px={0} py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar size='sm' src={user?.id ? `${config.API}/media/image/` + user?.id : ''} />
              <VStack display={{ base: 'none', md: 'flex' }} alignItems='flex-start' spacing='1px' ml='2'>
                <Text fontSize='sm'>{`${user?.firstName} ${user?.lastName}`}</Text>
                <Text fontSize='xs' color='gray.600'>
                  @{user?.userName}
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList bg={useColorModeValue('white', 'gray.900')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <MenuItem
              bg={useColorModeValue('white', 'gray.900')}
              _hover={{ bg: 'RGBA(0, 0, 0, 0.5)' }}
              onClick={(event) => {
                onShowProfileSettings();
                const title = event.target.textContent;
                setCurrentTitle(title);
              }}
            >
              Profile settings
            </MenuItem>
            <MenuDivider />
            <MenuItem
              bg={useColorModeValue('white', 'gray.900')}
              _hover={{ bg: 'RGBA(0, 0, 0, 0.5)' }}
              onClick={() => {
                onSignOut();
                setCurrentTitle('ProConnect');
                localStorage.removeItem('pageTitle');
              }}
            >
              Sign out
            </MenuItem>
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
      <Flex align='center' p='4' mx='4' borderRadius='3xl' role='group' cursor='pointer' {...rest}>
        {icon && <Icon mr='4' fontSize='20' as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};
