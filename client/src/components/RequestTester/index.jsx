import { Container } from '@chakra-ui/layout';
import Content from './Content';

const RequestTester = () => {
  return (
    <Container display={{ base: 'block', md: 'flex' }} mt='150' maxW='container.xl'>
      <Content />
    </Container>
  );
};
export default RequestTester;
