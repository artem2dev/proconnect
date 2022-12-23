import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../helpers/chakraTheme';
import './App.css';
import ArticleCard from './Card';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ProfileSettings from './ProfileSettings';
import SidebarWithHeader from './SideBar';
import SignUp from './SignUp';
import { useEffect } from 'react';
import { getUser } from '../api/user';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/usersSlice';
import { getItem } from '../helpers/localStorage';
import { setGlobalState } from '../redux/globalState';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (getItem('jwtToken')) {
      dispatch(setGlobalState({ sidebarVisible: true }));

      const onSuccess = (data) => {
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
    }
  }, [dispatch]);

  return (
    <ChakraProvider theme={theme}>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <SidebarWithHeader>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<ArticleCard />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>
              <Route path="/register" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </SidebarWithHeader>
        </div>
      </Router>
    </ChakraProvider>
  );
};

export default App;
