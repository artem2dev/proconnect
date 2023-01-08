import React, { useState } from 'react';

import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { getUser } from '../../api/user';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { setItem } from '../../helpers/localStorage';
import { setGlobalState } from '../../redux/globalStateSlice';
import { setUser } from '../../redux/usersSlice';
import { OAuthButtonGroup } from '../Login/OAuthButtonGroup';

const defaultLabels = {
  userName: 'User name',
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
  password: 'Password',
  passwordVerify: 'Verify password',
};

const defaultErrorLabels = {
  passwordMinLength: 'Password must contain at least 8 characters',
  passwordsMustMatch: 'Passwords must match',
  emailCannotBeEmpty: "Email can't be empty",
  userNameCannotBeEmpty: "User name can't be empty",
  firstNameCannotBeEmpty: "First name can't be empty",
  lastNameCannotBeEmpty: "Last name can't be empty",
};

const initialIsFieldError = {
  userName: false,
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  passwordVerify: false,
};

const initialFields = {
  userName: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  passwordVerify: '',
};

const initialShowPassword = {
  password: false,
  passwordVerify: false,
};

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(initialShowPassword);
  const [fields, setFields] = useState(initialFields);
  const [labels, setLabels] = useState(defaultLabels);
  const [isLoading, setIsLoading] = useState(false);
  const [isFieldError, setIsFieldError] = useState(initialIsFieldError);

  const onChange = (e) => {
    const { name, value } = e.target;

    setIsFieldError({
      ...isFieldError,
      [name]: false,
    });
    setLabels({
      ...labels,
      [name]: defaultLabels[name],
    });

    setFields({ ...fields, [name]: value });
  };

  const onShowPassword = (e) => {
    const { name } = e.target;

    setShowPassword({ ...showPassword, [name]: !showPassword[name] });
  };

  const fieldsVerification = (email, userName, firstName, lastName, password, passwordVerify) => {
    if (!email.length) {
      setLabels({
        ...labels,
        email: defaultErrorLabels.emailCannotBeEmpty,
      });

      setIsFieldError({ ...isFieldError, email: true });

      return false;
    }

    if (!userName.length) {
      setLabels({
        ...labels,
        userName: defaultErrorLabels.userNameCannotBeEmpty,
      });

      setIsFieldError({ ...isFieldError, userName: true });

      return false;
    }

    if (!firstName.length) {
      setLabels({
        ...labels,
        firstName: defaultErrorLabels.firstNameCannotBeEmpty,
      });

      setIsFieldError({ ...isFieldError, firstName: true });

      return false;
    }

    if (!lastName.length) {
      setLabels({
        ...labels,
        lastName: defaultErrorLabels.lastNameCannotBeEmpty,
      });

      setIsFieldError({ ...isFieldError, lastName: true });

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

    if (password !== passwordVerify) {
      setLabels({
        ...labels,
        password: defaultErrorLabels.passwordsMustMatch,
      });

      setIsFieldError({
        ...isFieldError,
        password: true,
        passwordVerify: true,
      });

      return false;
    }

    return true;
  };

  const onSignUp = (e) => {
    e.preventDefault();

    const { email, userName, firstName, lastName, password, passwordVerify } = fields;

    if (!fieldsVerification(email, userName, firstName, lastName, password, passwordVerify)) return;

    const params = { email, userName, firstName, lastName, password };

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

      console.error(error);
    };

    setIsLoading(true);

    registerUser(params).then(onSuccess).catch(onError);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <Container
      display={'flex'}
      minH={'100vh'}
      minW={'100%'}
      align={'center'}
      justifyContent={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} maxW={'lg'} justify='center' minW={'520px'}>
        <Stack spacing='6'>
          <Center>
            <Logo width='100' height='100' />
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
              Create an account
            </Heading>
            <HStack spacing='1' justify='center'>
              <Text color='muted'>Already have an account?</Text>
              <Button variant='link' colorScheme='blue' onClick={navigateToLogin}>
                Login
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
          bg='white'
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
            <Stack spacing='5'>
              <Flex justify={'space-between'}>
                <FormControl maxW={'215px'} isRequired>
                  <FormLabel htmlFor='email' color={isFieldError.email ? 'red' : 'black'}>
                    {labels.email}
                  </FormLabel>
                  <Input
                    id='email'
                    type='email'
                    variant='filled'
                    name='email'
                    onChange={onChange}
                    value={fields.email}
                    isInvalid={isFieldError.email}
                  />
                </FormControl>
                <FormControl maxW={'215px'} isRequired>
                  <FormLabel htmlFor='userName' color={isFieldError.userName ? 'red' : 'black'}>
                    {labels.userName}
                  </FormLabel>
                  <Input
                    id='userName'
                    type='userName'
                    variant='filled'
                    name='userName'
                    onChange={onChange}
                    value={fields.userName}
                    isInvalid={isFieldError.userName}
                  />
                </FormControl>
              </Flex>
              <Flex justify={'space-between'}>
                <FormControl maxW={'215px'} isRequired>
                  <FormLabel htmlFor='firstName' color={isFieldError.firstName ? 'red' : 'black'}>
                    {labels.firstName}
                  </FormLabel>
                  <Input
                    id='firstName'
                    type='firstName'
                    variant='filled'
                    name='firstName'
                    onChange={onChange}
                    value={fields.firstName}
                    isInvalid={isFieldError.firstName}
                  />
                </FormControl>
                <FormControl maxW={'215px'} isRequired>
                  <FormLabel htmlFor='lastName' color={isFieldError.lastName ? 'red' : 'black'}>
                    {labels.lastName}
                  </FormLabel>
                  <Input
                    id='lastName'
                    type='lastName'
                    variant='filled'
                    name='lastName'
                    onChange={onChange}
                    value={fields.lastName}
                    isInvalid={isFieldError.lastName}
                  />
                </FormControl>
              </Flex>
              <FormControl isRequired>
                <InputGroup size='md' flexDirection='column'>
                  <FormLabel htmlFor='password' color={isFieldError.password ? 'red' : 'black'}>
                    {labels.password}
                  </FormLabel>
                  <Input
                    pr='4.5rem'
                    id='password'
                    variant='filled'
                    name='password'
                    value={fields.password}
                    type={showPassword.password ? 'text' : 'password'}
                    onChange={onChange}
                    isInvalid={isFieldError.password}
                  />
                  <InputRightElement width='4.5rem' marginTop='8'>
                    <Button
                      p
                      h='1.75rem'
                      w='4rem'
                      size='sm'
                      variant='solid'
                      colorScheme='blue'
                      name='password'
                      onClick={onShowPassword}
                    >
                      {showPassword.password ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup size='md' flexDirection='column' marginTop='4'>
                  <FormLabel htmlFor='passwordVerify' color={isFieldError.passwordVerify ? 'red' : 'black'}>
                    {labels.passwordVerify}
                  </FormLabel>
                  <Input
                    pr='4.5rem'
                    id='passwordVerify'
                    name='passwordVerify'
                    variant='filled'
                    value={fields.passwordVerify}
                    type={showPassword.passwordVerify ? 'text' : 'password'}
                    onChange={onChange}
                    isInvalid={isFieldError.passwordVerify}
                  />
                  <InputRightElement width='4.5rem' marginTop='8'>
                    <Button
                      p
                      h='1.75rem'
                      w='4rem'
                      size='sm'
                      variant='solid'
                      colorScheme='blue'
                      name='passwordVerify'
                      onClick={onShowPassword}
                    >
                      {showPassword.passwordVerify ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
            <Checkbox>
              <Button variant={'link'}>I agree with the privacy policy</Button>
            </Checkbox>
            <Stack spacing='6'>
              <Button isLoading={isLoading} colorScheme='blue' onClick={onSignUp}>
                Sign up
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

export default SignUp;
