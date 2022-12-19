import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import PrivateRoute from './PrivateRoute';
import SignUp from './SignUp';
import Login from './Login';
import SidebarWithHeader from './SideBar';
import ArticleCard from './Card';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <SidebarWithHeader>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ArticleCard />} />
            </Route>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </SidebarWithHeader>
      </div>
    </Router>
  );
}

export default App;
