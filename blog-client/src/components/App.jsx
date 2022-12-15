import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import PrivateRoute from './PrivateRoute';
import Login from './SignUp';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            component={<PrivateRoute>{<h1>da</h1>}</PrivateRoute>}
          />
          <Route exact path="/login" component={Login} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
