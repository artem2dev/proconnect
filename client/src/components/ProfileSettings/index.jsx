import { Container } from '@chakra-ui/react';
import Content from './Content';
import Sidebar from './Sidebar';

const ProfileSettings = () => {
  return (
    <Container display={{ base: 'block', md: 'flex' }} mt='150' maxW='container.xl'>
      <Sidebar />
      <Content />
    </Container>
  );
};
export default ProfileSettings;
