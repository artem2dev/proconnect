import { Navigate, Outlet } from 'react-router-dom';
import { getItem } from '../helpers/localStorage';
import SidebarWithHeader from './SideBar';

const PrivateWrapper = () => {
  const auth = getItem('jwtToken');

  return auth ? (
    <SidebarWithHeader>
      <Outlet />
    </SidebarWithHeader>
  ) : (
    <Navigate to='/login' />
  );
};

export default PrivateWrapper;
