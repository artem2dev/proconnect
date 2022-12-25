import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUser } from '../../api/user';
import { setGlobalState } from '../../redux/globalState';
import { setUser } from '../../redux/usersSlice';

const fieldsInitialState = {
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
};

const defaultLabels = {
  userName: 'User name',
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
  password: 'Password',
};

const defaultErrorLabels = {
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
};

const Content = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const [fields, setFields] = useState(fieldsInitialState);
  const [labels, setLabels] = useState(defaultLabels);
  const [isLoading, setIsLoading] = useState(false);
  const [isFieldError, setIsFieldError] = useState(initialIsFieldError);
  const tabs = ['Account Settings', 'Company Settings', 'Notifications'];

  useEffect(() => {
    user?.id &&
      setFields((prev) => ({
        ...prev,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        userName: user?.userName,
      }));
  }, [user, setFields]);

  const onFieldChange = (e) => {
    const { name, value } = e.target;

    setIsFieldError({
      ...isFieldError,
      [name]: false,
    });
    setLabels({
      ...labels,
      [name]: defaultLabels[name],
    });

    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const fieldsVerification = (email, userName, firstName, lastName) => {
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

    return true;
  };

  const onUpdate = (e) => {
    e.preventDefault();

    const { email, userName, firstName, lastName, password, passwordVerify } =
      fields;

    if (
      !fieldsVerification(
        email,
        userName,
        firstName,
        lastName,
        password,
        passwordVerify,
      )
    )
      return;

    const params = { id: user?.id, email, userName, firstName, lastName };

    const onSuccess = () => {
      setIsLoading(false);

      const onSuccess = (data) => {
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

      getUser(onSuccess, onError);
    };

    const onError = (error) => {
      setIsLoading(false);

      console.error(error);
    };

    setIsLoading(true);

    updateUser(params, onSuccess, onError);
  };

  return (
    <Box
      as="main"
      flex={3}
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Tabs>
        <TabList px={5}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              mx={3}
              px={0}
              py={3}
              fontWeight="semibold"
              color="brand.cadet"
              borderBottomWidth={1}
              _active={{ bg: 'transparent' }}
              _selected={{ color: 'brand.dark', borderColor: 'brand.blue' }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels px={3} mt={5}>
          <TabPanel>
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              gap={6}
            >
              <FormControl id="firstName">
                <FormLabel
                  htmlFor="firstName"
                  color={isFieldError.firstName ? 'red' : 'black'}
                >
                  {labels.firstName}
                </FormLabel>
                <Input
                  id="firstName"
                  focusBorderColor="brand.blue"
                  type="text"
                  placeholder="Tim"
                  value={fields.firstName}
                  name="firstName"
                  onChange={onFieldChange}
                  isInvalid={isFieldError.firstName}
                />
              </FormControl>
              <FormControl id="lastName">
                <FormLabel
                  htmlFor="lastName"
                  color={isFieldError.lastName ? 'red' : 'black'}
                >
                  {labels.lastName}
                </FormLabel>
                <Input
                  id="lastName"
                  focusBorderColor="brand.blue"
                  type="text"
                  placeholder="Cook"
                  value={fields.lastName}
                  name="lastName"
                  onChange={onFieldChange}
                  isInvalid={isFieldError.lastName}
                />
              </FormControl>
              {/* <FormControl id="phoneNumber">
                <FormLabel>Phone Number</FormLabel>
                <Input
                  focusBorderColor="brand.blue"
                  type="tel"
                  placeholder="(408) 996–1010"
                />
              </FormControl> */}
              <FormControl id="userName">
                <FormLabel
                  htmlFor="userName"
                  color={isFieldError.userName ? 'red' : 'black'}
                >
                  {labels.userName}
                </FormLabel>
                <Input
                  id="userName"
                  focusBorderColor="brand.blue"
                  type="userName"
                  placeholder="Aboba"
                  value={fields.userName}
                  name="userName"
                  onChange={onFieldChange}
                  isInvalid={isFieldError.userName}
                />
              </FormControl>
              <FormControl id="emailAddress">
                <FormLabel
                  htmlFor="email"
                  color={isFieldError.email ? 'red' : 'black'}
                >
                  {labels.email}
                </FormLabel>
                <Input
                  id="email"
                  focusBorderColor="brand.blue"
                  type="email"
                  placeholder="email@email.com"
                  value={fields.email}
                  name="email"
                  onChange={onFieldChange}
                  isInvalid={isFieldError.email}
                />
              </FormControl>
              <FormControl id="city">
                <FormLabel>City</FormLabel>
                <Select focusBorderColor="brand.blue" placeholder="Select city">
                  <option defaultValue="california">California</option>
                  <option defaultValue="washington">Washington</option>
                  <option defaultValue="toronto">Toronto</option>
                  <option defaultValue="newyork">New York</option>
                  <option defaultValue="london">London</option>
                  <option defaultValue="netherland">Netherland</option>
                  <option defaultValue="poland">Poland</option>
                </Select>
              </FormControl>
              <FormControl id="country">
                <FormLabel>Country</FormLabel>
                <Select
                  focusBorderColor="brand.blue"
                  placeholder="option country"
                >
                  <option defaultValue="america">America</option>
                  <option defaultValue="england">England</option>
                  <option defaultValue="poland">Poland</option>
                </Select>
              </FormControl>
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              gap={6}
            >
              <FormControl id="companyId">
                <FormLabel>Company ID</FormLabel>
                <InputGroup>
                  <InputLeftAddon color="gray.500">
                    <svg width="1em" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </InputLeftAddon>
                  <Input
                    focusBorderColor="brand.blue"
                    type="text"
                    placeholder="apple"
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="companyName">
                <FormLabel>Name</FormLabel>
                <Input
                  focusBorderColor="brand.blue"
                  type="text"
                  placeholder="Apple"
                />
              </FormControl>
              <FormControl id="emailCompany">
                <FormLabel>Email Address</FormLabel>
                <Input
                  focusBorderColor="brand.blue"
                  type="email"
                  placeholder="info@apple.com"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Size</FormLabel>
                <NumberInput>
                  <NumberInputField placeholder="6000" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Grid>
          </TabPanel>
          <TabPanel>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel
                htmlFor="notificationEmails"
                mb={0}
                cursor="pointer"
                userSelect="none"
              >
                Receive notification emails
              </FormLabel>
              <Switch id="notificationEmails" />
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box mt={5} py={5} px={8} borderTopWidth={1} borderColor="brand.light">
        <Button onClick={onUpdate} isLoading={isLoading}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default Content;
