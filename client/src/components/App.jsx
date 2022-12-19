import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import { ChakraProvider } from '@chakra-ui/react';

import PrivateRoute from './PrivateRoute';
import SignUp from './SignUp';
import Login from './Login';
import SidebarWithHeader from './SideBar';
import ArticleCard from './Card';
import ProfileSettings from './ProfileSettings';
import { theme } from '../helpers/chakraTheme';


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
