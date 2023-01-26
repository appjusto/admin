import { Container, Flex, FlexProps } from '@chakra-ui/react';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { useRouteMatch } from 'react-router-dom';
import MainHeader from './MainHeader';
import { MenuMobile } from './MenuMobile';
import Sidebar from './sidebar/Sidebar';

interface PageLayoutProps extends FlexProps {
  maxW?: string;
  mt?: string;
}

const PageLayout = ({
  maxW = '1012px',
  mt = '0',
  children,
}: PageLayoutProps) => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  // helpers
  const isBackOffice = path.includes('backoffice');
  // UI
  return (
    <Flex flex={1} minH="100vh" mt={mt}>
      <MenuMobile />
      <Sidebar />
      <Flex flex={1} justifyContent="center">
        <Container
          position="relative"
          w="100%"
          maxW={{ lg: maxW }}
          pt={{
            base: isBackOffice ? '16' : isBackofficeUser ? '6' : '120px',
            lg: isBackOffice ? '10' : isBackofficeUser ? '6' : '100px',
          }}
          pb={{ base: '8', md: '14' }}
        >
          {!isBackOffice && <MainHeader maxW={{ lg: maxW }} />}
          {children}
        </Container>
      </Flex>
    </Flex>
  );
};

export default PageLayout;
