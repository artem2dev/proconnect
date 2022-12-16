import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import PrivateRoutes from './PrivateRoute';
// import SignUp from './SignUp';
import Login from './Login';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        {/* <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<SignUp />} />
            <Route path="/products" element={<SignUp />} />
          </Route>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes> */}
        <Login />
      </div>
    </Router>
  );
}

export default App;
