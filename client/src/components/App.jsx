import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from '../api/user';
import { theme } from '../helpers/chakraTheme';
import { getItem } from '../helpers/localStorage';
import { setGlobalState } from '../redux/globalStateSlice';
import { setUser } from '../redux/usersSlice';
import './App.css';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import ProfileSettings from './ProfileSettings';
import SidebarWithHeader from './SideBar';
import SignUp from './SignUp';
import UserList from './UsersList';
import Notifications from './Notifications';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (getItem('jwtToken')) {
      dispatch(setGlobalState({ sidebarVisible: true }));

      const onSuccess = ({ data }) => {
        dispatch(
          setUser({
            ...data,
          }),
        );
      };

      const onError = (err) => {
        dispatch(setGlobalState({ sidebarVisible: false }));
        dispatch(setUser({}));
      };

      getUser().then(onSuccess).catch(onError);
    }
  }, [dispatch]);

  return (
    <ChakraProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <div className='App'>
          <SidebarWithHeader>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path='/' element={<div />} />
                <Route path='/users' element={<UserList />} />
                <Route path='/notifications' element={<Notifications />} />
                <Route path='/profile' element={<ProfileSettings />} />
                <Route path='profile/:userName' element={<Profile />} />
              </Route>
              <Route path='/register' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </SidebarWithHeader>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;
