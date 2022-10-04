import { Container, Flex, FlexProps } from '@chakra-ui/react';
import { MenuMobile } from './MenuMobile';
import Sidebar from './sidebar/Sidebar';

interface PageLayoutProps extends FlexProps {
  maxW?: string;
  mt?: string;
}

const PageLayout = ({
  maxW = '960px',
  mt = '0',
  children,
}: PageLayoutProps) => {
  // UI
  return (
    <Flex flex={1} minH="100vh" mt={mt}>
      <MenuMobile />
      <Sidebar />
      <Flex flex={1} justifyContent="center">
        <Container
          w="100%"
          maxW={{ lg: maxW, xl: '1188px' }}
          pt={{ base: '16', lg: '10' }}
          pb={{ base: '8', md: '14' }}
        >
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default PageLayout;
