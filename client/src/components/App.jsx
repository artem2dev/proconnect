import { ChakraProvider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { getUser } from '../api/user';
import { getItem } from '../helpers/localStorage';
import { setGlobalState } from '../redux/globalStateSlice';
import { setUser } from '../redux/usersSlice';
import socket from '../socket';
import { theme } from '../themes/chakraTheme';
import './App.css';
import ArticlesScroll from './Articles';
import Article from './Articles/Article/Article';
import Friends from './Friends';
import Login from './Login';
import Messages from './Messages';
import Chat from './Messages/Chat';
import Notifications from './Notifications';
import PrivateRoute from './PrivateRoute';
import Profile from './Profile';
import ProfileSettings from './ProfileSettings';
import SignUp from './SignUp';
import UserList from './UsersList';

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

        socket.auth = { userId: data.id };
        socket.connect();
      };

      const onError = (err) => {
        dispatch(setGlobalState({ sidebarVisible: false }));
        dispatch(setUser({}));
      };

      getUser().then(onSuccess).catch(onError);

      return () => {
        socket.disconnect();
      };
    }
  }, [dispatch]);

  return (
    <ChakraProvider theme={theme}>
      <Router basename={'/'}>
        <div className='App'>
          <div className='container'>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path='' element={<ArticlesScroll />} />
                <Route path='users' element={<UserList />} />
                <Route path='notifications' element={<Notifications />} />
                <Route path='profile' element={<ProfileSettings />} />
                <Route path='messages' element={<Messages />} />
                <Route path='messages/:userName' element={<Chat />} />
                <Route path='profile/:userName/friends' element={<Friends />} />
                <Route path='profile/:userName' element={<Profile />} />
                <Route path='articles' element={<ArticlesScroll />} />
                <Route path='article/:id' element={<Article />} />
              </Route>
              <Route path='register' element={<SignUp />} />
              <Route path='login' element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;
