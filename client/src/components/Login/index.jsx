import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { getUser } from '../../api/user';
import logo from '../../assets/logo.png';
import { removeItem, setItem } from '../../helpers/localStorage';
import { setGlobalState } from '../../redux/globalStateSlice';
import { setUser } from '../../redux/usersSlice';
import { OAuthButtonGroup } from './OAuthButtonGroup';

const defaultLabels = {
  email: 'Email',
  password: 'Password',
};

const defaultErrorLabels = {
  passwordMinLength: 'Password must contain at least 8 characters',
  emailCannotBeEmpty: 'Email cannot be empty',
};

const initialIsFieldError = {
  email: false,
  password: false,
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('adminadmin');
  const [email, setEmail] = useState('admin@admin.com');
  const [labels, setLabels] = useState(defaultLabels);
  const [isLoading, setIsLoading] = useState(false);
  const [isFieldError, setIsFieldError] = useState(initialIsFieldError);

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onEmailChange = (e) => {
    setIsFieldError({
      ...isFieldError,
      email: false,
    });
    setLabels({ ...labels, email: defaultLabels.email });

    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setIsFieldError({
      ...isFieldError,
      password: false,
    });
    setLabels({ ...labels, password: defaultLabels.password });

    setPassword(e.target.value);
  };

  const fieldsVerification = (email, password) => {
    if (!email.length) {
      setLabels({
        ...labels,
        email: defaultErrorLabels.emailCannotBeEmpty,
      });

      setIsFieldError({ ...isFieldError, email: true });

      return false;
    }

    if (password.length < 8) {
      setLabels({
        ...labels,
        password: defaultErrorLabels.passwordMinLength,
      });

      setIsFieldError({ ...isFieldError, password: true });

      return false;
    }

    return true;
  };

  const onLogin = (e) => {
    e.preventDefault();
    if (!fieldsVerification(email, password)) return;

    const params = { email, password };

    const onSuccess = ({ data }) => {
      setItem('jwtToken', data);
      setIsLoading(false);

      const onSuccess = ({ data }) => {
        dispatch(setGlobalState({ sidebarVisible: true }));
        dispatch(
          setUser({
            ...data,
          }),
        );
      };

      const onError = (err) => {
        dispatch(setGlobalState({ sidebarVisible: false }));
        dispatch(setUser({}));

        console.error(err);
      };

      getUser().then(onSuccess).catch(onError);

      navigate('/');
    };

    const onError = (error) => {
      setIsLoading(false);
      removeItem('jwtToken');

      console.error(error);
    };

    setIsLoading(true);

    loginUser(params, onSuccess, onError).then(onSuccess).catch(onError);
  };

  const navigateToSignUp = () => {
    navigate('/register');
  };

  return (
    <Container
      display={'flex'}
      minH={'100vh'}
      minW={'100%'}
      align={'center'}
      justifyContent={'center'}
      bgColor='RGBA(0, 0, 0, 0.2)'
    >
      <Stack spacing={8} maxW={'lg'} justify='center' minW={'500px'}>
        <Stack spacing='6'>
          <Center>
            <Image src={logo} h='100' />
          </Center>

          <Stack
            spacing={{
              base: '2',
              md: '3',
            }}
            textAlign='center'
          >
            <Heading
              size={useBreakpointValue({
                base: 'xs',
                md: 'sm',
              })}
            >
              Log in to your account
            </Heading>
            <HStack spacing='1' justify='center'>
              <Text color='white'>Don't have an account?</Text>
              <Button variant='link' colorScheme='blue' onClick={navigateToSignUp}>
                Sign up
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: '0',
            sm: '8',
          }}
          px={{
            base: '4',
            sm: '10',
          }}
          bg='RGBA(0, 0, 0, 0.2)'
          boxShadow={{
            base: 'none',
            sm: useColorModeValue('lg', 'md-dark'),
          }}
          borderRadius={{
            base: 'none',
            sm: 'xl',
          }}
        >
          <Stack spacing='6'>
            <FormControl isRequired>
              <FormLabel htmlFor='email' color={isFieldError.email ? 'red' : 'white'}>
                {labels.email}
              </FormLabel>
              <Input
                id='email'
                type='email'
                variant='filled'
                onChange={onEmailChange}
                value={email}
                isInvalid={isFieldError.email}
              />
              <InputGroup size='md' flexDirection='column' mt={'5'}>
                <FormLabel htmlFor='password' color={isFieldError.password ? 'red' : 'white'}>
                  {labels.password}
                </FormLabel>
                <Input
                  pr='4.5rem'
                  id='password'
                  variant='filled'
                  value={password}
                  type={showPassword ? 'text' : 'password'}
                  onChange={onPasswordChange}
                  isInvalid={isFieldError.password}
                />
                <InputRightElement width='4.5rem' marginTop='8'>
                  <Button p h='1.75rem' size='sm' variant='solid' colorScheme='blue' onClick={onShowPassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <HStack justify='space-between'>
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant='link' colorScheme='blue' size='sm'>
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing='6'>
              <Button isLoading={isLoading} colorScheme='blue' onClick={onLogin}>
                Login
              </Button>
              <HStack>
                <Divider />
                <Text fontSize='sm' whiteSpace='nowrap' color='muted'>
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Login;
