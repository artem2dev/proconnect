import { Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../helpers/localStorage';

const PrivateWrapper = () => {
  const auth = getItem('jwtToken');

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateWrapper;
