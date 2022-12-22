import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import { theme } from '../helpers/chakraTheme';
import ArticleCard from './Card';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import ProfileSettings from './ProfileSettings';
import SidebarWithHeader from './SideBar';
import SignUp from './SignUp';

const App = () => {
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
